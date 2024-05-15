'use client';
import Breadcrumb from '@/components/demo/Breadcrumb';
import PageTitle from '@/components/demo/PageTitle';
import { usePathname } from 'next/navigation';
import Button from '@/components/demo/Button';
import { GroupAccount } from '@/types';
import { useEffect, useState } from 'react';
import { useGroupAccount } from '@/hooks/useGroupAccount';
import { useLocale } from '@/hooks/useLocale';

export default function Pagesess() {
  const { t } = useLocale();
  const { getGroup } = useGroupAccount();
  const [group, setGroup] = useState<GroupAccount | undefined>();
  const pathname = usePathname();
  const id = pathname.slice(pathname.lastIndexOf('/') + 1);

  useEffect(() => {
    setGroup(getGroup(id));
  }, [getGroup(id)]);

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
          {
            title: t.COMPONENTS.BREADCRUMB.GROUP_SELECT,
            path: '/demo/wallet/10_createAccount/131_groupSelect',
          },
          {
            title: group ? group.name : '',
          },
        ]}
      />
      <PageTitle title={group ? group.name : ''} />
      <div className="w-[327px] mx-auto pl-4 pt-[33px]">
        <h2 className="text-[28px]">{t.PAGES.GROUP_DONE.MSG_REGISTER_DONE}</h2>
        <div className="flex flex-col gap-[22px] pt-[31px]">
          <div>
            <p>{t.PAGES.GROUP_DONE.MSG_GROUP_NAME}</p>
            <p>{group ? group.name : ''}</p>
          </div>
          <div>
            <p>{t.PAGES.GROUP_DONE.MSG_ACCOUNT_TYPE}</p>
            <p>
              {group?.registeredList[group.registeredList.length - 1].type ===
              'admin'
                ? t.PAGES.GROUP_DONE.ACCOUNT_ADMIN
                : t.PAGES.GROUP_DONE.ACCOUNT_PIC}
            </p>
          </div>
          <div>
            <p>{t.PAGES.GROUP_DONE.MSG_ACCOUNT_NAME}</p>
            <p>{group?.registeredList[group.registeredList.length - 1].name}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-[196px]">
        <Button
          label={t.PAGES.GROUP_DONE.BTN_BACK_HOME}
          color="blue"
          size="medium"
          variant="outline"
          path={`/demo/wallet/10_createAccount/132_groupHome/${
            group ? group.id : ''
          }`}
        />
      </div>
    </>
  );
}
