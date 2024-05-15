import { Serializable } from './serializable';

export interface IOffer {
  id: number;
  mail: string;
  message: string;
}
export class Offer implements IOffer, Serializable<Offer> {
  id: number = 0;
  mail: string = '';
  message: string = '';
  deserialize(input: IOffer): Offer {
    this.id = input.id;
    this.mail = input.mail;
    this.message = input.message;
    return this;
  }
}
