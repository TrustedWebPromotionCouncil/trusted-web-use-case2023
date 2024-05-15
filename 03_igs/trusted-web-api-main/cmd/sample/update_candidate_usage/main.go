// Candidate 作成と Profile, Vector の更新サンプル
package main

import (
	"fmt"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/app"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/database"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
)

var d app.Dependencies

func init() {
	d = app.Init()
}

func main() {
	logger := d.LoggerProvider.GetAppLogger()
	srv := d.DomainProvider.GetServices().CandidateService

	id, err := srv.Create()
	if err != nil {
		panic((err))
	}
	logger.Infof(`OK {"id": %d}`, id)

	{
		v := domain.CandidateVector{
			CandidateVectorHardSkill: domain.CandidateVectorHardSkill{
				TimeSeriesAnalysis: 1.0,
			},
		}
		srv.UpdateVector(id, v)

		vr := domain.CandidateVectorCalcResult{
			Knowledge: 100,
		}
		srv.UpdateVectorCalcResult(id, vr)

		p := domain.CandidateProfile{
			Level: 123,
		}
		srv.UpdateProfile(id, p)
	}

	{
		v2, exists, err := srv.Get(id)
		fmt.Println(exists, err)
		fmt.Printf("%+v\n", v2)
	}

	{
		ckksKeys, err := ckks.GenerateKeysB64s(domain.DefaultRotateRange)
		if err != nil {
			panic((err))
		}
		srv.UpdateEncryptKey(id, domain.CandidateEncryptKey{
			CkksPublickey: ckksKeys.Publickey,
		})

		v2, exists, err := srv.GetEncryptKey(id)
		fmt.Println(exists, err)
		fmt.Printf("%+v\n", v2)
	}

	{
		// CandidateVector の service は用意していない
		cv := database.CandidateVector{}
		cvr, exists, err := cv.Get(id)
		fmt.Println(exists, err)
		fmt.Printf("%+v\n", cvr)
	}
}
