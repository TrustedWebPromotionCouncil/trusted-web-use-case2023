package rsa

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
)

const KeyBitSize = 4096 // NOTE: 2048 bit だと長さが足りない

type Keys struct {
	Publickey  *rsa.PublicKey
	Privatekey *rsa.PrivateKey
}

type KeysB64s struct {
	Publickey  string
	Privatekey string
}

func PrivateKeyToPem(rsaPrivateKey *rsa.PrivateKey) []byte {
	derRsaPrivateKey := x509.MarshalPKCS1PrivateKey(rsaPrivateKey)
	bs := pem.EncodeToMemory(&pem.Block{Type: "RSA PRIVATE KEY", Bytes: derRsaPrivateKey})
	return bs
}

func PublicKeyToPem(rsaPublicKey *rsa.PublicKey) []byte {
	derRsaPublicKey := x509.MarshalPKCS1PublicKey(rsaPublicKey)
	bs := pem.EncodeToMemory(&pem.Block{Type: "RSA PUBLIC KEY", Bytes: derRsaPublicKey})
	return bs
}

func PrivateKeyFromPem(bs []byte) (*rsa.PrivateKey, error) {
	block, _ := pem.Decode(bs)
	if block == nil || block.Type != "RSA PRIVATE KEY" {
		return nil, fmt.Errorf("failed to decode PEM block containing private key")
	}

	key, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	return key, err
}

func PublicKeyFromPem(bs []byte) (*rsa.PublicKey, error) {
	block, _ := pem.Decode(bs)
	if block == nil || block.Type != "RSA PUBLIC KEY" {
		return nil, fmt.Errorf("failed to decode PEM block containing public key")
	}

	key, err := x509.ParsePKCS1PublicKey(block.Bytes)
	return key, err
}

func GenerateKeysB64s() (*KeysB64s, error) {
	privateKey, err := rsa.GenerateKey(rand.Reader, KeyBitSize)
	if err != nil {
		return nil, err
	}

	keys := KeysB64s{
		Privatekey: string(PrivateKeyToPem(privateKey)),
		Publickey:  string(PublicKeyToPem(&privateKey.PublicKey)),
	}

	return &keys, nil
}

func (k KeysB64s) ConvertToRaw() (Keys, error) {
	var ret Keys
	var err error

	ret.Publickey, err = PublicKeyFromPem([]byte(k.Publickey))
	if err != nil {
		return Keys{}, err
	}

	ret.Privatekey, err = PrivateKeyFromPem([]byte(k.Privatekey))
	if err != nil {
		return Keys{}, err
	}

	return ret, nil
}
