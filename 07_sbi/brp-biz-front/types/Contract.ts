import { BusinessUnit, ContractVp, ChallengeVc } from '.';

export interface Contract {
  id: number;
  contractDate?: Date;
  contractDocumentStatus: string | "PreReview" | "Reviewed" ;
  partyAId: number;
  partyA: BusinessUnit;
  partyAChallenge?: string;
  partyBId: number;
  partyB: BusinessUnit;
  partyBChallenge?: string;
  contractVp: ContractVp;
  challengeVc: ChallengeVc
}