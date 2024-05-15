import { Candidate, CandidateDetail, IFetchCandidateDetailByIdParams, IFetchCandidateListParams } from '@/models/candidate.model';
import { ApiService } from './api.service';

class CandidateService extends ApiService {
  fetchCandidateList(params?: IFetchCandidateListParams): Promise<Candidate[]> {
    return this.getList(Candidate, 'candidates', params);
  }
  fetchCandidateDetailById(id: number, params?: IFetchCandidateDetailByIdParams): Promise<CandidateDetail> {
    return this.get(CandidateDetail, `candidates/${id}`, params);
  }
}

export const candidateService = new CandidateService();
