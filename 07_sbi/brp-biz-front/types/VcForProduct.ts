import { Lot, Product, Vc } from '.';

export interface VcForProduct extends Vc {
  id: number;
  issuerName: string;
  validFrom: string;
  validUntil: string;
  original: any;
  productId: number;
  product: Product;
  lots: Lot[];
}