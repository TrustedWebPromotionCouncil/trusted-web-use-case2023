package domain

import (
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"encoding/json"
)

type CandidateProfile struct {
	Level                            int64  `csv:"Level"`
	Age                              int64  `csv:"Age"`
	Email                            string `csv:"Email"`
	Gender                           string `csv:"Gender"`
	Country                          string `csv:"Country"`
	City                             string `csv:"City"`
	DesiredSalary                    int64  `csv:"desired salary"`
	SelfIntroduction                 string `csv:"self-introduction"`
	ShowKnowledge                    bool   `csv:"IsShowKnowledge"`
	ShowResponsibility               bool   `csv:"IsShowResponsibility"`
	ShowCognitiveIndividual          bool   `csv:"IsShowCognitive/Individual"`
	ShowPeerCommunity                bool   `csv:"IsShowPeer/Community"`
	ShowBehaviorFromLearningAttitude bool   `csv:"IsShowBehavior from Learning Attitude"`
}

func (u CandidateProfile) EncryptRSA(publicKey *rsa.PublicKey) ([]byte, error) {
	j, err := json.Marshal(u)
	if err != nil {
		return nil, err
	}

	bs, err := rsa.EncryptPKCS1v15(rand.Reader, publicKey, j)
	if err != nil {
		return nil, err
	}

	return bs, nil
}

func (u *CandidateProfile) DecryptRSA(bs []byte, privateKey *rsa.PrivateKey) error {
	bs, err := rsa.DecryptPKCS1v15(rand.Reader, privateKey, bs)
	if err != nil {
		return err
	}

	err = json.NewDecoder(bytes.NewReader(bs)).Decode(&u)
	if err != nil {
		return err
	}

	return nil
}
