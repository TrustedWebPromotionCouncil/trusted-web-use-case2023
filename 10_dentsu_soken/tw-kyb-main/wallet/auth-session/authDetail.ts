export type AuthDetail = {
  type: string;
  locations?: string[];
  format: string;
  credential_definition: {
    type: string[];
  };
};

export const makeAuthDetail4VcSdJwt = (): AuthDetail => ({
  type: 'openid_credential',
  format: 'vc+sd-jwt',
  credential_definition: {
    type: ['IdentityCredential'],
  },
});
