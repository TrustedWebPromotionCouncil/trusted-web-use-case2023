package database

import (
	"errors"
	"time"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"gorm.io/gorm"
)

type VectorData struct {
	FintechKnowledge        float64 `gorm:"column:fintech_knowledge"`
	DescriptiveStatistics   float64 `gorm:"column:descriptive_statistics"`
	InferentialStatistics   float64 `gorm:"column:inferential_statistics"`
	EconometricsForFinance  float64 `gorm:"column:econometrics_for_finance"`
	TimeSeriesAnalysis      float64 `gorm:"column:time_series_analysis"`
	PanelDataAnalysis       float64 `gorm:"column:panel_data_analysis"`
	BuildingPredictionModel float64 `gorm:"column:building_prediction_model"`
	DesigningRoboAdvisor    float64 `gorm:"column:designing_robo_advisor"`
	Presentation            float64 `gorm:"column:presentation"`

	Responsibility float64 `gorm:"column:responsibility"`

	ProblemSetting             float64 `gorm:"column:problem_setting"`
	SolutionOriented           float64 `gorm:"column:solution_oriented"`
	Creativity                 float64 `gorm:"column:creativity"`
	Inquisitiveness            float64 `gorm:"column:inquisitiveness"`
	IndividualExecutionAbility float64 `gorm:"column:individual_execution_ability"`
	Vision                     float64 `gorm:"column:vision"`
	Interests                  float64 `gorm:"column:interests"`
	Resilience                 float64 `gorm:"column:resilience"`
	EmotionalControl           float64 `gorm:"column:emotional_control"`
	Decisiveness               float64 `gorm:"column:decisiveness"`

	SelfExpression            float64 `gorm:"column:self_expression"`
	EmpathyAndListeningSkills float64 `gorm:"column:empathy_and_listening_skills"`
	Flexibility               float64 `gorm:"column:flexibility"`
	OpenMinded                float64 `gorm:"column:openminded"`
	ExerciseOfInfluence       float64 `gorm:"column:exercise_of_influence"`
	PassionEvangelize         float64 `gorm:"column:passion_evangelize"`
	SenseOfEthics             float64 `gorm:"column:sense_of_ethics"`
	StudyAttitude             float64 `gorm:"column:study_attitude"`

	Attendance float64 `gorm:"column:attendance"`
}

type CandidateVector struct {
	Id          int64 `gorm:"column:id"`
	CandidateId int64 `gorm:"column:candidate_id"`

	VectorData

	CreatedAt time.Time `gorm:"column:created_at"`
}

func (u *CandidateVector) Get(candidateId int64) (domain.CandidateVector, bool, error) {
	db := dbMain
	v := CandidateVector{
		CandidateId: candidateId,
	}

	result := db.Where(v).First(&v)
	if result.Error != nil {
		logger.Error(result.Error)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return domain.CandidateVector{}, false, nil
		}
		return domain.CandidateVector{}, false, result.Error
	}
	logger.Infof("parse request : %#v", result)

	return domain.CandidateVector{
		CandidateVectorHardSkill: domain.CandidateVectorHardSkill{
			FintechKnowledge:        v.FintechKnowledge,
			DescriptiveStatistics:   v.DescriptiveStatistics,
			InferentialStatistics:   v.InferentialStatistics,
			EconometricsForFinance:  v.EconometricsForFinance,
			TimeSeriesAnalysis:      v.TimeSeriesAnalysis,
			PanelDataAnalysis:       v.PanelDataAnalysis,
			BuildingPredictionModel: v.BuildingPredictionModel,
			DesigningRoboAdvisor:    v.DesigningRoboAdvisor,
			Presentation:            v.Presentation,
		},
		CandidateVectorResponsibility: domain.CandidateVectorResponsibility{
			Responsibility: v.Responsibility,
		},
		CandidateVectorCognitiveIndividual: domain.CandidateVectorCognitiveIndividual{
			ProblemSetting:             v.ProblemSetting,
			SolutionOriented:           v.SolutionOriented,
			Creativity:                 v.Creativity,
			Inquisitiveness:            v.Inquisitiveness,
			IndividualExecutionAbility: v.IndividualExecutionAbility,
			Vision:                     v.Vision,
			Interests:                  v.Interests,
			Resilience:                 v.Resilience,
			EmotionalControl:           v.EmotionalControl,
			Decisiveness:               v.Decisiveness,
		},
		CandidateVectorCommunicationCommunity: domain.CandidateVectorCommunicationCommunity{
			SelfExpression:            v.SelfExpression,
			EmpathyAndListeningSkills: v.EmpathyAndListeningSkills,
			Flexibility:               v.Flexibility,
			OpenMinded:                v.OpenMinded,
			ExerciseOfInfluence:       v.ExerciseOfInfluence,
			PassionEvangelize:         v.PassionEvangelize,
			SenseOfEthics:             v.SenseOfEthics,
			StudyAttitude:             v.StudyAttitude,
		},
		CandidateVectorLearningAttitude: domain.CandidateVectorLearningAttitude{
			Attendance: v.Attendance,
		},
	}, true, nil
}
