import { VcType } from "@/types/VcType";

export interface Vc {
  id: number;
  type: VcType
  issuerName: string;
  uuid: string;
  validFrom: string;
  validUntil: string;
  original: string;
}

export class VerifiablePresentation {
  "@context": Array<string>;
  id: string;
  type: Array<string>;
  credentialSubject: {
    didDocument: {
      "@context": string;
      id: string;
      verificationMethod: [{
        controller: string;
        id: string;
        publicKeyMultibase: string;
        type: string;
      }];
    };
    authenticatorInfo: {
      digitalCertificateOrganizationName: string;
      digitalCertificateOrganizationCredentialIssuer: string;
    };
    businessUnitInfo: {
      businessUnitName: string;
      country: string;
      address: string;
      contactInfo: {
        name: string;
        department: string;
        jobTitle: string;
        contactNumber: string;
      };
    };
    legalEntityInfo: {
      legalEntityIdentifier: string;
      legalEntityName: string;
      location: string;
    };
    authenticationLevel: string;
    revocationEndPoints: Array<string>;
    linkedVP: {
      "@context": Array<string>;
      id: string;
      holder: string;
      type: Array<string>;
      verifiableCredential: [{
        "@context": Array<string>;
        id: string;
        type: Array<string>;
        credentialSubject: {
          blockHash: string;
          didDocument: {
            "@context": string;
            id: string;
            verificationMethod: [{
              controller: string;
              id: string;
              publicKeyMultibase: string;
              type: string;
            }];
          };
          uuid: string;
        };
        issuer: {
          id: string;
          name: string;
        };
        validFrom: string;
        validUntil: string;
      }];
    }
  };

  constructor() {
    this["@context"] = [];
    this.id = "";
    this.type = [];
    this.credentialSubject = {
      didDocument: {
        "@context": "",
        id: "",
        verificationMethod: [{
          controller: "",
          id: "",
          publicKeyMultibase: "",
          type: ""
        }]
      },
      authenticatorInfo: {
        digitalCertificateOrganizationName: "",
        digitalCertificateOrganizationCredentialIssuer: ""
      },
      businessUnitInfo: {
        businessUnitName: "",
        country: "",
        address: "",
        contactInfo: {
          name: "",
          department: "",
          jobTitle: "",
          contactNumber: ""
        }
      },
      legalEntityInfo: {
        legalEntityIdentifier: "",
        legalEntityName: "",
        location: ""
      },
      authenticationLevel: "",
      revocationEndPoints: [],
      linkedVP: {
        "@context": [],
        id: "",
        holder: "",
        type: [],
        verifiableCredential: [{
          "@context": [],
          id: "",
          type: [],
          credentialSubject: {
            blockHash: "",
            didDocument: {
              "@context": "",
              id: "",
              verificationMethod: [{
                controller: "",
                id: "",
                publicKeyMultibase: "",
                type: ""
              }]
            },
            uuid: ""
          },
          issuer: {
            id: "",
            name: ""
          },
          validFrom: "",
          validUntil: ""
        }]
      }
    };
  }
}

export interface VerifiableCredential {
  "@context": Array<string>;
  id: string;
  type: Array<string>;
  credentialSubject: CredentialSubject;
  issuer: {
    id: string;
    name: string;
  };
  validFrom: string;
  validUntil: string;
  proof: Proof;
}

export interface CredentialSubject {
  didDocument: DidDocument;
  authenticatorInfo: {
    digitalCertificateOrganizationName: string;
    digitalCertificateOrganizationCredentialIssuer: string;
  };
  businessUnitInfo: {
    businessUnitName: string;
    country: string;
    address: string;
    contactInfo: [{
      name: string;
      department: string;
      jobTitle: string;
      contactNumber: string;
    }];
  };
  legalEntityInfo: {
    legalEntityIdentifier: string;
    legalEntityName: string;
    location: string;
  };
  authenticationLevel: string;
  revocationEndPoints: Array<string>;
  linkedVP: LinkedVP;
  uuid: string;
}

export interface DidDocument {
  "@context": string;
  id: string;
  verificationMethod: Array<VerificationMethod>;
}

export interface LinkedVP {
  "@context" : Array<string>;
  id: string;
  holder: string;
  type: Array<string>;
  verifiableCredential: [{
    "@context": Array<string>;
    id: string;
    type: Array<string>;
    credentialSubject: {
      blocHash: string;
      didDocument: DidDocument;
      uuid: string;
    };
    issuer: {
      id: string;
      name: string;
    };
    validFrom: string;
    validUntil: string;
    proof: Proof;
  }];
  proof: Array<Proof>;
}

export interface Proof {
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  signatureValue: string;
}

export interface VerificationMethod {
  controller: string;
  id: string;
  publicKeyMultibase: string;
  type: string;
}
