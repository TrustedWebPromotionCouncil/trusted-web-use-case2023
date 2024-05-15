package handler

import (
	"net/http"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/external"
	"github.com/gin-gonic/gin"
)

type Dependencies struct {
	Env              string
	DomainProvider   *domain.DomainProvider
	ExternalProvider *external.ExternalProvider
}

type HandlerProvider struct {
	d Dependencies
}

func NewHandlerProvider(d Dependencies) (*HandlerProvider, error) {
	return &HandlerProvider{
		d: d,
	}, nil
}

func (p *HandlerProvider) Register(e *gin.Engine) {
	p.registerRoutes(e)
}

func (p *HandlerProvider) registerRoutesPlanX(rMatchingSystem, rProcessingSystem *gin.RouterGroup) {
	rMatchingSystemApi := rMatchingSystem.Group("/system/planX")
	rMatchingSystemApi.POST("/new_candidate", p.handlerMatchingSystemPlanXPostNewCandidate)
	rMatchingSystemApi.GET("/encrypted_weights", p.handlerMatchingSystemPlanXGetEncryptedWeights)
	rMatchingSystemApi.POST("/encrypted_profile_data", p.handlerMatchingSystemPlanXPostEncryptedProfileData)
	rMatchingSystemApi.POST("/secret_calculation_result", p.handlerMatchingSystemPlanXPostSecretCalculationResult)

	rProcessingSystemApi := rProcessingSystem.Group("/system/planX")
	rProcessingSystemApi.POST("/encrypted_vector_data", p.handlerProcessiongSystemPlanXPostEncryptedVectorData)
}

func (p *HandlerProvider) registerRoutesPlanY(rMatchingSystem, rProcessingSystem *gin.RouterGroup) {
	rMatchingSystemApi := rMatchingSystem.Group("/system/planY")
	rMatchingSystemApi.POST("/publickey", p.handlerMatchingSystemPlanYPostPublicKey)
	rMatchingSystemApi.GET("/encrypted_weights/:user_id", p.handlerMatchingSystemPlanYGetEncryptedWeights)
	rMatchingSystemApi.POST("/secret_calculation_result", p.handlerMatchingSystemPlanYPostSecretCalculationResult)

	rProcessingSystemApi := rProcessingSystem.Group("/system/planY")
	rProcessingSystemApi.POST("/encrypted_vector_data", p.handlerProcessiongSystemPlanYPostEncryptedVectorData)
}

func (p *HandlerProvider) registerRoutesForDebug(rMatchingSystem *gin.RouterGroup) {
	authorized := rMatchingSystem.Group("/secretkey", gin.BasicAuth(gin.Accounts{
		"system": "L8fqEGK5",
	}))
	authorized.GET("", p.handlerMatchingSystemGetSecretKeyForDebug)
}

func (p *HandlerProvider) registerRoutes(e *gin.Engine) {
	// matching API
	rMatchingSystem := e.Group("/matching")
	rMatchingSystem.GET("/public/health", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})
	rMatchingSystem.GET("/candidates", p.handlerMatchingApiGetCandidates)
	rMatchingSystem.GET("/candidates/:id", p.handlerMatchingApiGetCandidatesId)
	rMatchingSystem.POST("/candidates/:id/like", p.handlerMatchingApiPostCandidatesLike)
	rMatchingSystem.POST("/candidates/:id/sendmail", p.handlerMatchingApiPostCandidatesSendmail)

	// processing API
	rProcessingSystem := e.Group("/processing")
	rProcessingSystem.GET("/public/health", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	p.registerRoutesPlanX(rMatchingSystem, rProcessingSystem)
	p.registerRoutesPlanY(rMatchingSystem, rProcessingSystem)
	p.registerRoutesForDebug(rMatchingSystem)
}
