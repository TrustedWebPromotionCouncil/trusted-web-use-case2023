'use client';
import { useAtomValue } from 'jotai';
import Breadcrumb from '@/components/demo/Breadcrumb';
import Button from '@/components/demo/Button';
import PageTitle from '@/components/demo/PageTitle';
import { groupAccountAtom } from '@/states/groupAccount';
import { useLocale } from '@/hooks/useLocale';
import { useGroupAccount } from '@/hooks/useGroupAccount';

export default function Pagesess() {
  const { t } = useLocale();
  const info = useAtomValue(groupAccountAtom);
  const { groupList } = useGroupAccount();
  return (
    <>
      <Breadcrumb
        pages={[
          {
            title: t.COMPONENTS.BREADCRUMB.HOME,
            path: '/demo/wallet/01_home',
          },
          {
            title: t.COMPONENTS.BREADCRUMB.CREATE_ACCOUNT,
            path: '/demo/wallet/10_createAccount',
          },
          { title: t.COMPONENTS.BREADCRUMB.GROUP_ACCOUNT_DONE },
        ]}
      />
      <PageTitle title={t.PAGES.GROUP_ACCOUNT_DONE.TITLE} />
      <div className="w-[327px] mx-auto pl-4 pt-[33px]">
        <h2 className="text-[28px]">
          {t.PAGES.GROUP_ACCOUNT_DONE.MSG_CREATE_DONE}
        </h2>
        <div className="flex flex-col gap-[22px] pt-[31px]">
          <div>
            <p>{t.PAGES.GROUP_ACCOUNT_DONE.MSG_NAME}</p>
            <p className="text-xl">{groupList[groupList.length - 1].name}</p>
          </div>
          <div>
            <p>{t.PAGES.GROUP_ACCOUNT_DONE.MSG_ID}</p>
            <p>{groupList[groupList.length - 1].id}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-[196px]">
        <Button
          label={t.PAGES.GROUP_ACCOUNT_DONE.BTN_BACK_HOME}
          color="blue"
          size="medium"
          variant="outline"
          path="/demo/wallet/01_home"
        />
      </div>
    </>
  );
}
