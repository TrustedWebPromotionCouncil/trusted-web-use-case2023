package apiio

type RequestMatchingSystemPlanYPostPublickey struct {
	CkksPublickey string `json:"ckks_publickey" binding:"required"`
}

type ResponseMatchingSystemPlanYPostPublickey struct {
	UserId        int64  `json:"user_id" binding:"required"`
	CkksPublickey string `json:"ckks_publickey" binding:"required"`
	RsaPublickey  string `json:"rsa_publickey" binding:"required"`
}

type RequestMatchingSystemPlanYGetEncryptedWeights struct {
	UserID int64 `uri:"user_id" binding:"required"`
}

type ResponseMatchingSystemPlanYGetEncryptedWeights struct {
	Payload string `json:"payload" binding:"required"`
}

type RequestMatchingSystemPlanYPostSecretCalculationResult struct {
	UserId  int64  `json:"user_id" binding:"required"`
	Profile string `json:"profile" binding:"required"`
	Vector  string `json:"vector" binding:"required"`
	Result  string `json:"result" binding:"required"`
}

type RequestProcessiongSystemPlanYPostEncryptedVectorData struct {
	UserId    int64  `json:"user_id" binding:"required"`
	Vector    string `json:"vector" binding:"required"`
	Publickey string `json:"publickey" binding:"required"`
	Rotatekey string `json:"rotatekey" binding:"required"`
	Relinkey  string `json:"relinkey" binding:"required"`
}

type ResponseProcessiongSystemPlanYPostEncryptedVectorData struct {
	UserId int64  `json:"user_id" binding:"required"`
	Vector string `json:"vector" binding:"required"`
	Result string `json:"result" binding:"required"`
}
