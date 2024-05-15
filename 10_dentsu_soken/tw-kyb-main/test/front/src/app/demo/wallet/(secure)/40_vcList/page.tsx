'use client';

import Breadcrumb from '@/components/demo/Breadcrumb';
import PageTitle from '@/components/demo/PageTitle';
import VCCard from '@/components/demo/VCCard';
import { useApplication } from '@/hooks/useApplication';
import { useLocale } from '@/hooks/useLocale';

export type ListData = {
  applicationDate: number;
  name: string;
  status: boolean;
};

export default function Pagesess() {
  const { t } = useLocale();
  const { application } = useApplication();
  const issued = application.filter((v) => v.status);
  return (
    <>
      <Breadcrumb
        pages={[
          { title: t.COMPONENTS.BREADCRUMB.HOME, path: '/demo/wallet/01_home' },
          { title: t.COMPONENTS.BREADCRUMB.VC_LIST },
        ]}
      />
      <PageTitle title={t.PAGES.VC_LIST.TITLE} />
      <div className="flex flex-col gap-8 w-fit max-h-[450px] mx-auto mt-10 overflow-auto scrollbar">
        {issued.map((v, i) => {
          return (
            <>
              <VCCard
                color={v.issuer === 'ACSiON' ? 'green' : 'orange'}
                info={v.content}
                issuer={v.issuer}
                type={v.content.type}
              />
            </>
          );
        })}
      </div>
    </>
  );
}
