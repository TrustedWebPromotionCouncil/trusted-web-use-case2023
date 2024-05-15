'use client';
import Button from '@/components/demo/Button';
import { useLocale } from '@/hooks/useLocale';

export type PersonalAccount = {
  firstName: string;
  lastName: string;
};

export default function Pagesess() {
  const { t } = useLocale();
  return (
    <>
      <div className="w-[327px] mx-auto pl-4 pt-28">
        <h2 className="text-[28px]">{t.PAGES.BANK_DONE.TITLE}</h2>
        <div className="flex flex-col gap-[22px] pt-[31px]">
          <div>
            <p>{t.PAGES.BANK_DONE.APPLICATION_ID}</p>
            <p className="text-3xl">0123456xyz</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-[196px]">
        <Button
          label={t.PAGES.BANK_DONE.BTN_BACK}
          color="yellow"
          size="medium"
          variant="outline"
          path="/demo/wallet/01_home"
        />
      </div>
    </>
  );
}
