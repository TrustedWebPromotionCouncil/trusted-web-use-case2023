package domain

import "github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"

type VectorWeight struct {
	CandidateVector
}

type VectorWeightServiceDependencies struct {
	Persistents PersistentDependencies
}

type VectorWeightService struct {
	d VectorWeightServiceDependencies
}

var DefaultRotateRange = ckks.RotateRange{
	From: -VectorItemSize,
	To:   VectorElemMaxSize,
}

// とりあえず新規作成時の重みのデフォルト値
var DefaultWeight = VectorWeight{
	CandidateVector: CandidateVector{
		CandidateVectorHardSkill: CandidateVectorHardSkill{
			FintechKnowledge:        0.2,
			DescriptiveStatistics:   0.05,
			InferentialStatistics:   0.05,
			EconometricsForFinance:  0.1,
			TimeSeriesAnalysis:      0.1,
			PanelDataAnalysis:       0.1,
			BuildingPredictionModel: 0.2,
			DesigningRoboAdvisor:    0.2,
			Presentation:            0.1,
		},
		CandidateVectorResponsibility: CandidateVectorResponsibility{
			Responsibility: 0.05,
		},
		CandidateVectorCognitiveIndividual: CandidateVectorCognitiveIndividual{
			ProblemSetting:             0.052941176470,
			SolutionOriented:           0.052941176470,
			Creativity:                 0.052941176470,
			Inquisitiveness:            0.052941176470,
			IndividualExecutionAbility: 0.052941176470,
			Vision:                     0.052941176470,
			Interests:                  0.052941176470,
			Resilience:                 0.052941176470,
			EmotionalControl:           0.052941176470,
			Decisiveness:               0.052941176470,
		},
		CandidateVectorCommunicationCommunity: CandidateVectorCommunicationCommunity{
			SelfExpression:            0.052941176470,
			EmpathyAndListeningSkills: 0.052941176470,
			Flexibility:               0.052941176470,
			OpenMinded:                0.052941176470,
			ExerciseOfInfluence:       0.052941176470,
			PassionEvangelize:         0.052941176470,
			SenseOfEthics:             0.052941176470,
			StudyAttitude:             0.052941176470,
		},
		CandidateVectorLearningAttitude: CandidateVectorLearningAttitude{
			Attendance: 0.052941176470,
		},
	},
}

func (s *VectorWeightService) Create() (int64, error) {
	return s.d.Persistents.VectorWeight.Create(DefaultWeight)
}

func (s *VectorWeightService) Get() (VectorWeight, bool, error) {
	return s.d.Persistents.VectorWeight.Get()
}
