// 秘密計算に必要な鍵を生成してDBに保存する
//
// 初回起動前に一度手動で実行する必要がある
// 実行するたびに新たにレコードを作成するが、計算には最新のレコードが使われる
package main

import (
	"github.com/Institution-for-a-Global-Society/trusted-web-api/app"
)

var d app.Dependencies

func init() {
	d = app.Init()
}

func main() {
	id, err := d.DomainProvider.GetServices().EncryptKeyService.Create()
	if err != nil {
		panic((err))
	}

	logger := d.LoggerProvider.GetAppLogger()
	logger.Infof(`OK {"id": %d}`, id)
}
