package domain

import (
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

// 計算に使用するベクトル項目の最大数
// rlwe のベクトル回転に必要になる
const VectorElemMaxSize = 29

// 和を計算するベクトル項目数
const VectorItemSize = 5

type CandidateVector struct {
	CandidateVectorHardSkill              `csv:",inline"`
	CandidateVectorResponsibility         `csv:",inline"`
	CandidateVectorCognitiveIndividual    `csv:",inline"`
	CandidateVectorCommunicationCommunity `csv:",inline"`
	CandidateVectorLearningAttitude       `csv:",inline"`
}

type CandidateVectorHardSkill struct {
	FintechKnowledge        float64 `csv:"Fintech Knowledge"`
	DescriptiveStatistics   float64 `csv:"Descriptive Statistics"`
	InferentialStatistics   float64 `csv:"Inferential statistics"`
	EconometricsForFinance  float64 `csv:"Econometrics for Finance"`
	TimeSeriesAnalysis      float64 `csv:"Time Series Analysis"`
	PanelDataAnalysis       float64 `csv:"Panel Data Analysis"`
	BuildingPredictionModel float64 `csv:"Building Prediction Model"`
	DesigningRoboAdvisor    float64 `csv:"Designing Robo Advisor"`
	Presentation            float64 `csv:"Presentation"`
}

type CandidateVectorResponsibility struct {
	Responsibility float64 `csv:"Responsibility"`
}

type CandidateVectorCognitiveIndividual struct {
	ProblemSetting             float64 `csv:"Problem-setting"`
	SolutionOriented           float64 `csv:"Solution-oriented"`
	Creativity                 float64 `csv:"Creativity"`
	Inquisitiveness            float64 `csv:"Inquisitiveness"`
	IndividualExecutionAbility float64 `csv:"Individual execution ability"`
	Vision                     float64 `csv:"Vision"`
	Interests                  float64 `csv:"Interests"`
	Resilience                 float64 `csv:"Resilience"`
	EmotionalControl           float64 `csv:"Emotional Control"`
	Decisiveness               float64 `csv:"Decisiveness"`
}

type CandidateVectorCommunicationCommunity struct {
	SelfExpression            float64 `csv:"Self-expression"`
	EmpathyAndListeningSkills float64 `csv:"Empathy and listening skills"`
	Flexibility               float64 `csv:"Flexibility"`
	OpenMinded                float64 `csv:"Open-minded"`
	ExerciseOfInfluence       float64 `csv:"Exercise of Influence"`
	PassionEvangelize         float64 `csv:"Passion-Evangelize"`
	SenseOfEthics             float64 `csv:"Sense of ethics"`
	StudyAttitude             float64 `csv:"study attitude"`
}

type CandidateVectorLearningAttitude struct {
	Attendance float64 `csv:"attendance"`
}

func (_ CandidateVectorHardSkill) GetIndexRange() ckks.IndexRange {
	return ckks.IndexRange{From: 0, To: 9}
}
func (_ CandidateVectorResponsibility) GetIndexRange() ckks.IndexRange {
	return ckks.IndexRange{From: 9, To: 10}
}
func (_ CandidateVectorCognitiveIndividual) GetIndexRange() ckks.IndexRange {
	return ckks.IndexRange{From: 10, To: 20}
}
func (_ CandidateVectorCommunicationCommunity) GetIndexRange() ckks.IndexRange {
	return ckks.IndexRange{From: 20, To: 28}
}
func (_ CandidateVectorLearningAttitude) GetIndexRange() ckks.IndexRange {
	return ckks.IndexRange{From: 28, To: 29}
}

func (u CandidateVector) EncryptRLWE(enc *ckks.CalculatorUsingPublickey) *rlwe.Ciphertext {
	v := enc.NewVector()
	for i, e := range []float64{
		u.FintechKnowledge,
		u.DescriptiveStatistics,
		u.InferentialStatistics,
		u.EconometricsForFinance,
		u.TimeSeriesAnalysis,
		u.PanelDataAnalysis,
		u.BuildingPredictionModel,
		u.DesigningRoboAdvisor,
		u.Presentation,

		u.Responsibility,

		u.ProblemSetting,
		u.SolutionOriented,
		u.Creativity,
		u.Inquisitiveness,
		u.IndividualExecutionAbility,
		u.Vision,
		u.Interests,
		u.Resilience,
		u.EmotionalControl,
		u.Decisiveness,

		u.SelfExpression,
		u.EmpathyAndListeningSkills,
		u.Flexibility,
		u.OpenMinded,
		u.ExerciseOfInfluence,
		u.PassionEvangelize,
		u.SenseOfEthics,
		u.StudyAttitude,

		u.Attendance,
	} {
		v[i] = float64(e)
	}

	return enc.Encrypt(v)
}

func (u *CandidateVector) DecyptRLWE(ct *rlwe.Ciphertext, dec *ckks.CalculatorUsingSecretkey) {
	v := dec.Decrypt(ct)
	for i, e := range []*float64{
		&u.FintechKnowledge,
		&u.DescriptiveStatistics,
		&u.InferentialStatistics,
		&u.EconometricsForFinance,
		&u.TimeSeriesAnalysis,
		&u.PanelDataAnalysis,
		&u.BuildingPredictionModel,
		&u.DesigningRoboAdvisor,
		&u.Presentation,

		&u.Responsibility,

		&u.ProblemSetting,
		&u.SolutionOriented,
		&u.Creativity,
		&u.Inquisitiveness,
		&u.IndividualExecutionAbility,
		&u.Vision,
		&u.Interests,
		&u.Resilience,
		&u.EmotionalControl,
		&u.Decisiveness,

		&u.SelfExpression,
		&u.EmpathyAndListeningSkills,
		&u.Flexibility,
		&u.OpenMinded,
		&u.ExerciseOfInfluence,
		&u.PassionEvangelize,
		&u.SenseOfEthics,
		&u.StudyAttitude,

		&u.Attendance,
	} {
		*e = float64(real(v[i]))
	}
}
