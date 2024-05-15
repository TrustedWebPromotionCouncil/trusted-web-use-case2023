import { type UserType } from '~/features/user/types';

const USER_MENU_COLOER = Object.freeze({
  authority: '#58B660',
  business: '#004AAD',
  public: '#004AAD',
  revoke: '#E46464',
});

export const USER_BORDER_COLOER = Object.freeze({
  authority: '#329410',
  business: '#007AFF',
  public: '#007AFF',
  revoke: '#E46464',
});

export const USER_TABLE_HEAD_COLOR = USER_MENU_COLOER;

export const menuBg = (userType: UserType, isActive: boolean) => isActive ? USER_MENU_COLOER[userType] : undefined;
export const menuColor = (isActive: boolean) => isActive ? '#FFD166' : 'white';
