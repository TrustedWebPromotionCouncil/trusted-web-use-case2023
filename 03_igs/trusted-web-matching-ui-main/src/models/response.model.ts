import { Serializable } from './serializable';

export interface IResponse {}
export class Response implements IResponse, Serializable<Response> {
  deserialize(input: IResponse): Response {
    return this;
  }
}
