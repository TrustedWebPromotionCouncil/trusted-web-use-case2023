'use client';

import { useForm } from 'react-hook-form';
import Button from '@/components/demo/Button';
import PageTitle from '@/components/demo/PageTitle';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import { useApplication } from '@/hooks/useApplication';
import prefecture from '@/consts/prefecture';
import { useAtomValue } from 'jotai';
import { bankState } from '@/states/bankState';

export type Application = {
  settlement: boolean;
  saving: boolean;
  finance: boolean;
  trade: boolean;
  others: boolean;
};

export default function Pagesess() {
  const { addApplication } = useApplication();
  const state = useAtomValue(bankState);
  const router = useRouter();
  const { t } = useLocale();
  const { getLastKYC, getLastKYB } = useApplication();
  const kyc = getLastKYC();
  const kyb = getLastKYB();
  const { handleSubmit } = useForm<Application>({
    defaultValues: {
      settlement: false,
      saving: false,
      finance: false,
      trade: false,
      others: false,
    },
  });
  const onSubmit = () => {
    addApplication(
      {
        ...state,
        name: `${kyb?.president}`,
        address: `${
          prefecture.find((v) => v.code === Number(kyb?.prefectuer))?.name
        }${kyb?.city}${kyb?.address}${kyb?.building}`,
        corpName: `${kyb?.corpName}`,
      },
      'トラスト銀行'
    );
  };
  return (
    <>
      <main>
        <PageTitle title={t.PAGES.BANK_CONFIRM.TITLE} />
        <div className="flex justify-end w-[320px] -mt-8 h-fit mx-auto">
          <Link
            href={'request'}
            className="flex w-[129px] h-9 items-center justify-center border rounded-lg border-demo-gray text-demo-gray"
          >
            {t.PAGES.BANK_CONFIRM.BTN_EDIT}
          </Link>
        </div>
        <form className="pt-11" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-fit mx-auto">
            <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
              <span className="block text-sm text-demo-current-page font-medium">
                {t.PAGES.BANK_CONFIRM.NAME}
              </span>
              <span>{`${kyc?.lastName} ${kyc?.firstName}`}</span>
            </label>
            <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
              <span className="block text-sm text-demo-current-page font-medium">
                {t.PAGES.BANK_CONFIRM.ADDRESS}
              </span>
              <span className="bg-white whitespace-pre-wrap">{`${
                prefecture.find((v) => v.code === Number(kyb?.prefectuer))?.name
              }${kyb?.city}${kyb?.address}${kyb?.building}`}</span>
            </label>
            <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
              <span className="block text-sm text-demo-current-page font-medium">
                {t.PAGES.BANK_CONFIRM.CORP_NAME}
              </span>
              <span>{kyb?.corpName}</span>
            </label>
            <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
              <span className="block text-sm text-demo-current-page font-medium">
                {t.PAGES.BANK_CONFIRM.ACCOUNT_TYPE}
              </span>
              <span>{state.accountType}</span>
            </label>
            <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
              <span className="block text-sm text-demo-current-page font-medium">
                {t.PAGES.BANK_CONFIRM.TRANSFER_TYPE}
              </span>
              <p>
                {state.cash ? <span>現金 </span> : <></>}
                {state.transfer ? <span>振込 </span> : <></>}
                {state.other ? <span>その他 </span> : <></>}
              </p>
            </label>
          </div>
          <div className="flex flex-col gap-2 w-fit mx-auto pt-[60px] pb-5">
            <Button
              label={t.PAGES.BANK_CONFIRM.BTN_APPLICATION}
              color="yellow"
              size="medium"
              variant="fill"
              path="bankDone"
              onClick={() => onSubmit()}
            />
          </div>
        </form>
      </main>
    </>
  );
}
