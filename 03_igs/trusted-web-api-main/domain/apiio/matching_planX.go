package apiio

type ResponseMatchingSystemPlanXGetPublickey struct {
	UserId        int64  `json:"user_id"`
	CkksPublickey string `json:"ckks_publickey"`
	RsaPublickey  string `json:"rsa_publickey"`
}

type RequestMatchingSystemPlanXPostEncryptedProfileData struct {
	UserId  int64  `json:"user_id" binding:"required"`
	Payload string `json:"payload" binding:"required"`
}

type RequestMatchingSystemPlanXPostSecretCalculationResult struct {
	UserId int64  `json:"user_id" binding:"required"`
	Vector string `json:"vector" binding:"required"`
	Result string `json:"result" binding:"required"`
}

type ResponseMatchingSystemPlanXGetEncryptedWeights struct {
	Payload   string `json:"payload" binding:"required"`
	Publickey string `json:"publickey" binding:"required"`
	Rotatekey string `json:"rotatekey" binding:"required"`
	Relinkey  string `json:"relinkey" binding:"required"`
}

type RequestProcessiongSystemPlanXPostEncryptedVectorData struct {
	UserId  int64  `json:"user_id" binding:"required"`
	Payload string `json:"payload" binding:"required"`
}
