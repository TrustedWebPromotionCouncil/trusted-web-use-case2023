package rsa

import (
	"crypto/rand"
	"crypto/rsa"
	"log"
	"testing"
)

func Test暗号化と復号化(t *testing.T) {
	log.Println("Test暗号化と復号化 running")

	s := `{"Level":3,"Age":21,"Email":"ccc@email.jp","Gender":"Famale","Country":"Japan","City":"Tokyo","DesiredSalary":500,"SelfIntroduction":"Hello","ShowKnowledge":true,"ShowResponsibility":true,"ShowCognitiveIndividual":false,"ShowPeerCommunity":false,"ShowBehaviorFromLearningAttitude":false}`
	log.Println(len(s))

	privateKey, err := rsa.GenerateKey(rand.Reader, KeyBitSize)
	if err != nil {
		panic(err)
	}

	encBs, err := rsa.EncryptPKCS1v15(rand.Reader, &privateKey.PublicKey, []byte(s))
	if err != nil {
		panic(err)
	}

	decBs, err := rsa.DecryptPKCS1v15(rand.Reader, privateKey, encBs)
	if err != nil {
		panic(err)
	}

	expect := s
	actual := string(decBs)
	if expect != actual {
		t.Errorf("[%d] FAILED expected: %+v, actual %+v", 0, expect, actual)
	}
}
