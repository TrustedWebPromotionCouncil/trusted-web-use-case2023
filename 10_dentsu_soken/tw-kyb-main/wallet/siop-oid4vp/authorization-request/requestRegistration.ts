import {
  RPRegistrationMetadataOpts,
  RPRegistrationMetadataPayload,
} from '../types';

export const createRPRegistrationMetadataPayload = (
  opts: RPRegistrationMetadataOpts,
): RPRegistrationMetadataPayload => {
  const payload: RPRegistrationMetadataPayload = {
    id_token_signing_alg_values_supported:
      opts.idTokenSigningAlgValuesSupported,
    request_object_signing_alg_values_supported:
      opts.requestObjectSigningAlgValuesSupported,
    response_types_supported: opts.responseTypesSupported,
    scopes_supported: opts.scopesSupported,
    subject_types_supported: opts.subjectTypesSupported,
    subject_syntax_types_supported: opts.subject_syntax_types_supported || [
      'did:web:',
      'did:ion:',
    ],
    vp_formats: opts.vpFormatsSupported,
    client_name: opts.clientName,
    logo_uri: opts.logo_uri,
    tos_uri: opts.tos_uri,
    client_purpose: opts.clientPurpose,
    client_id: opts.client_id,
  };

  const languageTagEnabledFieldsNamesMapping = new Map<string, string>();
  languageTagEnabledFieldsNamesMapping.set('clientName', 'client_name');
  languageTagEnabledFieldsNamesMapping.set('clientPurpose', 'client_purpose');

  const languageTaggedFields: Map<string, string> =
    LanguageTagUtils.getLanguageTaggedPropertiesMapped(
      opts,
      languageTagEnabledFieldsNamesMapping,
    );

  languageTaggedFields.forEach((value: string, key: string) => {
    payload[key] = value;
  });

  return removeNullUndefined(payload);
};
