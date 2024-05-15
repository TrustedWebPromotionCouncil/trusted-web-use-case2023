import { IOffer, Response } from '@/models';
import { ApiService } from './api.service';

class OfferService extends ApiService {
  sendLike(id: number): Promise<Response> {
    return this.post(Response, `candidates/${id}/like`, {});
  }
  sendMail(params: IOffer): Promise<Response> {
    return this.post(Response, `candidates/${params.id}/sendmail`, params);
  }
}
export const offerService = new OfferService();
