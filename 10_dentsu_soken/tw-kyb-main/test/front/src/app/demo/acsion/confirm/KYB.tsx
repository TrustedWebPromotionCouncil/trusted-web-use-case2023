'use client';

import Button from '@/components/demo/Button';
import PageTitle from '@/components/demo/PageTitle';
import { useRouter } from 'next/navigation';
import ACSiONHeader from '@/components/demo/ACSiONHeader';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';
import { useAtomValue } from 'jotai';
import { kybState } from '@/states/kybState';
import { useApplication } from '@/hooks/useApplication';
import prefecture from '@/consts/prefecture';

export default function KYB() {
  const { addApplication } = useApplication();
  const state = useAtomValue(kybState);
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
        <div className="flex flex-col pt-11 pb-4 w-fit mx-auto">
          <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
            <span className="block text-sm text-demo-current-page font-medium">
              法人名
            </span>
            <span>{`${state.corpName}`}</span>
          </label>
          <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
            <span className="block text-sm text-demo-current-page font-medium">
              法人番号
            </span>
            <span>{`${state.corpNumber}`}</span>
          </label>
          <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
            <span className="block text-sm text-demo-current-page font-medium">
              入社年月日
            </span>
            <span>{`${new Date(state.establishDate).getFullYear()}年${new Date(
              state.establishDate
            ).getMonth()}月${new Date(state.establishDate).getDate()}日`}</span>
          </label>

          <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
            <span className="block text-sm text-demo-current-page font-medium">
              代表者名
            </span>
            <span>{`${state.president}`}</span>
          </label>
          <label htmlFor="name" className="w-[320px] px-4 py-4 border-b">
            <span className="block text-sm text-demo-current-page font-medium">
              所在地
            </span>
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
