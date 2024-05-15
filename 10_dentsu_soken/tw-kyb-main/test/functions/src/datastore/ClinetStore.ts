import { Client } from './type';

export const ClinetStore: Client[] = [
  { clientId: 'hoge', clientName: 'hoge', redirectUri: 'https://example.com/' },
];

export const findClient = (clientId: string) => {
  return ClinetStore.find((v) => v.clientId === clientId);
};
