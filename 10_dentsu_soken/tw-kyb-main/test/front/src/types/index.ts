export type PersonalAccount = {
  id: string;
  firstName: string;
  lastName: string;
};

export type RegisteredAccount = {
  id: string;
  name: string;
  type: 'admin' | 'pic';
  from: number;
  to: number;
  signable: number;
};

export type GroupAccount = {
  id: string;
  name: string;
  createAt: number;
  registeredList: RegisteredAccount[];
};

export type KYC = {
  type: 'kyc';
  firstName: string;
  lastName: string;
  firstName_kana: string;
  lastName_kana: string;
  birthday: number;
  gender: 'male' | 'female' | 'other';
  prefectuer: string;
  city: string;
  address: string;
  building: string;
};

// Certificate of Enrollment
export type COE = {
  type: 'coe';
  corpName: string;
  hireDate: number;
  seviceYears: number;
  firstName: string;
  lastName: string;
  firstName_kana: string;
  lastName_kana: string;
  prefectuer: string;
  city: string;
  address: string;
  building: string;
};

export type KYB = {
  type: 'kyb';
  corpName: string;
  corpNumber: number;
  establishDate: number;
  president: string;
  prefectuer: string;
  city: string;
  address: string;
  building: string;
};

export type Bank = {
  name: string;
  address: string;
  corpName: string;
  type: 'bank';
  accountType: string;
  cash: boolean;
  transfer: boolean;
  other: boolean;
};
