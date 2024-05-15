import { BusinessUnit, Lot, VcForProduct } from '.';

export interface Product {
  id: number;
  name: string;
  number: string;
  lots: Lot[];
  vcs: VcForProduct[];
  businessUnitId: number;
  businessUnit: BusinessUnit;
}
