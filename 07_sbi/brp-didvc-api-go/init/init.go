package init

import (
	"brp-didvc-api-go/helper"
)

func init() {
	helper.GetInfoLogger().Println("init function.")

	helper.InitAWSCfg()
}
