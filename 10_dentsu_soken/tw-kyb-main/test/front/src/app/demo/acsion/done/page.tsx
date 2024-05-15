'use client';
import ACSiONHeader from '@/components/demo/ACSiONHeader';
import Button from '@/components/demo/Button';
import { useApplication } from '@/hooks/useApplication';
import { useLocale } from '@/hooks/useLocale';

export type PersonalAccount = {
  firstName: string;
  lastName: string;
};

export default function Pagesess() {
  const { t } = useLocale();
  const { application } = useApplication();
  return (
    <>
      <ACSiONHeader />
      <div className="w-[327px] mx-auto pl-4 pt-28">
        <h2 className="text-[28px]">{t.PAGES.BANK_DONE.TITLE}</h2>
        <div className="flex flex-col gap-[22px] pt-[31px]">
          <div>
            <p>{t.PAGES.BANK_DONE.APPLICATION_ID}</p>
            <p className="text-3xl">{application[application.length - 1].id}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-[196px]">
        <Button
          label={t.PAGES.BANK_DONE.BTN_BACK}
          color="green"
          size="medium"
          variant="outline"
          path="/demo/wallet/01_home"
        />
      </div>
    </>
  );
}
