import { BusinessUnit, Vc } from '.';
//import { Issuer } from './Issuer';
//import { Proof } from './Proof';

export interface VcForBusinessUnit extends Vc {
  id: number;
  authenticationLevel: number;
  issuerName: string;
  uuid: string;
  validFrom: string;
  validUntil: string;
  original: any;
  businessUnitId: number;
  businessUnit: BusinessUnit;
  isPrivateVc: boolean;
}

export interface VcForBusinessUnitForm {
  authenticationLevel?: number;
  businessUnitName?: string;
  businessUnitCountry?: string;
  businessUnitAddress?: string;
  contactName?: string;
  contactDepartment?: string;
  contactJobTitle?: string;
  contactNumber?: string;
  legalEntityId?: string;
  legalEntityName?: string;
  legalEntityLocation?: string;
  businessUnitId?: number;
  isPrivateVc: boolean;
  hasPublicVc: boolean;
}
