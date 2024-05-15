import { ContractVp } from '.'

export interface ContractVpVerificationResult {
  id: number
  date: Date
  hasValidChallengeVc: boolean
  hasOpponentChallenge: boolean
  hasValidVp: boolean
  hasValidVcForBusinessUnit: boolean
  hasValidIssuerVp: boolean
  hasValidIssuerVc: boolean
  hasValidBusinessUnitCredentialStatus: boolean
  hasValidIssuerCredentialStatus: boolean
  contractVpId: number
  contractVp?: ContractVp
}