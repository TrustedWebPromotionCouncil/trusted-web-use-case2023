'use client';
import Breadcrumb from '@/components/demo/Breadcrumb';
import Button from '@/components/demo/Button';
import PageTitle from '@/components/demo/PageTitle';
import { useLocale } from '@/hooks/useLocale';
import { usePersonalAccount } from '@/hooks/usePersonalAccount';

export default function Pagesess() {
  const { t } = useLocale();
  const { account } = usePersonalAccount();
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
          { title: t.COMPONENTS.BREADCRUMB.PERSONAL_ACCOUNT_DONE },
        ]}
      />
      <PageTitle title={t.PAGES.PERSONAL_ACCOUNT_DONE.TITLE} />
      <div className="w-[327px] mx-auto pl-4 pt-[33px]">
        <h2 className="text-[28px]"></h2>
        <div className="flex flex-col gap-[22px] pt-[31px]">
          <div>
            <p>{t.PAGES.PERSONAL_ACCOUNT_DONE.MSG_NAME}</p>
            <p>
              {account.lastName} {account.firstName}
            </p>
          </div>
          <div>
            <p>{t.PAGES.PERSONAL_ACCOUNT_DONE.MSG_ID}</p>
            <p>{account.id}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-[196px]">
        <Button
          label={t.PAGES.PERSONAL_ACCOUNT_DONE.BTN_BACK_HOME}
          color="blue"
          size="medium"
          variant="outline"
          path="/demo/wallet/01_home"
        />
      </div>
    </>
  );
}
