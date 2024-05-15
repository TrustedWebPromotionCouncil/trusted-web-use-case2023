'use client';

import Breadcrumb from '@/components/demo/Breadcrumb';
import Button from '@/components/demo/Button';
import Card from '@/components/demo/Card';
import CardGroup from '@/components/demo/Icon/CardGroup';
import CardPerson from '@/components/demo/Icon/CardPerson';
import PageTitle from '@/components/demo/PageTitle';
import { useLocale } from '@/hooks/useLocale';

export default function Pagesess() {
  const { t } = useLocale();

  return (
    <>
      <Breadcrumb
        pages={[
          {
            title: t.COMPONENTS.BREADCRUMB['HOME'],
            path: '/demo/wallet/01_home',
          },
          { title: t.COMPONENTS.BREADCRUMB['CREATE_ACCOUNT'] },
        ]}
      />
      <PageTitle title={t.PAGES['CREATE_ACCOUNT'].TITLE} />
      <div className="flex flex-col gap-9 pt-[33px]">
        <Card
          Icon={CardPerson}
          label={t.PAGES['CREATE_ACCOUNT'].PERSONAL_ACCOUNT}
        >
          <div className="flex flex-col items-center justify-center">
            <Button
              label={'個人アカウント管理'}
              color="blue"
              size="small"
              variant="outline"
              path="10_createAccount/111_personalAccount"
            />
          </div>
        </Card>
        <Card Icon={CardGroup} label={t.PAGES['CREATE_ACCOUNT'].GROUP_ACCOUNT}>
          <div className="flex flex-col gap-6 items-center justify-center">
            <Button
              label={'グループアカウント管理'}
              color="blue"
              size="small"
              variant="outline"
              path="10_createAccount/121_groupAccount"
            />
            <Button
              label={t.PAGES['CREATE_ACCOUNT'].MENU_ADD_ADMIN_PIC}
              color="blue"
              size="small"
              variant="outline"
              path="10_createAccount/131_groupSelect"
            />
          </div>
        </Card>
      </div>
    </>
  );
}
