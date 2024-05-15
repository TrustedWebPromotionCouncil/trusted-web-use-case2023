export type User = {
  uid: string;
  email: string;
};

export type Tag = {
  id: string;
  name: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type EditedTask = Omit<Task, 'completed' | 'createdAt'>;

export type SelectedTag = Omit<Tag, 'createdAt'>;

export type RootStackParamList = {
  Auth: undefined;
  TagList: undefined;
  CreateTag: undefined;
  TaskList: undefined;
  TaskStack: undefined;
  CreateTask: undefined;
  EditTask: undefined;
  DemoMenu: undefined;
  QRScan: undefined;
  QRScanNav: undefined;
  CredentialOfferResult: undefined;
  SignatureScreen: undefined;
  CredentialList: undefined;
  CredentialOfferlList: undefined;
  CredentialOfferNavigator: undefined;
  CredentialNavigator: undefined;
  CredentialOfferDetail: { id: string };
  CredentialDetail: { id: string };
};
