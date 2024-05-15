use crate::error::SignatureError;
use crate::jwk_keys::JwkKey;
//use base64::{engine::general_purpose, Engine as _};
use num_bigint::BigUint;
use std::cmp::Ordering;
use std::convert::TryFrom;

const INTEGER_TOO_LARGE: &str = "integer too large";

const SIGNATURE_OUT_OF_RANGE: &str = "signature representative out of range";

const EM_TOO_SHORT: &str = "intended encoded message length too short";

const INVALID_SIGNATURE: &str = "invalid_signature";

const MODULUS_TOO_SHORT: &str = "RSA modulus too short";

#[derive(Debug, PartialEq, Eq)]
pub struct RSAPublicKey {
    n: BigUint,
    e: BigUint,
    k: usize,
}

impl RSAPublicKey {
    pub fn new(n_bytes: &[u8], e_bytes: &[u8]) -> Self {
        Self {
            n: os2ip(n_bytes),
            e: os2ip(e_bytes),
            k: n_bytes.len(),
        }
    }
}

impl TryFrom<&JwkKey> for RSAPublicKey {
    type Error = SignatureError;

    fn try_from(value: &JwkKey) -> Result<Self, Self::Error> {
        value.verify()?;
        Ok(Self::new(&value.n_bytes()?, &value.e_bytes()?))
    }
}

const HASH_PREFIX: &[u8; 19] = &[
    0x30, 0x31, 0x30, 0x0d, 0x06, 0x09, 0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01, 0x05,
    0x00, 0x04, 0x20,
];

fn os2ip(bytes: &[u8]) -> BigUint {
    BigUint::from_bytes_be(bytes)
}

fn i2osp(i: &BigUint, k: &usize) -> Result<Vec<u8>, String> {
    let i_os = i.to_bytes_be();
    let i_os_len = i_os.len();
    match i_os_len.cmp(k) {
        Ordering::Greater => Err(INTEGER_TOO_LARGE.to_string()),
        Ordering::Equal => Ok(i_os),
        Ordering::Less => {
            let mut os = vec![0_u8; *k];
            os[k - i_os_len..].copy_from_slice(&i_os);
            Ok(os)
        }
    }
}

fn rsavp1(pub_key: &RSAPublicKey, s: &BigUint) -> Result<BigUint, String> {
    if *s >= pub_key.n {
        return Err(SIGNATURE_OUT_OF_RANGE.to_string());
    }
    Ok(s.modpow(&pub_key.e, &pub_key.n))
}

fn hash(m_bytes: &[u8]) -> [u8; 32] {
    hmac_sha256::Hash::hash(m_bytes)
}

fn emsa_pkcs1_v15_encode_hash(h: &[u8; 32], k: &usize) -> Result<Vec<u8>, String> {
    let prefix_len = HASH_PREFIX.len();
    let hash_len = h.len();
    let t_len = prefix_len + hash_len;
    if *k < t_len + 11 {
        return Err(EM_TOO_SHORT.to_string());
    }

    // T = HASH_PREFIX || h
    // PS = 0xff * (k - 3 - t_len)
    // EM = 0x00 || 0x01 || PS || 0x00 || T
    let mut em = vec![0xff; *k];
    em[0] = 0;
    em[1] = 1;
    em[*k - t_len - 1] = 0;
    em[*k - t_len..*k - hash_len].copy_from_slice(HASH_PREFIX);
    em[*k - hash_len..].copy_from_slice(h);

    Ok(em)
}

fn emsa_pkcs1_v15_encode(m_bytes: &[u8], k: &usize) -> Result<Vec<u8>, String> {
    let h = hash(m_bytes);
    emsa_pkcs1_v15_encode_hash(&h, k)
}

pub fn rsassa_pkcs1_v15_verify(
    pub_key: &RSAPublicKey,
    m_bytes: &[u8],
    s_bytes: &[u8],
) -> Result<(), String> {
    let s = os2ip(s_bytes);
    let em = rsavp1(pub_key, &s).map_err(|_| INVALID_SIGNATURE.to_string())?;
    let em_bytes = i2osp(&em, &pub_key.k).map_err(|_| INVALID_SIGNATURE.to_string())?;

    let em2_bytes =
        emsa_pkcs1_v15_encode(m_bytes, &pub_key.k).map_err(|_| MODULUS_TOO_SHORT.to_string())?;
    if em_bytes != em2_bytes {
        return Err(INVALID_SIGNATURE.to_string());
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::error::ExpectedActual;

    use super::*;
    use crate::b64::{b64_decode, b64_encode};
    use rsa::{
        pkcs1v15::SigningKey,
        sha2::Sha256,
        signature::{Keypair, Signer, Verifier},
        traits::PublicKeyParts,
        RsaPrivateKey,
    };
    use std::fmt::Write;

    static N_B64: &str = "wnfD2k6iOI8IdDTKPY4J6HFOT1nKor6v2xEZ9G2n1_KtPs5-5aC8W_SvRTzXF9Ym-BeoQI5mfHSbaYafbeEDaCSVpxXja1K8n7EAlpYVGydTHgL2NLHADb-Gtkkiv8Gw9sSyea_foPW_i2YknOIyBM4A2Sxqf9VPQTSTj5zJGFtRnyQYuuTprxqj9qgZfAAhrGCizsW8bm62nH2DYORQ10rwaiY9kL4gVOPrU39vaB80YX5a2N-TRzDCzHaKlo9vSBMzysFs1WFmb9VdOLuIae1I7h50KFUIDncxv7tGrVxnYBi_etNl989JmDtDzLnPK3u4AMFEGcha52Y2QwxQeQ==";

    static E_B64: &str = "AQAB";

    static M_B64: &str = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRhMGI1ZDQyNDRjY2ZiNzViMjcwODQxNjI5NWYwNWQ1MThjYTY5MDMifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXRfaGFzaCI6Ijd2ajAzMklIQWdzMEdNUGxOUDFkV2ciLCJhdWQiOiI5MTQ2OTk1NzE0NS1qYjg0MnUwcmNnbTg3bTIyMDlhZWxiZnRzbDlwMzU3aS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzQ0MjQ1MDQ0MzI0NDAzNTk1NSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiI5MTQ2OTk1NzE0NS1qYjg0MnUwcmNnbTg3bTIyMDlhZWxiZnRzbDlwMzU3aS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImVtYWlsIjoiYm9idW5kZXJzb25AZ21haWwuY29tIiwiaWF0IjoxNDQzNzY4NzcxLCJleHAiOjE0NDM3NzIzNzF9";

    static S_B64: &str="bzNpok6tybsHOicXvbP9Q97kKO14ei3B1DXlNa8LFiZj8rQJfnm_rATRlMFEGs1fsW5Av7srDy-2JjdEbQufHbYlUBXIJh7_sBwI_qU6NIYn2t8hcGpMnXoe2z0BtkP3CyvvTINRVxA6WwHv_Teh0nzxnaxmcOVm0ajLKT603Crtt4MNur_azADTxNxYafaQ5o7XOo9V0PMM0nVy6kqn-N3IjxBPNXqQapmxub6qzJcRsOyAjOyzK1hRAuxvX9vd9fAoBf4ycpbeTWIy7nQIeEU8kl2lTNSb9DBZrsVP7GzhFRdEMDIxctcBoqXDxBuYLuSXGlnMyfSYy0sU39VBtw==";

    fn to_hex(bytes: &[u8]) -> String {
        bytes.iter().fold(String::new(), |mut output, b| {
            let _ = write!(output, "{b:02x}");
            output
        })
    }

    #[test]
    fn test_rsa_public_key_try_from() {
        let n = BigUint::from(123_456_u32);
        let e = BigUint::from(65_537_u32);
        let n_bytes = n.to_bytes_be();
        let n_b64 = b64_encode(n_bytes);
        let key1 = JwkKey {
            kid: "1".to_string(),
            e: "AQAB".to_string(),
            alg: "RS256".to_string(),
            kty: "RSA".to_string(),
            n: n_b64.clone(),
        };
        let pub_key = RSAPublicKey::try_from(&key1).unwrap();
        assert_eq!(n, pub_key.n);
        assert_eq!(e, pub_key.e);
    }

    #[test]
    fn test_rsa_public_key_try_from_verify_error() {
        let n = BigUint::from(123_456_u32);
        let n_bytes = n.to_bytes_be();
        let n_b64 = b64_encode(n_bytes);
        let key1 = JwkKey {
            kid: "1".to_string(),
            e: "AQAB".to_string(),
            alg: "RS256xxx".to_string(),
            kty: "RSA".to_string(),
            n: n_b64.clone(),
        };
        let ret = RSAPublicKey::try_from(&key1);
        assert!(ret.is_err());
        assert_eq!(
            SignatureError::InvalidAlg(ExpectedActual {
                expected: "RS256".to_string(),
                actual: "RS256xxx".to_string(),
            }),
            ret.err().unwrap()
        );
    }

    #[test]
    fn test_b64_decode() {
        let n = b64_decode(N_B64).unwrap();
        let s = b64_decode(S_B64).unwrap();
        let e = b64_decode(E_B64).unwrap();
        assert_eq!(256, n.len());
        assert_eq!(256, s.len());
        assert_eq!(vec![0x01, 0x00, 0x01], e);
    }

    #[test]
    fn test_os2ip_i2osp() {
        let s_bytes = b64_decode(S_B64).unwrap();
        let e_bytes = b64_decode(E_B64).unwrap();
        let n_bytes = b64_decode(N_B64).unwrap();
        let k = n_bytes.len();
        let s = os2ip(&s_bytes);
        let e = os2ip(&e_bytes);
        let n = os2ip(&n_bytes);
        let s_str = "14037804365398619033799742640081377671043057392694415291597804147713491410445513866006008669704199482642441064706170013125771718244722040567525603708239315719194626418847133365097820713692422830687511756532781524139994240604245694191169325425909683490950378139360773189150119316465859211171776644949608317203118384030102880369548355566253684947673392290546588239119176056964914307676545633029747304365762240535067374062714801022561146061109390909542430785821617643241252874218057283792444274583960379759363660222517314804403953534923619970309443919685333767236614480532808644706485562780884529114424361077491176391095";
        let n_str = "24549289510632605743828281506105030559610031524422134500113472460208128475168457154320259619401711032477506694020213504345424980047694413652485569799489121870314361976276233745738428718574570569704849687430941786961766001202342841272030907099310419935446778528424597582843520641811243991078343587230750698540931685351263183812151904389482571088023928366597666707315219355321599743233044916421676646710403431540311822873182594152916697319726740643932804361756260419803505774196445304398131756336807229833319900899418910795600737519652527408712652366429896829367638043818159485130318471593854554900537645849182506602617";
        assert_eq!(s_str, s.to_string());
        assert_eq!(BigUint::from(65537_u32), e);
        assert_eq!(n_str, n.to_string());

        assert_eq!(s_bytes, i2osp(&s, &k).unwrap());
        assert_eq!(e_bytes, i2osp(&e, &e_bytes.len()).unwrap());
        assert_eq!(n_bytes, i2osp(&n, &k).unwrap());
    }

    #[test]
    fn test_i2osp_padding() {
        let i = BigUint::from(1_u8);
        let os = vec![0_u8, 1_u8];
        assert_eq!(os, i2osp(&i, &2).unwrap());
    }

    #[test]
    fn test_i2osp_err() {
        let i = BigUint::from(65537_u32);
        let result = i2osp(&i, &2);
        assert!(result.is_err());
        assert_eq!("integer too large", result.err().unwrap());
    }

    #[test]
    fn test_rsavp1() {
        let s_bytes = b64_decode(S_B64).unwrap();
        let e_bytes = b64_decode(E_B64).unwrap();
        let n_bytes = b64_decode(N_B64).unwrap();
        let k = n_bytes.len();
        let s = os2ip(&s_bytes);
        let em = rsavp1(&RSAPublicKey::new(&n_bytes, &e_bytes), &s).unwrap();
        let em_str = "986236757547332986472011617696226561292849812918563355472727826767720188564083584387121625107510786855734801053524719833194566624465665316622563244215340671405971599343902468620306327831715457360719532421388780770165778156818229863337344187575566725786793391480600129482653072861971002459947277805295727097226389568776499707662505334062639449916265137796823793276300221537201727072401742985542559596685092673521228140822200236743113743661549252453726123450722876929538747702356573783116197523966334991563351853851212597377279504828784675811158154858862009196731249195722389749547251860179386006643765857644703155";
        assert_eq!(em_str, em.to_string());
        let em_bytes = i2osp(&em, &k).unwrap();
        let em_hex = to_hex(&em_bytes);
        let em_hex_expected = "0001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff003031300d0609608648016503040201050004200c066e94c392758e604ed753d81048699aa61f93af9964df09f106504c07edb3";
        assert_eq!(em_hex_expected, em_hex);
    }

    #[test]
    fn test_rsavp1_err() {
        let n = BigUint::from(11_u8);
        let e = BigUint::from(65537_u32);
        let s = n.clone();
        let result = rsavp1(&RSAPublicKey::new(&n.to_bytes_be(), &e.to_bytes_be()), &s);
        assert!(result.is_err());
        assert_eq!(
            "signature representative out of range".to_string(),
            result.err().unwrap()
        );
    }

    #[test]
    fn test_hash() {
        let h = hash(M_B64.as_bytes());
        let h_hex = to_hex(&h);
        let expected = "0c066e94c392758e604ed753d81048699aa61f93af9964df09f106504c07edb3";
        assert_eq!(expected, h_hex);
    }

    #[test]
    fn test_emsa_pkcs1_v15_encode_hash() {
        let h = hash(M_B64.as_bytes());
        let em = emsa_pkcs1_v15_encode_hash(&h, &256).unwrap();
        let em_hex = to_hex(&em);
        let expected = "0001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff003031300d0609608648016503040201050004200c066e94c392758e604ed753d81048699aa61f93af9964df09f106504c07edb3";
        assert_eq!(expected, em_hex);
    }

    #[test]
    fn test_emsa_pkcs1_v15_encode_hash_err() {
        let h = hash(M_B64.as_bytes());
        let result = emsa_pkcs1_v15_encode_hash(&h, &42);
        assert!(result.is_err());
        assert_eq!(
            "intended encoded message length too short".to_string(),
            result.err().unwrap()
        );
    }

    #[test]
    fn test_emsa_pkcs1_v15_encode() {
        let em = emsa_pkcs1_v15_encode(M_B64.as_bytes(), &256).unwrap();
        let em_hex = to_hex(&em);
        let expected = "0001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff003031300d0609608648016503040201050004200c066e94c392758e604ed753d81048699aa61f93af9964df09f106504c07edb3";
        assert_eq!(expected, em_hex);
    }

    #[test]
    fn test_rsassa_pkcs1_v15_verify() {
        let s_bytes = b64_decode(S_B64).unwrap();
        let n_bytes = b64_decode(N_B64).unwrap();
        let e_bytes = b64_decode(E_B64).unwrap();
        let pub_key = RSAPublicKey::new(&n_bytes, &e_bytes);
        let result = rsassa_pkcs1_v15_verify(&pub_key, M_B64.as_bytes(), &s_bytes);
        assert!(result.is_ok());
    }

    #[test]
    fn test_rsa_pkcs1v15_signatures() {
        let mut rng = rand::thread_rng();
        let bits = 2048;
        let private_key = RsaPrivateKey::new(&mut rng, bits).unwrap();
        let public_key = private_key.to_public_key();
        let signing_key = SigningKey::<Sha256>::new(private_key);
        let verifing_key = signing_key.verifying_key();
        let data = b"hello world";
        let signature = signing_key.sign(data);
        let sig_bytes: Box<[u8]> = signature.clone().into();
        let v = verifing_key.verify(data, &signature);
        assert!(v.is_ok());
        let public_key2 = RSAPublicKey {
            n: os2ip(&public_key.n().to_bytes_be()),
            e: os2ip(&public_key.e().to_bytes_be()),
            k: public_key.size(),
        };
        let v2 = rsassa_pkcs1_v15_verify(&public_key2, data, &sig_bytes);
        assert!(v2.is_ok());
    }
}
