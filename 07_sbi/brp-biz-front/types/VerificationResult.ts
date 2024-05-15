import { Vp } from "."

export interface VerificationResult {
  id: number
  date: Date
  hasValidBusinessUnitSignature: boolean
  hasValidVcForBusinessUnit: boolean
  hasValidIssuerSignature: boolean
  hasValidIssuerVc: boolean
  hasValidBusinessUnitCredentialStatus: boolean
  hasValidIssuerCredentialStatus: boolean
  vpId: number
  vp?: Vp
}