import { LegalEntity, Order, Product, User, VcForBusinessUnit } from '.';

export interface BusinessUnit {
  id: number;
  name: string;
  address: string;
  did: string;
  publicKey: string;
  privateKey: string;
  prefix: string;
  vcsForBusinessUnit: VcForBusinessUnit[];
  users: User[];
  legalEntityId: number;
  legalEntity: LegalEntity;
  products: Product[];
  orders: Order[];
  domainName: string;
}
