'use client';

import Button from '@/components/demo/Button';
import PageTitle from '@/components/demo/PageTitle';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { useQRCode } from 'next-qrcode';
import { useLocale } from '@/hooks/useLocale';
import { useState } from 'react';
import Image from "next/image"

export default function Pagesess() {
  const { Canvas } = useQRCode();
  const { t } = useLocale();
  const [toggle, setToggle] = useState(false);

  if (toggle) {
    return (
      <>
        <div className="w-screen h-screen absolute inset-0 bg-demo-modal bg-blend-screen opacity-70"></div>
        {/* <div className="fixed inset-0 w-screen"> */}

        <div className="fixed inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[272px] h-fit p-4 rounded-xl bg-white">
          <div className="w-full pt-4 pb-4">
            <p>
              法人口座開設申請のため、以下のデジタル証明を申請先に開示して良いですか？
            </p>
            <ul className="pl-5 text-xl font-bold list-disc">
              {/* <li>本人確認(KYC)</li> */}
              <li>法人確認(KYB)</li>
            </ul>
          </div>
          <Button
            label="OK"
            color="blue"
            size="xs"
            variant="fill"
            path="bank/bankRequest"
          />
          <button
            className="w-60 h-14 pt-6 text-demo-blue font-bold underline tracking-widest"
            onClick={() => setToggle(!toggle)}
          >
            キャンセル
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle title={t.PAGES.BANK.TITLE} />
      <div className="w-fit mx-auto">
        <Image alt="image" src={'/piggy-bank.svg'} />
      </div>
      <div className="w-fit mx-auto pt-16">
        <Button
          label={t.PAGES.BANK.BTN_PROGRESS}
          color="yellow"
          size="medium"
          variant="fill"
          onClick={() => setToggle(true)}
        />
      </div>
      <div className="flex justify-start w-fit mx-auto  pt-16">
        <IoMdInformationCircleOutline size={20} />
        <p className="w-[329px] text-sm leading-6 font-medium tracking-wide whitespace-pre-wrap">
          {t.PAGES.BANK.MGS_REQUIREMENT}
          <a className="text-demo-link">{t.PAGES.BANK.LINK_TO_DETAIL}</a>
        </p>
      </div>
      <div className="w-fit mx-auto pt-8">
        <Canvas text={'https://example.com'} options={{ scale: 3.3 }} />
      </div>
    </>
  );
}
