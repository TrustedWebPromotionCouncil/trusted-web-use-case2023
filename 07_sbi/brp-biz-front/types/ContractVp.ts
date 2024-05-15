import { BusinessUnit, ContractVpVerificationResult } from '.'

export interface ContractVp {
  id: number,
  issuerName: string
  issuerId: string
  content: string
  signature: string
  validFrom: Date
  validUntil: Date
  challengeVcValidFrom?: string;
  challengeVcValidUntil?: string;
  challengeVcIssuerId?: string
  challengeVcIssuerName?: string
  challengeVcHolderId?: string
  challengeVcHolderName?: string
  challengeVcContent?: string
  challengeVcSignature?: string
  challenge: string
  vcValidFrom?: string
  vcValidUntil?: string
  vcUuid?: string
  vcAuthId?: string
  vcAuthName?: string
  vcAuthCertifierName?: string
  vcBusinessUnitId?: string
  vcBusinessUnitName?: string
  vcBusinessUnitCountry?: string
  vcBusinessUnitAddress?: string
  vcLegalEntityIdentifier?: string
  vcLegalEntityName?: string
  vcLegalEntityLocation?: string
  vcContent?: string
  vcSignature?: string
  vcIssuerSignature?: string
  vcIssuerVpSignature?: string
  vcIssuerVcSignature?: string
  vcSignedVcContent?: string
  vcSignedVpContent?: string
  vcIssuerSignedContent?: string
  vcIssuerPublicKey?: string
  vcIssuerUuid?: string
  original: JSON
  businessUnitId: number
  businessUnit: BusinessUnit
  contractVpVerificationResult: ContractVpVerificationResult
}