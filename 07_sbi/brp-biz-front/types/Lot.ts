import { Order, Product, VcForProduct } from '.';

export interface Lot {
  id: number;
  name: string;
  number: number;
  productId: number;
  product: Product;
  vcForProductId?: number;
  vcForProduct?: VcForProduct;
  order: Order[];
}