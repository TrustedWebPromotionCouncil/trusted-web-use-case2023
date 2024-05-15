import { candidateService, secureStorage } from '@/services';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { rootStore } from '..';
import { CONST, Enums, ICandidate, IFetchCandidateDetailByIdParams, IFetchCandidateListParams } from '@/models';

interface CandidateState {
  sort: CONST.SORT_TYPE;
  ability: Enums.AbilityType;
  candidateList: ICandidate[];
}
const moduleName = 'candidateModule';
@Module({ dynamic: true, store: rootStore, name: moduleName, namespaced: true, preserveState: Boolean(secureStorage.getItem(moduleName)) })
class CandidateModule extends VuexModule implements CandidateState {
  sort: CONST.SORT_TYPE = 'ability';
  ability: Enums.AbilityType = Enums.AbilityType.Balanced;
  candidateList: ICandidate[] = [];

  @Mutation
  public init() {
    this.candidateList = [];
  }
  @Mutation
  public setCandidateList(value: ICandidate[]) {
    this.candidateList = value;
  }
  @Mutation
  public setSortType(value: CONST.SORT_TYPE) {
    this.sort = value;
  }
  @Mutation
  public setAbilityType(value: Enums.AbilityType) {
    this.ability = value;
  }

  /**
   * for Candidate List (all data, sortable)
   * @param params
   */
  @Action({ rawError: true })
  public async fetchCandidateList() {
    const params: IFetchCandidateListParams = {
      sortType: this.sort,
      abilitypt: this.ability,
    };
    const res = await candidateService.fetchCandidateList(params);
    this.setCandidateList(res);
  }
  /**
   * for Candidate Detail (skill)
   * @param id
   * @returns
   */
  @Action({ rawError: true })
  public async fetchCandidateDetailById(id: number) {
    const params: IFetchCandidateDetailByIdParams = {
      abilitypt: this.ability,
    };
    return await candidateService.fetchCandidateDetailById(id, params);
  }
}

export const candidateModule = getModule(CandidateModule);
