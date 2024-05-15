import { groupAccountAtom } from '@/states/groupAccount';
import { GroupAccount, RegisteredAccount } from '@/types';
import { useAtom } from 'jotai';
import { useFirebaseAuth } from './useFirebaseAuth';

export const useGroupAccount = () => {
  const [groupList, setGroupList] = useAtom(groupAccountAtom);

  const getGroup = (id: string): GroupAccount | undefined => {
    try {
      return groupList.find((v) => v.id === id);
    } catch (e) {
      console.log('e.message :>> ', (e as Error).message);
      return;
    }
  };

  const addGroup = (data: GroupAccount) => {
    try {
      setGroupList((prev) => [...prev, data]);
      return true;
    } catch (e) {
      console.log('e.message :>> ', (e as Error).message);
      return false;
    }
  };

  const updateGroup = (id: string, data: GroupAccount): boolean => {
    try {
      setGroupList((prev) => prev.map((v) => (v.id === id ? data : v)));
      return true;
    } catch (e) {
      console.log('e.message :>> ', (e as Error).message);
      return false;
    }
  };

  const addAccount = (id: string, data: RegisteredAccount) => {
    try {
      const group = getGroup(id);
      if (!group) {
        return false;
      }
      group.registeredList = [...group.registeredList, data];
      if (!updateGroup(id, group)) {
        return false;
      }
      return true;
    } catch (e) {
      console.log('e.message :>> ', (e as Error).message);
      return false;
    }
  };

  const getAccountList = (
    id: string,
    from?: number,
    to?: number
  ): RegisteredAccount[] | undefined => {
    const target = getGroup(id);
    if (!!target && typeof from === 'number' && typeof to === 'number') {
      console.log('test');

      return target.registeredList.slice(from, to);
    }
    return target?.registeredList;
  };
  return { groupList, getGroup, addGroup, addAccount, getAccountList };
};
