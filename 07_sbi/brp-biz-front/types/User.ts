import { BusinessUnit } from '.';

export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  businessUnitId: number;
  businessUnit: BusinessUnit;
}

export interface UserForm {
  userId?: number;
  email?: string;
  name?: string;
  password?: string;
  legalEntityId?: number;
  legalEntityName?: string;
  businessUnitId?: number;
  businessUnitName?: string;
  prefix?: string;
  color?: string;
  domainName?: string;
  did?: string;
  publicKey?: string;
  privateKey?: string;
  identifier?: string;
}

