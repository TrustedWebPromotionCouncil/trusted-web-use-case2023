package entry

import (
	"bytes"
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/apiio"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	rsa_helper "github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/rsa"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

type EntryClientPlanY struct {
	matchingEndpoint   string
	processingEndpoint string
	UserId             int64
	CkksPublickey      *rlwe.PublicKey // システムの暗号化鍵
	RsaPublickey       *rsa.PublicKey  // システムの暗号化鍵
	UserCkksKey        *ckks.Keys      // ユーザの暗号化鍵
}

// 暗号化計算結果
type CalculateResult struct {
	UserId int64
	Vector string
	Result string
}

type CalculateResultPlain struct {
	UserId int64
	Vector domain.CandidateVector
	Result domain.CandidateVectorCalcResult
}

func NewEntryClientPlanY(matchingEndpoint string, processingEndpoint string) (*EntryClientPlanY, error) {
	ret := EntryClientPlanY{
		matchingEndpoint:   matchingEndpoint,
		processingEndpoint: processingEndpoint,
	}
	var err error

	ret.UserCkksKey, err = ckks.GenerateKeys(domain.DefaultRotateRange)
	if err != nil {
		return nil, err
	}

	err = ret.exchangePublicKey()
	if err != nil {
		return nil, err
	}

	ret.saveSecretKey()

	return &ret, nil
}

func (c *EntryClientPlanY) saveSecretKey() error {
	s, err := ckks.ToBase64String(c.UserCkksKey.Secretkey)
	if err != nil {
		return err
	}

	fname := fmt.Sprintf("tmp/UserId=%d.secretkey", c.UserId)
	if err := os.WriteFile(fname, []byte(s), 0644); err != nil {
		return nil
	}
	log.Printf("save secretkey -> %s", fname)

	return nil
}

// 計算結果の暗号化を解く
func (c *EntryClientPlanY) DecryptResult(r *CalculateResult) (CalculateResultPlain, error) {
	ret := CalculateResultPlain{
		UserId: r.UserId,
	}

	dec, err := ckks.NewCalculatorUsingSecretkey(c.UserCkksKey.Secretkey)
	if err != nil {
		return ret, err
	}

	ctVec, err := ckks.FromBase64String[rlwe.Ciphertext](r.Vector)
	if err != nil {
		return ret, err
	}
	ret.Vector.DecyptRLWE(ctVec, dec)

	ctResult, err := ckks.FromBase64String[rlwe.Ciphertext](r.Result)
	if err != nil {
		return ret, err
	}
	ret.Result.DecyptRLWE(ctResult, dec)

	return ret, nil
}

// ユーザ作成 + 暗号化用公開鍵交換
func (c *EntryClientPlanY) exchangePublicKey() error {
	b64s, err := ckks.ToBase64String(c.UserCkksKey.Publickey)
	if err != nil {
		return err
	}

	postPayload, err := json.Marshal(apiio.RequestMatchingSystemPlanYPostPublickey{
		CkksPublickey: b64s,
	})
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/system/planY/publickey", c.matchingEndpoint)
	resp, err := http.Post(url, "application/json", bytes.NewReader(postPayload))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var ret apiio.ResponseMatchingSystemPlanYPostPublickey
	if err := json.Unmarshal(body, &ret); err != nil {
		return err
	}

	c.CkksPublickey, err = ckks.FromBase64String[rlwe.PublicKey](ret.CkksPublickey)
	if err != nil {
		return err
	}

	c.RsaPublickey, err = rsa_helper.PublicKeyFromPem([]byte(ret.RsaPublickey))
	if err != nil {
		return err
	}

	c.UserId = ret.UserId

	return nil
}

// 暗号化ベクトル投入 + 計算
func (c *EntryClientPlanY) RunCalculator(u domain.CandidateVector) (CalculateResult, error) {
	req := apiio.RequestProcessiongSystemPlanYPostEncryptedVectorData{
		UserId: c.UserId,
	}

	{ // 暗号化
		enc, err := ckks.NewCalculatorUsingPublickey(c.UserCkksKey.Publickey)
		if err != nil {
			return CalculateResult{}, err
		}

		ct := u.EncryptRLWE(enc)
		b64s, err := ckks.ToBase64String(ct)
		if err != nil {
			return CalculateResult{}, err
		}

		keysB64s, err := c.UserCkksKey.ConvertToBase64()
		if err != nil {
			return CalculateResult{}, err
		}

		req.Vector = string(b64s)
		req.Publickey = keysB64s.Publickey
		req.Rotatekey = keysB64s.Rotatekey
		req.Relinkey = keysB64s.Relinkey
	}

	reqPayload, err := json.Marshal(req)
	if err != nil {
		return CalculateResult{}, err
	}

	url := fmt.Sprintf("%s/system/planY/encrypted_vector_data", c.processingEndpoint)
	resp, err := http.Post(url, "application/json", bytes.NewReader(reqPayload))
	if err != nil {
		return CalculateResult{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		err := fmt.Errorf("Failed uri: %s, status: %d", url, resp.StatusCode)
		return CalculateResult{}, err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return CalculateResult{}, err
	}

	var respPayload apiio.ResponseProcessiongSystemPlanYPostEncryptedVectorData
	if err := json.Unmarshal(body, &respPayload); err != nil {
		return CalculateResult{}, err
	}

	log.Printf("OK uri: %s, status: %d\n", url, resp.StatusCode)

	return CalculateResult{
		UserId: respPayload.UserId,
		Vector: respPayload.Vector,
		Result: respPayload.Result,
	}, nil
}

// 計算結果を保存
func (c *EntryClientPlanY) SaveResult(u domain.CandidateProfile, r CalculateResultPlain) error {
	req := apiio.RequestMatchingSystemPlanYPostSecretCalculationResult{
		UserId: r.UserId,
	}

	{ // システムの鍵で再暗号化
		enc, err := ckks.NewCalculatorUsingPublickey(c.CkksPublickey)
		if err != nil {
			return err
		}

		ctVec := r.Vector.EncryptRLWE(enc)
		req.Vector, err = ckks.ToBase64String(ctVec)
		if err != nil {
			return err
		}

		ctResult := r.Result.EncryptRLWE(enc)
		req.Result, err = ckks.ToBase64String(ctResult)
		if err != nil {
			return err
		}
	}

	{ // プロファイルはそのまま暗号化
		enc, err := u.EncryptRSA(c.RsaPublickey)
		if err != nil {
			return err
		}
		req.Profile = base64.StdEncoding.EncodeToString(enc)
	}

	postPayload, err := json.Marshal(req)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/system/planY/secret_calculation_result", c.matchingEndpoint)
	resp, err := http.Post(url, "application/json", bytes.NewReader(postPayload))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent {
		err := fmt.Errorf("Failed uri: %s, status: %d", url, resp.StatusCode)
		return err
	}

	log.Printf("OK uri: %s, status: %d\n", url, resp.StatusCode)
	return nil
}
