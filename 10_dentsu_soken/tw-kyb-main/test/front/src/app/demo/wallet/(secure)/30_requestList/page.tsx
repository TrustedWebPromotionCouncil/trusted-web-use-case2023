'use client';

import Breadcrumb from '@/components/demo/Breadcrumb';
import PageTitle from '@/components/demo/PageTitle';
import { useApplication } from '@/hooks/useApplication';
import { useLocale } from '@/hooks/useLocale';
import Link from 'next/link';

export type ListData = {
  applicationDate: number;
  name: string;
  status: boolean;
};

const testDate: ListData[] = [
  {
    applicationDate: Date.now(),
    name: '法人確認\n(KYB)',
    status: false,
  },
  { applicationDate: Date.now(), name: '在籍証明', status: true },
  { applicationDate: Date.now(), name: '本人確認\n(KYB)', status: true },
];

const msg1 = '本人確認\n(KYC)申請';

export default function Pagesess() {
  const { t } = useLocale();
  const { application } = useApplication();
  return (
    <>
      <Breadcrumb
        pages={[
          { title: t.COMPONENTS.BREADCRUMB.HOME, path: '/demo/wallet/01_home' },
          { title: t.COMPONENTS.BREADCRUMB.REQUEST_LIST },
        ]}
      />
      <PageTitle title={t.PAGES.REQUEST_LIST.TITLE} />
      <table className="text-center mx-auto mt-[38px] w-screen max-w-2xl border-collapse">
        <thead className="text-demo-thin font-normal">
          <tr className="border-b">
            <th>{t.PAGES.REQUEST_LIST.APPLICATION_DATE}</th>
            <th>{t.PAGES.REQUEST_LIST.NAME}</th>
            <th>{t.PAGES.REQUEST_LIST.STATUS}</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="text-sm leading-6">
          {application.map((v, i) => (
            <tr className="border-b h-[69px]" key={i}>
              <td>
                <p>{new Date().toLocaleDateString()}</p>
              </td>
              <td className="text-base font-bold whitespace-pre-wrap">
                {v.content.type === 'kyc'
                  ? msg1
                  : v.content.type === 'coe'
                  ? '在籍証明申請'
                  : v.content.type === 'kyb'
                  ? '法人確認\n(KYB)申請'
                  : '口座開設申請'}
              </td>
              <td className={`${v.status ? '' : 'text-demo-alert'}`}>
                {v.status
                  ? t.PAGES.REQUEST_LIST.ISSUED
                  : t.PAGES.REQUEST_LIST.UNISSUED}
              </td>
              <td>
                <Link
                  href={`30_requestList/detail?id=${v.id}`}
                  className="block  text-demo-blue font-bold border border-demo-blue w-[67px] h-[30px] rounded-lg"
                >
                  {t.PAGES.REQUEST_LIST.BTN_DETAIL}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
