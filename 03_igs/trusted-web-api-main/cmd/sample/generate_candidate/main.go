// 空の候補者レコードを作成してIDを返す
package main

import (
	"github.com/Institution-for-a-Global-Society/trusted-web-api/app"
)

var d app.Dependencies

func init() {
	d = app.Init()
}

func main() {
	id, err := d.DomainProvider.GetServices().CandidateService.Create()
	if err != nil {
		panic((err))
	}

	logger := d.LoggerProvider.GetAppLogger()
	logger.Infof(`OK {"id": %d}`, id)
}
