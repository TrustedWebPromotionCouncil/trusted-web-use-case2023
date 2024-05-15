import { useEffect, useState } from 'react';
import { useFirebaseAuth } from './useFirebaseAuth';
import { useGroupAccount } from './useGroupAccount';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { usePersonalAccount } from './usePersonalAccount';

type AccountList = {
  name: string;
  id: string;
  isGroup: boolean;
  current: boolean;
};

const accountState = atomWithStorage<AccountList>('currentAccount', {
  current: true,
  id: '',
  isGroup: false,
  name: '',
});

export const useAccount = () => {
  const [accountList, setAccontList] = useState<AccountList[]>([]);
  const [currentAccount, setCurrentAccount] = useAtom(accountState);
  const { user } = useFirebaseAuth();
  const { groupList } = useGroupAccount();
  const { account } = usePersonalAccount();

  useEffect(() => {
    const l: AccountList[] = [];
    if (account) {
      l.push({
        name: `${account.lastName}${account.firstName}`,
        id: account.id,
        current: true,
        isGroup: false,
      });
      if (!currentAccount.id) {
        setCurrentAccount({
          name: `${account.lastName}${account.firstName}`,
          id: account.id,
          current: true,
          isGroup: false,
        });
      }
    }
    groupList.forEach((v) => {
      l.push({
        name: v.name,
        id: v.id,
        current: false,
        isGroup: true,
      });
    });
    setAccontList(l);
  }, [user]);

  const changeAccount = (id: string) => {
    setAccontList(() => {
      return accountList.map((v) => {
        if (id === v.id) {
          setCurrentAccount({ ...v, current: true });
          return { ...v, current: true };
        }
        return { ...v, current: false };
      });
    });
  };

  return { accountList, currentAccount, changeAccount };
};
