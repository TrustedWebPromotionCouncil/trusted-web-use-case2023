import { CONST } from './const';
import { Enums } from './enums';
import { Serializable } from './serializable';

export interface IFetchCandidateListParams {
  sortType: CONST.SORT_TYPE;
  abilitypt: Enums.AbilityType;
}

export interface IFetchCandidateDetailByIdParams {
  abilitypt: Enums.AbilityType;
}

/**
 * id: UUID
 * age: 年齢
 * gender: 性別...Male:男性, Female:女性
 * residence: 居住地
 * hardSkill: ハードスキル合計
 * softSkill: ソフトスキル合計
 * desiredSalary: 最低希望年収(希望年収);
 * offerCount: オファー数
 */
export interface ICandidate {
  id: number;
  age: number;
  gender: string;
  residence: string;
  ability: number;
  hardSkill: number;
  softSkill: number;
  desiredSalary: number;
  offerCount: number;
}
export class Candidate implements ICandidate, Serializable<Candidate> {
  id: number = 0;
  age: number = 0;
  gender: string = '';
  residence: string = '';
  ability: number = 0;
  hardSkill: number = 0;
  softSkill: number = 0;
  desiredSalary: number = 0;
  offerCount: number = 0;

  deserialize(input: ICandidate): Candidate {
    this.id = input.id;
    this.age = input.age;
    this.gender = input.gender;
    this.residence = input.residence;
    this.ability = input.ability;
    this.hardSkill = input.hardSkill;
    this.softSkill = input.softSkill;
    this.desiredSalary = input.desiredSalary;
    this.offerCount = input.offerCount;
    return this;
  }
}

// NOTE: スキル周りが適当な命名なのでapi設計時に合わせる
/**
 * Table contents
 * likeCount: Like数
 * offerAmount: オファー金額
 * escoRank: ESCO基準のランク
 * escoRankDescription: ESCO基準のランク説明文
 * selfIntroduction: 自己紹介
 *
 * Graph contents
 * knowledge: ハードスキル...知識
 * isKnowledge: ハードスキル...知識のグラフ表示フラグ
 * experience: ハードスキル...職務経験/責任感
 * isExperience: ハードスキル...職務経験/責任感のグラフ表示フラグ
 * cognition: ソフトスキル...認知/自己
 * isCognition: ソフトスキル...認知/自己のグラフ表示フラグ
 * community: ソフトスキル...他者/コミュニティ
 * isCommunity: ソフトスキル...他者/コミュニティのグラフ表示フラグ
 * attitude: ソフトスキル...授業態度
 * isAttitude: ソフトスキル...授業態度のグラフ表示フラグ
 * manner: ソフトスキル...バイアス/マナー等
 * isManner: ソフトスキル...バイアス/マナー等のグラフ表示フラグ
 * engaged: ソフトスキル...幸福/従事
 * isEngaged: ソフトスキル...幸福/従事のグラフ表示フラグ
 */
export interface ICandidateDetail extends ICandidate {
  likeCount: number;
  offerAmount: number;
  escoRank: string;
  escoRankDescription: string;
  selfIntroduction: string;

  knowledge: number;
  isKnowledge: boolean;
  experience: number;
  isExperience: boolean;
  cognition: number;
  isCognition: boolean;
  community: number;
  isCommunity: boolean;
  attitude: number;
  isAttitude: boolean;
  manner: number;
  isManner: boolean;
  engaged: number;
  isEngaged: boolean;
}
export class CandidateDetail implements ICandidateDetail, Serializable<CandidateDetail> {
  id: number = 0;
  age: number = 0;
  gender: string = '';
  residence: string = '';
  ability: number = 0;
  hardSkill: number = 0;
  softSkill: number = 0;
  desiredSalary: number = 0;
  offerCount: number = 0;
  likeCount: number = 0;
  offerAmount: number = 0;
  escoRank: string = '';
  escoRankDescription: string = '';
  selfIntroduction: string = '';

  knowledge: number = 0;
  isKnowledge: boolean = true;
  experience: number = 0;
  isExperience: boolean = true;
  cognition: number = 0;
  isCognition: boolean = true;
  community: number = 0;
  isCommunity: boolean = true;
  attitude: number = 0;
  isAttitude: boolean = true;
  manner: number = 0;
  isManner: boolean = true;
  engaged: number = 0;
  isEngaged: boolean = true;

  deserialize(input: ICandidateDetail): CandidateDetail {
    this.id = input.id;
    this.age = input.age;
    this.gender = input.gender;
    this.residence = input.residence;
    this.ability = input.ability;
    this.hardSkill = input.hardSkill;
    this.softSkill = input.softSkill;
    this.desiredSalary = input.desiredSalary;
    this.offerCount = input.offerCount;
    this.likeCount = input.likeCount;
    this.offerAmount = input.offerAmount;
    this.escoRank = input.escoRank;
    this.escoRankDescription = input.escoRankDescription;
    this.selfIntroduction = input.selfIntroduction;
    this.knowledge = input.knowledge;
    this.isKnowledge = input.isKnowledge;
    this.experience = input.experience;
    this.isExperience = input.isExperience;
    this.cognition = input.cognition;
    this.isCognition = input.isCognition;
    this.community = input.community;
    this.isCommunity = input.isCommunity;
    this.attitude = input.attitude;
    this.isAttitude = input.isAttitude;
    this.manner = input.manner;
    this.isManner = input.isManner;
    this.engaged = input.engaged;
    this.isEngaged = input.isEngaged;
    return this;
  }
}
