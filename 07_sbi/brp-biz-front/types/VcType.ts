export const vcType = {
  BUSINESS_UNITS: "事業所VC",
  PRODUCTS: "製品VC",
  CHALLENGE_VC: "Challenge VC"
} as const;

export type VcType = typeof vcType[keyof typeof vcType]

export function toTextCertificateType(type: VcType) {
  switch (type) {
    case vcType.BUSINESS_UNITS:
      return "事業所VC";
    case vcType.PRODUCTS:
      return "製品VC";
    case vcType.CHALLENGE_VC:
      return "Challenge VC";
  }
}
