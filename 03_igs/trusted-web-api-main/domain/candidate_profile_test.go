package domain

import (
	"crypto/rand"
	"crypto/rsa"
	"log"
	"testing"

	rsa_helper "github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/rsa"
)

var P = CandidateProfile{
	Level:            222,
	Age:              44,
	Email:            "E@mail.com",
	Gender:           "Male",
	Country:          "JAPAN",
	City:             "AC",
	DesiredSalary:    3333333,
	SelfIntroduction: "this is test",
}

func TestProfileの暗号化と復号化(t *testing.T) {
	log.Println("TestProfileの暗号化と復号化 running")

	privateKey, err := rsa.GenerateKey(rand.Reader, rsa_helper.KeyBitSize)
	if err != nil {
		panic(err)
	}

	encBs, err := P.EncryptRSA(&privateKey.PublicKey)
	if err != nil {
		panic(err)
	}

	var actual CandidateProfile
	err = actual.DecryptRSA(encBs, privateKey)
	if err != nil {
		panic(err)
	}

	expect := P
	if expect != actual {
		t.Errorf("[%d] FAILED expected: %+v, actual %+v", 0, expect, actual)
	}
}
