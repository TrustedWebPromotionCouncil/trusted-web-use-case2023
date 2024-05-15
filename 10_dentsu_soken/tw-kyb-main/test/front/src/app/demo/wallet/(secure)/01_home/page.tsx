'use client';

import Breadcrumb from '@/components/demo/Breadcrumb';
import Button from '@/components/demo/Button';
import PageTitle from '@/components/demo/PageTitle';
import { useLocale } from '@/hooks/useLocale';

export default function Pagesess() {
  const { t } = useLocale();
  return (
    <>
      <Breadcrumb pages={[]} />
      <PageTitle title={t.PAGES['HOME'].TITLE} />
      <div className="flex flex-col gap-6 w-fit mx-auto pt-[70px]">
        <Button
          label={t.PAGES['HOME'].MENU_ADD_ACCOUNT}
          color="blue"
          size="small"
          variant="outline"
          path="10_createAccount"
        />
        <Button
          label={t.PAGES['HOME'].MENU_VC_APPLICATION}
          color="blue"
          size="small"
          variant="outline"
          path="20_requestVC"
        />
        <Button
          label={t.PAGES['HOME'].MENU_APPLICATION_LIST}
          color="blue"
          size="small"
          variant="outline"
          path="30_requestList"
        />
        <Button
          label={t.PAGES['HOME'].MENU_VC_LIST}
          color="blue"
          size="small"
          variant="outline"
          path="40_vcList"
        />
      </div>
    </>
  );
}
