package database

import (
	"errors"
	"time"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"gorm.io/gorm"
)

type VectorWeight struct {
	Id int64 `gorm:"column:id"`

	VectorData `gorm:"embedded"`

	CreatedAt time.Time `gorm:"column:created_at"`
}

func (_ *VectorWeight) Create(v domain.VectorWeight) (int64, error) {
	db := dbMain

	u := VectorWeight{
		VectorData: VectorData{
			FintechKnowledge:        v.FintechKnowledge,
			DescriptiveStatistics:   v.DescriptiveStatistics,
			InferentialStatistics:   v.InferentialStatistics,
			EconometricsForFinance:  v.EconometricsForFinance,
			TimeSeriesAnalysis:      v.TimeSeriesAnalysis,
			PanelDataAnalysis:       v.PanelDataAnalysis,
			BuildingPredictionModel: v.BuildingPredictionModel,
			DesigningRoboAdvisor:    v.DesigningRoboAdvisor,
			Presentation:            v.Presentation,

			Responsibility: v.Responsibility,

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

			SelfExpression:            v.SelfExpression,
			EmpathyAndListeningSkills: v.EmpathyAndListeningSkills,
			Flexibility:               v.Flexibility,
			OpenMinded:                v.OpenMinded,
			ExerciseOfInfluence:       v.ExerciseOfInfluence,
			PassionEvangelize:         v.PassionEvangelize,
			SenseOfEthics:             v.SenseOfEthics,
			StudyAttitude:             v.StudyAttitude,

			Attendance: v.Attendance,
		},
	}

	result := db.Create(&u)
	if result.Error != nil {
		return 0, result.Error
	}
	logger.Infof("Created: %+v\n", u)

	return u.Id, nil
}

func (_ *VectorWeight) Get() (domain.VectorWeight, bool, error) {
	db := dbMain
	var u VectorWeight

	result := db.Last(&u)
	if result.Error != nil {
		logger.Error(result.Error)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return domain.VectorWeight{}, false, nil
		}
		return domain.VectorWeight{}, false, result.Error
	}

	return domain.VectorWeight{
		CandidateVector: domain.CandidateVector{
			CandidateVectorHardSkill: domain.CandidateVectorHardSkill{
				FintechKnowledge:        u.FintechKnowledge,
				DescriptiveStatistics:   u.DescriptiveStatistics,
				InferentialStatistics:   u.InferentialStatistics,
				EconometricsForFinance:  u.EconometricsForFinance,
				TimeSeriesAnalysis:      u.TimeSeriesAnalysis,
				PanelDataAnalysis:       u.PanelDataAnalysis,
				BuildingPredictionModel: u.BuildingPredictionModel,
				DesigningRoboAdvisor:    u.DesigningRoboAdvisor,
				Presentation:            u.Presentation,
			},
			CandidateVectorResponsibility: domain.CandidateVectorResponsibility{
				Responsibility: u.Responsibility,
			},
			CandidateVectorCognitiveIndividual: domain.CandidateVectorCognitiveIndividual{
				ProblemSetting:             u.ProblemSetting,
				SolutionOriented:           u.SolutionOriented,
				Creativity:                 u.Creativity,
				Inquisitiveness:            u.Inquisitiveness,
				IndividualExecutionAbility: u.IndividualExecutionAbility,
				Vision:                     u.Vision,
				Interests:                  u.Interests,
				Resilience:                 u.Resilience,
				EmotionalControl:           u.EmotionalControl,
				Decisiveness:               u.Decisiveness,
			},
			CandidateVectorCommunicationCommunity: domain.CandidateVectorCommunicationCommunity{
				SelfExpression:            u.SelfExpression,
				EmpathyAndListeningSkills: u.EmpathyAndListeningSkills,
				Flexibility:               u.Flexibility,
				OpenMinded:                u.OpenMinded,
				ExerciseOfInfluence:       u.ExerciseOfInfluence,
				PassionEvangelize:         u.PassionEvangelize,
				SenseOfEthics:             u.SenseOfEthics,
				StudyAttitude:             u.StudyAttitude,
			},
			CandidateVectorLearningAttitude: domain.CandidateVectorLearningAttitude{
				Attendance: u.Attendance,
			},
		},
	}, true, nil
}
