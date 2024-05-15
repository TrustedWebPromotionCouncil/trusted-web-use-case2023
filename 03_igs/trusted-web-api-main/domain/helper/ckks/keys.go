package ckks

import (
	"encoding/base64"

	"github.com/tuneinsight/lattigo/v4/ckks"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

var CkksParams = ckks.ParametersLiteral{
	LogN:         13,                                                // Log2 of the ringdegree
	LogSlots:     12,                                                // Log2 of the number of slots
	LogQ:         []int{55, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40}, // Log2 of the ciphertext prime moduli
	LogP:         []int{61, 61, 61, 61},                             // Log2 of the key-switch auxiliary prime moduli
	DefaultScale: 1 << 40,                                           // Log2 of the scale
	H:            192,                                               // Hamming weight of the secret
}

type Keys struct {
	Publickey *rlwe.PublicKey
	Secretkey *rlwe.SecretKey
	Rotatekey *rlwe.RotationKeySet
	Relinkey  *rlwe.RelinearizationKey
}

type KeysB64s struct {
	Publickey string
	Secretkey string
	Rotatekey string
	Relinkey  string
}

func ToBase64String(key interface {
	MarshalBinary() ([]byte, error)
}) (string, error) {
	bs, err := key.MarshalBinary()
	if err != nil {
		return "", err
	}
	b64s := base64.StdEncoding.EncodeToString(bs)
	return b64s, nil
}

func FromBase64String[
	T rlwe.SecretKey | rlwe.PublicKey | rlwe.RotationKeySet | rlwe.RelinearizationKey | rlwe.Ciphertext,
	PT interface {
		UnmarshalBinary([]byte) error
		*T
	}](b64s string) (PT, error) {
	bs, err := base64.StdEncoding.DecodeString(b64s)
	if err != nil {
		return nil, err
	}

	var key T
	err = PT(&key).UnmarshalBinary(bs)
	if err != nil {
		return nil, err
	}

	return &key, nil
}

func GenerateKeys(r RotateRange) (*Keys, error) {
	params, err := ckks.NewParametersFromLiteral(CkksParams)
	if err != nil {
		return nil, err
	}

	kgen := ckks.NewKeyGenerator(params)
	sk, _ := kgen.GenKeyPair()

	dec, err := NewCalculatorUsingSecretkey(sk)
	if err != nil {
		return nil, err
	}

	enc, err := dec.NewCalculatorUsingPublickey(r)
	if err != nil {
		return nil, err
	}

	return &Keys{
		Secretkey: dec.secretkey,
		Publickey: enc.publickey,
		Rotatekey: enc.rotkey,
		Relinkey:  enc.relinkey,
	}, nil
}

func GenerateKeysB64s(r RotateRange) (*KeysB64s, error) {
	var b64s KeysB64s

	keys, err := GenerateKeys(r)
	if err != nil {
		return nil, err
	}

	b64s.Secretkey, err = ToBase64String(keys.Secretkey)
	if err != nil {
		return nil, err
	}

	b64s.Publickey, err = ToBase64String(keys.Publickey)
	if err != nil {
		return nil, err
	}

	b64s.Rotatekey, err = ToBase64String(keys.Rotatekey)
	if err != nil {
		return nil, err
	}

	b64s.Relinkey, err = ToBase64String(keys.Relinkey)
	if err != nil {
		return nil, err
	}

	return &b64s, nil
}

func (k KeysB64s) ConvertToRaw() (Keys, error) {
	var ret Keys
	var err error

	ret.Publickey, err = FromBase64String[rlwe.PublicKey](k.Publickey)
	if err != nil {
		return Keys{}, err
	}

	ret.Secretkey, err = FromBase64String[rlwe.SecretKey](k.Secretkey)
	if err != nil {
		return Keys{}, err
	}

	ret.Rotatekey, err = FromBase64String[rlwe.RotationKeySet](k.Rotatekey)
	if err != nil {
		return Keys{}, err
	}

	ret.Relinkey, err = FromBase64String[rlwe.RelinearizationKey](k.Relinkey)
	if err != nil {
		return Keys{}, err
	}

	return ret, nil
}

func (k Keys) ConvertToBase64() (KeysB64s, error) {
	var ret KeysB64s
	var err error

	ret.Publickey, err = ToBase64String(k.Publickey)
	if err != nil {
		return KeysB64s{}, err
	}

	ret.Secretkey, err = ToBase64String(k.Secretkey)
	if err != nil {
		return KeysB64s{}, err
	}

	ret.Rotatekey, err = ToBase64String(k.Rotatekey)
	if err != nil {
		return KeysB64s{}, err
	}

	ret.Relinkey, err = ToBase64String(k.Relinkey)
	if err != nil {
		return KeysB64s{}, err
	}

	return ret, nil
}
