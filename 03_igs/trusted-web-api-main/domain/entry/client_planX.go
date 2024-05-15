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

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/apiio"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	rsa_helper "github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/rsa"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

type EntryClientPlanX struct {
	matchingEndpoint   string
	processingEndpoint string
	UserId             int64
	CkksPublickey      *rlwe.PublicKey
	RsaPublickey       *rsa.PublicKey
}

func NewEntryClientPlanX(matchingEndpoint string, processingEndpoint string) (*EntryClientPlanX, error) {
	ret := EntryClientPlanX{
		matchingEndpoint:   matchingEndpoint,
		processingEndpoint: processingEndpoint,
	}

	err := ret.getPublicKey()
	if err != nil {
		return nil, err
	}

	return &ret, nil
}

// ユーザ作成 + システムの公開鍵を取得
func (c *EntryClientPlanX) getPublicKey() error {
	url := fmt.Sprintf("%s/system/planX/new_candidate", c.matchingEndpoint)
	resp, err := http.Post(url, "application/json", nil)
	if err != nil {
		return err
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var ret apiio.ResponseMatchingSystemPlanXGetPublickey
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

// プロファイルデータ保存
func (c *EntryClientPlanX) SaveProfileData(u domain.CandidateProfile) error {
	encbs, err := u.EncryptRSA(c.RsaPublickey)
	if err != nil {
		return err
	}
	b64s := base64.StdEncoding.EncodeToString(encbs)

	postPayload, err := json.Marshal(apiio.RequestMatchingSystemPlanXPostEncryptedProfileData{
		UserId:  c.UserId,
		Payload: b64s,
	})
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/system/planX/encrypted_profile_data", c.matchingEndpoint)
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

// ベクトルデータ投入 + 計算 + 結果保存
func (c *EntryClientPlanX) RunCalculator(u domain.CandidateVector) error {
	calcPk, err := ckks.NewCalculatorUsingPublickey(c.CkksPublickey)
	if err != nil {
		return err
	}

	ct := u.EncryptRLWE(calcPk)
	bs, err := ckks.ToBase64String(ct)
	if err != nil {
		return err
	}

	postPayload, err := json.Marshal(apiio.RequestProcessiongSystemPlanXPostEncryptedVectorData{
		UserId:  c.UserId,
		Payload: string(bs),
	})
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/system/planX/encrypted_vector_data", c.processingEndpoint)
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
