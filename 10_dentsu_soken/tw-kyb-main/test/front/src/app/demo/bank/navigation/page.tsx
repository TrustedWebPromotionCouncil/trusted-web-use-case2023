'use client';
import Button from '@/components/demo/Button';
import FlowNavigation from '@/components/demo/FlowNavigation';
import { useLocale } from '@/hooks/useLocale';
import Image from 'next/image';

export default function Pagesess() {
  const { t } = useLocale();

  return (
    <>
      <div className="relative h-[286px] w-screen overflow-hidden flex items-center px-12">
        <h2 className="absolute top-4 left-12 text-3xl font-bold tracking-wide">
          {t.PAGES.BANK_NAVIGATION.TITLE}
        </h2>
        <Image src="/piggy-bank.svg" alt="piggy-bank" className="w-full" />
      </div>
      <div className="flex py-3">
        {/* TODO このボタンはどこに遷移するんだ？ */}
        <Button
          label={t.PAGES.BANK_NAVIGATION.BTN_PROGRESS}
          color="yellow"
          variant="fill"
          size="large"
        />
      </div>
      <div className="w-fit mx-auto mb-4 px-4 overflow-auto bg-demo-light-gray">
        <div className="flex items-center pl-1 py-5">
          <h3 className="text-2xl lg:text-[32px] font-medium">
            {t.PAGES.BANK_NAVIGATION.OPEN_FLOW}
          </h3>
          <div className="w-44 h-7 ml-4 text-white font-bold text-center bg-demo-blue-gray rounded-lg">
            {t.PAGES.BANK_NAVIGATION.SAMPLE}
          </div>
        </div>
        <div className="flex flex-col items-center 2xl:flex-row gap-8">
          <FlowNavigation
            number="①"
            heading={t.PAGES.BANK_NAVIGATION.PROC1_HEAD}
            text={t.PAGES.BANK_NAVIGATION.PROC1_MSG}
            url="/demo/wallet/00_login"
            img="/procedure1.png"
          />
          <FlowNavigation
            number="②"
            heading={t.PAGES.BANK_NAVIGATION.PROC2_HEAD}
            text={t.PAGES.BANK_NAVIGATION.PROC2_MSG}
            url="https://tw24-test.web.app/demo/wallet/01_home"
            img="/procedure2.png"
          />
          <FlowNavigation
            number="③"
            heading={t.PAGES.BANK_NAVIGATION.PROC3_HEAD}
            text={t.PAGES.BANK_NAVIGATION.PROC3_MSG}
            url="https://tw24-test.web.app/demo/wallet/01_home"
            img="/procedure3.png"
          />
          <FlowNavigation
            number="④"
            heading={t.PAGES.BANK_NAVIGATION.PROC4_HEAD}
            text={t.PAGES.BANK_NAVIGATION.PROC4_MSG}
            url="https://tw24-test.web.app/demo/wallet/01_home"
            img="/procedure4.png"
          />
          <FlowNavigation
            number="⑤"
            heading={t.PAGES.BANK_NAVIGATION.PROC5_HEAD}
            text={t.PAGES.BANK_NAVIGATION.PROC5_MSG}
            url="https://tw24-test.web.app/demo/bank"
            img="/procedure5.png"
          />
        </div>
      </div>
    </>
  );
}
