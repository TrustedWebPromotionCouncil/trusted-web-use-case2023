package handler

import (
	"net/http"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/apiio"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	"github.com/gin-gonic/gin"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

func (p *HandlerProvider) handlerProcessiongSystemPlanYPostEncryptedVectorData(c *gin.Context) {
	var req apiio.RequestProcessiongSystemPlanYPostEncryptedVectorData
	if err := c.ShouldBind(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	logger.Infof("parse request : %#v", req)

	resp := apiio.ResponseProcessiongSystemPlanYPostEncryptedVectorData{
		UserId: req.UserId,
	}

	usecase := func() (err error) {
		// 送られてきた暗号化ベクトル
		ctIn, err := ckks.FromBase64String[rlwe.Ciphertext](req.Vector)
		if err != nil {
			return err
		}

		// 重みデータ取得
		weights, err := p.d.ExternalProvider.GetMatchingApiService().SystemPlanYGetEncryptedWeights(req.UserId)
		if err != nil {
			return err
		}
		ctW, err := ckks.FromBase64String[rlwe.Ciphertext](weights.Payload)
		if err != nil {
			return err
		}

		// 公開鍵をデコード
		pkey, err := ckks.FromBase64String[rlwe.PublicKey](req.Publickey)
		if err != nil {
			return err
		}
		rotkey, err := ckks.FromBase64String[rlwe.RotationKeySet](req.Rotatekey)
		if err != nil {
			return err
		}
		rlkey, err := ckks.FromBase64String[rlwe.RelinearizationKey](req.Relinkey)
		if err != nil {
			return err
		}

		// 秘密計算実行
		ev, err := ckks.NewCalculatorUsingPublickeyEval(pkey, rotkey, rlkey)
		if err != nil {
			return err
		}
		// ベクトルの積
		ctOut := ev.Multiple(ctIn, ctW)

		// 特定範囲の和
		v := domain.CandidateVector{}
		ctSums := ev.RangeSums(ctOut, []ckks.IndexRange{
			v.CandidateVectorHardSkill.GetIndexRange(),
			v.CandidateVectorResponsibility.GetIndexRange(),
			v.CandidateVectorCognitiveIndividual.GetIndexRange(),
			v.CandidateVectorCommunicationCommunity.GetIndexRange(),
			v.CandidateVectorLearningAttitude.GetIndexRange(),
		})
		ctResult := ev.Merge(ctSums)

		resp.Vector, err = ckks.ToBase64String(ctOut)
		if err != nil {
			return err
		}
		resp.Result, err = ckks.ToBase64String(ctResult)
		if err != nil {
			return err
		}

		return nil
	}
	err := usecase()

	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{})
		return
	}

	c.JSON(http.StatusOK, resp)
}
