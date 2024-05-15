import { useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import { PiGlobe } from 'react-icons/pi';
import { IoMenuOutline } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';

export default function BankNavigationHeader() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-50 h-[50px] lg:h-[100px] w-screen pl-[47px] pr-[29px] flex items-center justify-between bg-demo-nav-yellow">
        {/* TODO 文言 */}
        <h1 className="lg:text-4xl font-bold text-white">
          {t.COMPONENTS.BANK_NAVIGATION_HEADER.TITLE}
        </h1>
        <IoMenuOutline
          size={24}
          className="lg:hidden"
          onClick={() => {
            setOpen(!open);
          }}
        />
        <nav className="hidden lg:flex lg:h-10 lg:items-end lg:gap-6 [&>a]:underline">
          <a href="#">{t.COMPONENTS.BANK_NAVIGATION_HEADER.LINK_SITE_POLICY}</a>
          <a href="#">
            {t.COMPONENTS.BANK_NAVIGATION_HEADER.LINK_PRIVACY_POLICY}
          </a>
          <a href="#">
            {t.COMPONENTS.BANK_NAVIGATION_HEADER.LINK_COPYRIGHT_POLICY}
          </a>
          <a href="#">
            {t.COMPONENTS.BANK_NAVIGATION_HEADER.LINK_WEB_ACCESIBILITY}
          </a>
          <a href="#">{t.COMPONENTS.BANK_NAVIGATION_HEADER.LINK_SNS}</a>
          {/* TODO プルダウン作る */}
          <span className="felx cursor-pointer">
            <PiGlobe className="inline-block" />
            {t.COMPONENTS.BANK_NAVIGATION_HEADER.LANGUAGE}
            <IoIosArrowDown className="inline-block" />
          </span>
        </nav>
      </header>
      <nav
        className={`${
          open ? 'flex' : 'invisible'
        } fixed top-0 z-50 lg:hidden mt-[50px] flex-col items-center justify-center bg-demo-nav-yellow underline [&>a]:h-10 [&>a]:w-screen [&>a]:flex [&>a]:items-center [&>a]:justify-center [&>a]:border-t [&>a]:border-demo-yellow`}
      >
        <a href="#">{t.COMPONENTS.BANK_NAVIGATION_HEADER.LINK_SITE_POLICY}</a>
        <a href="#">
          {t.COMPONENTS.BANK_NAVIGATION_HEADER.LINK_PRIVACY_POLICY}
        </a>
        <a href="#">
          {t.COMPONENTS.BANK_NAVIGATION_HEADER.LINK_COPYRIGHT_POLICY}
        </a>
        <a href="#">
          {t.COMPONENTS.BANK_NAVIGATION_HEADER.LINK_WEB_ACCESIBILITY}
        </a>
        <a href="#">{t.COMPONENTS.BANK_NAVIGATION_HEADER.LINK_SNS}</a>
        {/* TODO プルダウン作る */}
        <a href="#" className="felx">
          <PiGlobe className="inline-block" />
          {t.COMPONENTS.BANK_NAVIGATION_HEADER.LANGUAGE}
        </a>
      </nav>
    </>
  );
}
