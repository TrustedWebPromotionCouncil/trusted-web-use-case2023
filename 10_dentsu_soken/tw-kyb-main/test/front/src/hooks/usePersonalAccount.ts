import { groupAccountAtom } from '@/states/groupAccount';
import { personalAccountAtom } from '@/states/personalAccount';
import { GroupAccount, PersonalAccount, RegisteredAccount } from '@/types';
import { useAtom } from 'jotai';

export const usePersonalAccount = () => {
  const [account, setAccount] = useAtom(personalAccountAtom);

  // const getGroup = (id: string): GroupAccount | undefined => {
  //   try {
  //     return account.find((v) => v.id === id);
  //   } catch (e) {
  //     console.log('e.message :>> ', (e as Error).message);
  //     return;
  //   }
  // };

  // const addGroup = (data: GroupAccount) => {
  //   try {
  //     setAccount((prev) => [...prev, data]);
  //     return true;
  //   } catch (e) {
  //     console.log('e.message :>> ', (e as Error).message);
  //     return false;
  //   }
  // };

  // const updateGroup = (id: string, data: GroupAccount): boolean => {
  //   try {
  //     setAccount((prev) => prev.map((v) => (v.id === id ? data : v)));
  //     return true;
  //   } catch (e) {
  //     console.log('e.message :>> ', (e as Error).message);
  //     return false;
  //   }
  // };

  const addAccount = (data: PersonalAccount) => {
    try {
      setAccount(data);
      return true;
    } catch (e) {
      console.log('e.message :>> ', (e as Error).message);
      return false;
    }
  };

  return { account, addAccount };
};
