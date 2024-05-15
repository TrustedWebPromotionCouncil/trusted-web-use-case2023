import { groupAccountAtom } from '@/states/groupAccount';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useEffect } from 'react';

export const useLoading = () => {
  const isloading = useAtomValue(loadable(groupAccountAtom));

  return { isloading };
};
