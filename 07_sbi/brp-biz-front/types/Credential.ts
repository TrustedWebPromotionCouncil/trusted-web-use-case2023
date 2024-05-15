export interface Credential {
  context: string[];
  id: string;
  type: string[];
  issuer: {
    ID: string;
    Name: string;
  };
  validFrom: string;
  validUntil: string;
  credentialSubject: string;
}