package database

import (
	"errors"
	"time"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/rsa"
	"gorm.io/gorm"
)

type EncryptKey struct {
	Id int64 `gorm:"column:id"`

	CkksPublickey string `gorm:"column:ckks_publickey;"`
	CkksSecretkey string `gorm:"column:ckks_secretkey;"`
	CkksRotatekey string `gorm:"column:ckks_rotatekey;"`
	CkksRelinkey  string `gorm:"column:ckks_relinkey;"`
	RsaPublickey  string `gorm:"column:rsa_publickey;"`
	RsaPrivatekey string `gorm:"column:rsa_privatekey;"`

	CreatedAt time.Time `gorm:"column:created_at"`
}

func (_ *EncryptKey) Create() (int64, error) {
	db := dbMain

	rsa_keys, err := rsa.GenerateKeysB64s()
	if err != nil {
		return 0, err
	}

	ckks_keys, err := ckks.GenerateKeysB64s(domain.DefaultRotateRange)
	if err != nil {
		return 0, err
	}

	enckey := EncryptKey{
		RsaPrivatekey: rsa_keys.Privatekey,
		RsaPublickey:  rsa_keys.Publickey,
		CkksSecretkey: ckks_keys.Secretkey,
		CkksPublickey: ckks_keys.Publickey,
		CkksRotatekey: ckks_keys.Rotatekey,
		CkksRelinkey:  ckks_keys.Relinkey,
	}

	result := db.Create(&enckey)
	if result.Error != nil {
		return 0, result.Error
	}

	return enckey.Id, nil
}

func (_ *EncryptKey) Get() (domain.EncryptKey, bool, error) {
	db := dbMain
	var row EncryptKey

	result := db.Last(&row)
	if result.Error != nil {
		logger.Error(result.Error)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return domain.EncryptKey{}, false, nil
		}
		return domain.EncryptKey{}, false, result.Error
	}

	return domain.EncryptKey{
		Ckks: ckks.KeysB64s{
			Secretkey: row.CkksSecretkey,
			Publickey: row.CkksPublickey,
			Rotatekey: row.CkksRotatekey,
			Relinkey:  row.CkksRelinkey,
		},
		Rsa: rsa.KeysB64s{
			Publickey:  row.RsaPublickey,
			Privatekey: row.RsaPrivatekey,
		},
	}, true, nil
}
