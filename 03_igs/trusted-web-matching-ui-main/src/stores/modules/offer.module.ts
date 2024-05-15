import { secureStorage } from '@/services';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { rootStore } from '..';
import { IOffer } from '@/models';
import { offerService } from '@/services/api/offer.service';

interface OfferState extends IOffer {}
const moduleName = 'offerModule';
@Module({ dynamic: true, store: rootStore, name: moduleName, namespaced: true, preserveState: Boolean(secureStorage.getItem(moduleName)) })
class OfferModule extends VuexModule implements OfferState {
  id: number = 0;
  mail: string = '';
  message: string = '';

  @Mutation
  public init() {
    this.id = 0;
    this.mail = '';
    this.message = '';
  }
  @Mutation
  public setOffer(v: IOffer) {
    this.id = v.id;
    this.mail = v.mail;
    this.message = v.message;
  }
  @Action({ rawError: true })
  public async sendLike(id: number) {
    return await offerService.sendLike(id);
  }
  @Action({ rawError: true })
  public async sendMail() {
    const params: IOffer = {
      id: this.id,
      mail: this.mail,
      message: this.message,
    };
    return await offerService.sendMail(params);
  }
}

export const offerModule = getModule(OfferModule);
