package domain

import (
	"log"
	"math"
	"os"
	"testing"

	ckks_helper "github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	"github.com/tuneinsight/lattigo/v4/ckks"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

var V = CandidateVector{
	CandidateVectorHardSkill: CandidateVectorHardSkill{
		FintechKnowledge:        1,
		DescriptiveStatistics:   2,
		InferentialStatistics:   3,
		EconometricsForFinance:  4,
		TimeSeriesAnalysis:      5,
		PanelDataAnalysis:       6,
		BuildingPredictionModel: 7,
		DesigningRoboAdvisor:    8,
		Presentation:            9,
	},
	CandidateVectorResponsibility: CandidateVectorResponsibility{
		Responsibility: 10,
	},
	CandidateVectorCognitiveIndividual: CandidateVectorCognitiveIndividual{
		ProblemSetting:             11,
		SolutionOriented:           12,
		Creativity:                 13,
		Inquisitiveness:            14,
		IndividualExecutionAbility: 15,
		Vision:                     16,
		Interests:                  17,
		Resilience:                 18,
		EmotionalControl:           19,
		Decisiveness:               20,
	},
	CandidateVectorCommunicationCommunity: CandidateVectorCommunicationCommunity{
		SelfExpression:            21,
		EmpathyAndListeningSkills: 22,
		Flexibility:               23,
		OpenMinded:                24,
		ExerciseOfInfluence:       25,
		PassionEvangelize:         26,
		SenseOfEthics:             27,
		StudyAttitude:             28,
	},
	CandidateVectorLearningAttitude: CandidateVectorLearningAttitude{
		Attendance: 29,
	},
}

var W = VectorWeight{
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

var dec *ckks_helper.CalculatorUsingSecretkey
var enc *ckks_helper.CalculatorUsingPublickeyEval

func TestMain(m *testing.M) {
	var err error
	params, err := ckks.NewParametersFromLiteral(ckks_helper.CkksParams)
	if err != nil {
		panic(err)
	}

	kgenN12 := ckks.NewKeyGenerator(params)
	skN12, _ := kgenN12.GenKeyPair()

	dec, err = ckks_helper.NewCalculatorUsingSecretkey(skN12)
	if err != nil {
		panic(err)
	}
	enc, err = dec.NewCalculatorUsingPublickey(DefaultRotateRange)
	if err != nil {
		panic(err)
	}

	exitVal := m.Run()
	os.Exit(exitVal)
}

func TestVecetorの重みとの積(t *testing.T) {
	log.Println("TestVecetorの重みとの積 running")

	ct_v := V.EncryptRLWE(&enc.CalculatorUsingPublickey)
	ct_w := W.EncryptRLWE(&enc.CalculatorUsingPublickey)

	ct_out := enc.Multiple(ct_v, ct_w)
	// dec.DebugShow(ct_out, VectorElemMaxSize)

	expects := [VectorElemMaxSize]float64{
		0.2,
		0.1,
		0.15,
		0.4,
		0.5,
		0.6,
		1.4,
		1.6,
		0.9,

		0.5,

		0.5823529411699999,
		0.63529411764,
		0.68823529411,
		0.7411764705799999,
		0.79411764705,
		0.84705882352,
		0.9,
		0.95294117646,
		1.0058823529299998,
		1.0588235294,

		1.11176470587,
		1.1647058823399998,
		1.21764705881,
		1.27058823528,
		1.3235294117499998,
		1.37647058822,
		1.42941176469,
		1.4823529411599998,

		1.53529411763,
	}

	d := dec.Decrypt(ct_out)
	for i, expect := range expects {
		actual := float64(real(d[i]))
		if !(math.Abs(expect-actual) < 0.0001) {
			t.Errorf("[%d] FAILED expected: %+v, actual %+v", i, expect, actual)
		} else {
			// log.Printf("[%d] PASSED expected: %+v, actual %+v", i, expect, actual)
		}
	}
}

func TestVecetorの特定位置の和の計算(t *testing.T) {
	log.Println("TestVecetorの特定位置の和の計算 running")

	ctIn := V.EncryptRLWE(&enc.CalculatorUsingPublickey)

	ctOuts := enc.RangeSums(ctIn, []ckks_helper.IndexRange{
		V.CandidateVectorHardSkill.GetIndexRange(),
		V.CandidateVectorResponsibility.GetIndexRange(),
		V.CandidateVectorCognitiveIndividual.GetIndexRange(),
		V.CandidateVectorCommunicationCommunity.GetIndexRange(),
		V.CandidateVectorLearningAttitude.GetIndexRange(),
	})

	cases := []struct {
		Expect float64
		Actual *rlwe.Ciphertext
	}{
		{45.0, ctOuts[0]},
		{10.0, ctOuts[1]},
		{155.0, ctOuts[2]},
		{196.0, ctOuts[3]},
		{29.0, ctOuts[4]},
	}

	for i, c := range cases {
		d := dec.Decrypt(c.Actual)
		actual := float64(real(d[0]))
		expect := c.Expect
		if !(math.Abs(expect-actual) < 0.0001) {
			t.Errorf("[%d] FAILED expected: %+v, actual %+v", i, expect, actual)
		}
	}

	{ // Merge
		ctResults := enc.Merge(ctOuts)
		decResults := dec.Decrypt(ctResults)
		for i := range cases {
			actual := float64(real(decResults[i]))
			expect := cases[i].Expect
			if !(math.Abs(expect-actual) < 0.0001) {
				t.Errorf("[%d] FAILED expected: %+v, actual %+v", i, expect, actual)
			}
		}
	}
}
