import { BusinessUnit, Contract } from '.';

export interface ChallengeVc {
  id: number;
  challenge: string;
  issuerName: string;
  issuerId: string;
  content: string;
  signature: string;
  validFrom: Date;
  validUntil: Date;
  original: JSON;
  businessUnitId: number;
  businessUnit: BusinessUnit;
  contractId?: number;
  contract?: Contract;
}
