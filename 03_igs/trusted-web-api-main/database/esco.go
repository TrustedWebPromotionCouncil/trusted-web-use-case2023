package database

import (
	"errors"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"gorm.io/gorm"
)

type Esco struct {
	EscoId          int64  `gorm:"column:escoid;primaryKey"`
	EscoDescription string `gorm:"column:esco_description"`
}

func (u *Esco) Get(id int64) (domain.Esco, bool, error) {
	s := Esco{EscoId: id}
	db := dbMain

	result := db.Find(&s)
	if result.Error != nil {
		logger.Error(result.Error)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return domain.Esco{}, false, nil
		}
		return domain.Esco{}, false, result.Error
	}

	return domain.Esco{
		EscoId:          s.EscoId,
		EscoDescription: s.EscoDescription,
	}, true, nil
}
