package database

import (
	"errors"
	"time"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"gorm.io/gorm"
)

type CandidateEncryptKey struct {
	Id          int64 `gorm:"column:id"`
	CandidateId int64 `gorm:"column:candidate_id"`

	CkksPublickey string `gorm:"column:ckks_publickey;"`

	CreatedAt time.Time `gorm:"column:created_at"`
}

func (_ *CandidateEncryptKey) Get(candidateId int64) (domain.CandidateEncryptKey, bool, error) {
	db := dbMain
	v := CandidateEncryptKey{
		CandidateId: candidateId,
	}

	result := db.Where(v).First(&v)
	if result.Error != nil {
		logger.Error(result.Error)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return domain.CandidateEncryptKey{}, false, nil
		}
		return domain.CandidateEncryptKey{}, false, result.Error
	}
	logger.Infof("parse request : %#v", result)

	return domain.CandidateEncryptKey{
		CkksPublickey: v.CkksPublickey,
	}, true, nil
}
