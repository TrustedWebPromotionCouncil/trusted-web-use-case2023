package domain

import (
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	rsa_helper "github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/rsa"
)

type EncryptKey struct {
	Ckks ckks.KeysB64s
	Rsa  rsa_helper.KeysB64s
}

type EncryptKeyRaw struct {
	Ckks ckks.Keys
	Rsa  rsa_helper.Keys
}

type EncryptKeyServiceDependencies struct {
	Persistents PersistentDependencies
}

type EncryptKeyService struct {
	d EncryptKeyServiceDependencies
}

func (s *EncryptKeyService) Create() (int64, error) {
	return s.d.Persistents.EncryptKey.Create()
}

func (s *EncryptKeyService) Get() (EncryptKey, bool, error) {
	return s.d.Persistents.EncryptKey.Get()
}

func (s *EncryptKeyService) ConvertToRaw(enckey *EncryptKey) (*EncryptKeyRaw, error) {
	var ret EncryptKeyRaw
	var err error

	ret.Ckks, err = enckey.Ckks.ConvertToRaw()
	if err != nil {
		logger.Error(err)
		return nil, err
	}

	ret.Rsa, err = enckey.Rsa.ConvertToRaw()
	if err != nil {
		logger.Error(err)
		return nil, err
	}

	return &ret, nil
}
