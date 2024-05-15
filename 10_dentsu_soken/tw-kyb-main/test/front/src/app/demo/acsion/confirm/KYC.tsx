'use client';

import Button from '@/components/demo/Button';
import PageTitle from '@/components/demo/PageTitle';
import { useRouter } from 'next/navigation';
import ACSiONHeader from '@/components/demo/ACSiONHeader';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import { useAtomValue } from 'jotai';
import { kycState } from '@/states/kycState';
import { useApplication } from '@/hooks/useApplication';
import prefecture from '@/consts/prefecture';

export default function KYC() {
  const { addApplication } = useApplication();
  const state = useAtomValue(kycState);
  const { t } = useLocale();
  return (
    <>
      <ACSiONHeader />
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
        <div className="flex flex-col pt-11 w-fit mx-auto">
          <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
            <span className="block text-sm font-medium">氏名</span>
            <span>{`${state.lastName} ${state.firstName}`}</span>
          </label>
          <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
            <span className="block text-sm font-medium">氏名（カナ）</span>
            <span>{`${state.lastName_kana} ${state.firstName_kana}`}</span>
          </label>
          <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
            <span className="block text-sm font-medium">生年月日</span>
            <span>{`${new Date(state.birthday).getFullYear()}年${new Date(
              state.birthday
            ).getMonth()}月${new Date(state.birthday).getDate()}日`}</span>
          </label>
          <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
            <span className="block text-sm font-medium">性別</span>
            <span>
              {state.gender === 'female'
                ? '女性'
                : state.gender === 'male'
                ? '男性'
                : 'その他・無回答'}
            </span>
          </label>
          <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
            <span className="block text-sm font-medium">住所</span>
            <span className="bg-white whitespace-pre-wrap">{`${
              prefecture.find((v) => v.code === Number(state.prefectuer))?.name
            }${state.city}${state.address}${state.building}`}</span>
          </label>
        </div>
        <div className="flex flex-col gap-2 w-fit mx-auto pt-[60px] pb-5">
          <Button
            label={t.PAGES.BANK_CONFIRM.BTN_APPLICATION}
            color="green"
            size="medium"
            variant="fill"
            path="/demo/acsion/done"
            onClick={() => addApplication(state, 'ACSiON')}
          />
        </div>
      </main>
    </>
  );
}
