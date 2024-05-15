import { BusinessUnit, Lot, Vp } from '.';

export interface Order {
  id: number;
  shippingForId: number;
  shippingFor: BusinessUnit;
  shippingDate?: string;
  quality?: 'S' | 'A' | 'B' | 'C';
  status: string | 'Before' | 'Prepare' | 'Shipped';
  lotId: number;
  lot: Lot;
  vp?: Vp;
}
