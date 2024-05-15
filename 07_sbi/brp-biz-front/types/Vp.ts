import { VerificationResult } from '@prisma/client';
import { Order } from '.';

export interface Vp {
  key: string;
  did: string;
  original: string;
  orderId: number;
  order: Order;
  verificationResult?: VerificationResult
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
  issuer: {
    id: string;
    name: string;
  };
  validFrom: string;
  validUntil: string;

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
    this.issuer = {
      id: "",
      name: "",
    };
    this.validFrom = "";
    this.validUntil = "";
  }

  create(item: any) {
    if(!item) return this
    this['@context'] = item["@context"] ?? this['@context'];
    this.id = item.id ?? this.id;
    this.type = item.type ?? this.type;
    this.credentialSubject = item.credentialSubject ?? this.credentialSubject;
    this.issuer = item.issuer ?? this.issuer;
    this.validFrom = item.validFrom ?? this.validFrom;
    this.validUntil = item.validUntil ?? this.validUntil;
    return this
  }
}
