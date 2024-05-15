'use client';

import Breadcrumb from '@/components/demo/Breadcrumb';
import Button from '@/components/demo/Button';
import PageTitle from '@/components/demo/PageTitle';
import { useApplication } from '@/hooks/useApplication';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export type ListData = {
  applicationDate: number;
  name: string;
  status: boolean;
};

export default function Pagesess() {
  const [toggle, setToggle] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { application, issue } = useApplication();
  const target = application.find((v) => v.id === id);

  if (toggle) {
    return (
      <>
        <div className="w-screen h-screen absolute inset-0 bg-demo-modal bg-blend-screen opacity-70"></div>
        <div className="fixed inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[272px] h-[238px] p-4 rounded-xl bg-white">
          <div className="w-full pt-4 pb-4">
            <p className="text-2xl">
              {target?.content.type === 'kyc'
                ? '本人確認(KYC)'
                : target?.content.type === 'coe'
                ? '在籍'
                : target?.content.type === 'kyb'
                ? '法人確認(KYB)'
                : '口座開設'}
              証明を発行しますか？
            </p>
          </div>
          <Button
            label="発行する"
            color="blue"
            size="xs"
            variant="fill"
            onClick={() => {
              issue(target ? target.id : '');
              setToggle(!toggle);
            }}
          />
          <button
            className="w-60 h-14 pt-6 text-demo-blue font-bold underline tracking-widest"
            onClick={() => setToggle(!toggle)}
          >
            閉じる
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        pages={[
          { title: 'ホーム', path: '/demo/wallet/01_home' },
          { title: 'デジタル証明申請一覧' },
        ]}
      />
      <PageTitle title="申請内容照会" />
      <div className="w-fit mx-auto pt-[31px]">
        <h2 className="text-[28px]">
          {target?.content.type === 'kyc'
            ? '本人確認\n(KYC)'
            : target?.content.type === 'coe'
            ? '在籍証明'
            : target?.content.type === 'kyb'
            ? '法人確認(KYB)'
            : '口座開設'}
          <span
            className={`pl-3 text-base ${
              target?.status ? 'text-demo-thin' : 'text-demo-alert'
            }`}
          >
            {target?.status ? '発行済' : '未発行'}
          </span>
        </h2>
        <div className="flex gap-[66px] pt-[31px]">
          <div>
            <p>
              <span className="font-bold pr-1">申請日</span>
              <span>{new Date().toLocaleDateString()}</span>
            </p>
            <p>
              <span className="font-bold pr-1">発行日</span>
              <span>
                {target?.status ? new Date().toLocaleDateString() : '-'}
              </span>
            </p>
          </div>
          <div>
            <p>
              <span className="font-bold pr-1">再発行ID</span>
              <span>{target?.id}</span>
            </p>
          </div>
        </div>
        <div className="pt-9">
          <p>
            <span className="font-bold pr-1">申請内容</span>
            <span>xxxx</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 w-fit mx-auto pt-[170px]">
          <Button
            label={`${target?.status ? '発行済' : '発行する'}`}
            color={`${target?.status ? 'gray' : 'blue'}`}
            size="medium"
            variant="fill"
            onClick={() => setToggle(true)}
          />
          <Button
            label="ホームへ戻る"
            color="blue"
            size="medium"
            variant="outline"
            path="/demo/wallet/01_home"
          />
        </div>
      </div>
    </>
  );
}
