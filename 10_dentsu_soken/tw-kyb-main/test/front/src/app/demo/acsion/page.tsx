'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import PageTitle from '@/components/demo/PageTitle';
import { useRouter } from 'next/navigation';
import ACSiONHeader from '@/components/demo/ACSiONHeader';
import SelectBox from '@/components/demo/SelectBox';
import KYC from './KYC';
import COE from './COE';
import KYB from './KYB';

export type Application = {
  type: string;
};

const types = [
  {
    label: '【新規】本人確認(KYC)申請',
    value: '1',
  },
  {
    label: '【新規】在籍証明申請',
    value: '2',
  },
  {
    label: '【新規】法人確認(KYB)申請',
    value: '3',
  },
  {
    label: '【再発行】本人確認(KYC)申請',
    value: '4',
  },
  {
    label: '【再発行】在籍証明申請',
    value: '5',
  },
  {
    label: '【再発行】法人確認(KYB)申請',
    value: '6',
  },
];

export default function Pagesess() {
  const { control, watch } = useForm<Application>({
    defaultValues: {
      type: '1',
    },
  });
  const getForm = () => {
    switch (watch('type')) {
      case '1':
        return <KYC />;
      case '2':
        return <COE />;
      case '3':
        return <KYB />;

      default:
        break;
    }
  };
  return (
    <>
      <ACSiONHeader />
      <main>
        <PageTitle title="デジタル証明申請" />
        <div className="w-fit mx-auto pt-11 pb-10">
          <h2 className="text-[28px] pb-6">
            申請の種類
            <span className="pl-[6px] text-xs text-demo-alert">必須</span>
          </h2>
          <SelectBox<Application>
            name="type"
            options={types}
            control={control}
          />
        </div>
        {getForm()}
      </main>
    </>
  );
}
