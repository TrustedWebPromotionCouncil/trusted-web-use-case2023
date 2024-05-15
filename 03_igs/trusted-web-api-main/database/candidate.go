package database

import (
	"errors"
	"fmt"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"gorm.io/gorm"
)

type Candidate struct {
	Id int64 `gorm:"column:id"`

	CandidateVector     CandidateVector     `gorm:"foreignKey:candidate_id"`
	CandidateEncryptKey CandidateEncryptKey `gorm:"foreignKey:candidate_id"`

	EscoId           int64   `gorm:"column:escoid"`
	MailAddress      string  `gorm:"column:email"`
	Age              int64   `gorm:"column:age"`
	Gender           string  `gorm:"column:gender"`
	Country          string  `gorm:"column:country"`
	City             string  `gorm:"column:city"`
	Ability1         float64 `gorm:"column:ability1"`
	Ability2         float64 `gorm:"column:ability2"`
	Ability3         float64 `gorm:"column:ability3"`
	DesiredSalary    int64   `gorm:"column:desired_salary"`
	LikeCount        int64   `gorm:"column:like_count"`
	OfferAmount      int64   `gorm:"column:offer_amount"`
	OfferCount       int64   `gorm:"column:offer_count"`
	SelfIntroduction string  `gorm:"column:self_introduction"`
	HardSkill        float64 `gorm:"column:hard_skill"`
	SoftSkill        float64 `gorm:"column:soft_skill"`
	Knowledge        float64 `gorm:"column:knowledge"`
	IsKnowledge      bool    `gorm:"column:is_knowledge"`
	Experience       float64 `gorm:"column:experience"`
	IsExperience     bool    `gorm:"column:is_experience"`
	Cognition        float64 `gorm:"column:cognition"`
	IsCognition      bool    `gorm:"column:is_cognition"`
	Community        float64 `gorm:"column:community"`
	IsCommunity      bool    `gorm:"column:is_community"`
	Attitude         float64 `gorm:"column:attitude"`
	IsAttitude       bool    `gorm:"column:is_attitude"`
	Manner           float64 `gorm:"column:manner"`
	IsManner         bool    `gorm:"column:is_manner"`
	Engaged          float64 `gorm:"column:engaged"`
	IsEngaged        bool    `gorm:"column:is_engaged"`
}

func (u *Candidate) Get(id int64) (domain.Candidate, bool, error) {
	s := Candidate{Id: id}
	db := dbMain

	if id == 0 {
		err := fmt.Errorf("UserId required")
		logger.Error(err)
		return domain.Candidate{}, false, err
	}

	result := db.Find(&s)
	if result.Error != nil {
		logger.Error(result.Error)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return domain.Candidate{}, false, nil
		}
		return domain.Candidate{}, false, result.Error
	}
	logger.Infof("parse request : %#v", result)

	return convertModel(s), true, nil
}

func (u *Candidate) GetAll(st string) ([]domain.Candidate, bool, error) {
	var s []Candidate
	var s1 []domain.Candidate
	db := dbMain

	if st != "" {
		result := db.Order(st + " desc").Find(&s)
		if result.Error != nil {
			logger.Error(result.Error)
			if errors.Is(result.Error, gorm.ErrRecordNotFound) {
				return []domain.Candidate{}, false, nil
			}
			return []domain.Candidate{}, false, result.Error
		}
		logger.Infof("parse request : %#v", result)
	} else {
		result := db.Find(&s)
		if result.Error != nil {
			logger.Error(result.Error)
			if errors.Is(result.Error, gorm.ErrRecordNotFound) {
				return []domain.Candidate{}, false, nil
			}
			return []domain.Candidate{}, false, result.Error
		}
		logger.Infof("parse request : %#v", result)
	}
	for _, v := range s {
		s1 = append(s1, convertModel(v))
	}

	return s1, true, nil
}

func (c *Candidate) CountUpdate(id int64, column int64) (bool, error) {
	if id == 0 {
		err := fmt.Errorf("UserId required")
		logger.Error(err)
		return false, err
	}

	db := dbMain
	u := Candidate{Id: id}
	result := db.First(&u)
	if result.Error != nil {
		logger.Error(result.Error)
		return false, result.Error
	}

	//1"offer_count"
	if column == 1 {
		u.OfferCount = u.OfferCount + 1
	} else {
		//2"like_count"
		u.LikeCount = u.LikeCount + 1
	}

	result = db.Save(&u)
	if result.Error != nil {
		logger.Error(result.Error)
		return false, result.Error
	}

	return true, nil
}

func convertModel(s Candidate) domain.Candidate {
	c := domain.Candidate{
		Id:               s.Id,
		EscoId:           s.EscoId,
		MailAddress:      s.MailAddress,
		Age:              s.Age,
		Gender:           s.Gender,
		Residence:        s.Country + " " + s.City,
		Ability1:         int64(s.Ability1),
		Ability2:         int64(s.Ability2),
		Ability3:         int64(s.Ability3),
		DesiredSalary:    s.DesiredSalary,
		LikeCount:        s.LikeCount,
		OfferAmount:      s.OfferAmount,
		OfferCount:       s.OfferCount,
		SelfIntroduction: s.SelfIntroduction,
		HardSkill:        int64(s.HardSkill),
		SoftSkill:        int64(s.SoftSkill),
		Knowledge:        int64(s.Knowledge),
		IsKnowledge:      s.IsKnowledge,
		Experience:       int64(s.Experience),
		IsExperience:     s.IsExperience,
		Cognition:        int64(s.Cognition),
		IsCognition:      s.IsCognition,
		Community:        int64(s.Community),
		IsCommunity:      s.IsCommunity,
		Attitude:         int64(s.Attitude),
		IsAttitude:       s.IsAttitude,
		Manner:           int64(s.Manner),
		IsManner:         s.IsManner,
		Engaged:          int64(s.Engaged),
		IsEngaged:        s.IsEngaged,
	}
	return c
}

func (_ *Candidate) Create() (int64, error) {
	db := dbMain

	var u Candidate
	result := db.Create(&u)
	if result.Error != nil {
		return 0, result.Error
	}
	logger.Infof("Created: %+v\n", u)

	return u.Id, nil
}

func (u *Candidate) UpdateProfile(id int64, v domain.CandidateProfile) (bool, error) {
	return u.update(id, func(u *Candidate) error {
		u.EscoId = v.Level
		u.Age = v.Age
		u.MailAddress = v.Email
		u.Gender = v.Gender
		u.Country = v.Country
		u.City = v.City
		u.DesiredSalary = v.DesiredSalary
		u.SelfIntroduction = v.SelfIntroduction
		u.IsKnowledge = v.ShowKnowledge
		u.IsExperience = v.ShowResponsibility
		u.IsCognition = v.ShowCognitiveIndividual
		u.IsCommunity = v.ShowPeerCommunity
		u.IsAttitude = v.ShowBehaviorFromLearningAttitude

		return nil
	})
}

func (u *Candidate) UpdateVector(id int64, v domain.CandidateVector) (bool, error) {
	return u.update(id, func(u *Candidate) error {
		u.CandidateVector.FintechKnowledge = v.FintechKnowledge
		u.CandidateVector.DescriptiveStatistics = v.DescriptiveStatistics
		u.CandidateVector.InferentialStatistics = v.InferentialStatistics
		u.CandidateVector.EconometricsForFinance = v.EconometricsForFinance
		u.CandidateVector.TimeSeriesAnalysis = v.TimeSeriesAnalysis
		u.CandidateVector.PanelDataAnalysis = v.PanelDataAnalysis
		u.CandidateVector.BuildingPredictionModel = v.BuildingPredictionModel
		u.CandidateVector.DesigningRoboAdvisor = v.DesigningRoboAdvisor
		u.CandidateVector.Presentation = v.Presentation

		u.CandidateVector.Responsibility = v.Responsibility

		u.CandidateVector.ProblemSetting = v.ProblemSetting
		u.CandidateVector.SolutionOriented = v.SolutionOriented
		u.CandidateVector.Creativity = v.Creativity
		u.CandidateVector.Inquisitiveness = v.Inquisitiveness
		u.CandidateVector.IndividualExecutionAbility = v.IndividualExecutionAbility
		u.CandidateVector.Vision = v.Vision
		u.CandidateVector.Interests = v.Interests
		u.CandidateVector.Resilience = v.Resilience
		u.CandidateVector.EmotionalControl = v.EmotionalControl
		u.CandidateVector.Decisiveness = v.Decisiveness

		u.CandidateVector.SelfExpression = v.SelfExpression
		u.CandidateVector.EmpathyAndListeningSkills = v.EmpathyAndListeningSkills
		u.CandidateVector.Flexibility = v.Flexibility
		u.CandidateVector.OpenMinded = v.OpenMinded
		u.CandidateVector.ExerciseOfInfluence = v.ExerciseOfInfluence
		u.CandidateVector.PassionEvangelize = v.PassionEvangelize
		u.CandidateVector.SenseOfEthics = v.SenseOfEthics
		u.CandidateVector.StudyAttitude = v.StudyAttitude

		u.CandidateVector.Attendance = v.Attendance

		return nil
	})
}

func (u *Candidate) UpdateVectorCalcResult(id int64, v domain.CandidateVectorCalcResult) (bool, error) {
	return u.update(id, func(u *Candidate) error {
		hardSkill := v.Knowledge + v.Experience
		softSkill := v.Cognition + v.Community + v.Attitude
		u.Knowledge = v.Knowledge
		u.Experience = v.Experience
		u.Cognition = v.Cognition
		u.Community = v.Community
		u.Attitude = v.Attitude
		u.HardSkill = hardSkill
		u.SoftSkill = softSkill
		u.Ability1 = hardSkill*0.5 + softSkill*0.5
		u.Ability2 = hardSkill*0.8 + softSkill*0.2
		u.Ability3 = hardSkill*0.2 + softSkill*0.8

		return nil
	})
}

func (u *Candidate) UpdateEncryptKey(id int64, v domain.CandidateEncryptKey) (bool, error) {
	return u.update(id, func(u *Candidate) error {
		u.CandidateEncryptKey.CkksPublickey = v.CkksPublickey
		return nil
	})
}

func (_ *Candidate) update(id int64, f func(*Candidate) error) (bool, error) {
	db := dbMain
	var u Candidate

	result := db.First(&u, id)
	if result.Error != nil {
		logger.Error(result.Error)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, result.Error
	}
	logger.Infof("fetch record : %#v", result)

	err := f(&u)
	if err != nil {
		return false, err
	}

	result = db.Save(&u)
	if result.Error != nil {
		logger.Error(result.Error)
		return false, result.Error
	}

	return true, nil
}

func (_ *Candidate) GetEncryptKey(candidateId int64) (domain.CandidateEncryptKey, bool, error) {
	var v CandidateEncryptKey
	return v.Get(candidateId)
}
