import React, { useState } from 'react';
import Home from './Icon/Home';
import Change from './Icon/Change';
import Notification from './Icon/Notification';
import { IoReorderThreeSharp } from 'react-icons/io5';
import FootNavigationButton from './FootNavigationButton';
import { useAccount } from '@/hooks/useAccount';
import Person from './Icon/Person';
import Group from './Icon/Group';

export default function FootNavigation() {
  const [toggle, setToggle] = useState(false);
  const { accountList, changeAccount, currentAccount } = useAccount();
  return (
    <>
      {toggle ? (
        <>
          <div className="w-screen h-screen absolute inset-0 bg-demo-modal bg-blend-screen opacity-70"></div>
          <div className="fixed inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[272px] h-fit p-4 rounded-xl bg-white">
            <div className="w-full flex justify-between items-center">
              <span className="text-2xl font-medium">
                {currentAccount?.name}
              </span>
              <div className="flex items-center">
                {currentAccount?.isGroup ? (
                  <Group size={54} />
                ) : (
                  <Person size={54} id="" name="" type="icon" />
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="13"
                  viewBox="0 0 17 13"
                  fill="none"
                >
                  <path
                    d="M5.7 12.025L0 6.325L1.425 4.9L5.7 9.175L14.875 0L16.3 1.425L5.7 12.025Z"
                    fill="#818080"
                  />
                </svg>
              </div>
            </div>
            {accountList.map((v) => {
              if (v.current) {
                return <></>;
              }
              return (
                <div
                  className="h-[54px] w-full pr-6 flex justify-between items-center border-y hover:cursor-pointer"
                  onClick={() => changeAccount(v.id)}
                  key={v.id}
                >
                  <span>{v.name}</span>
                  {v.isGroup ? (
                    <Group size={36} />
                  ) : (
                    <Person size={36} id="" name="" type="icon" />
                  )}
                </div>
              );
            })}
            <button
              className="w-60 h-14 pt-6 text-demo-blue font-bold underline tracking-widest"
              onClick={() => setToggle(!toggle)}
            >
              閉じる
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
      <footer className="fixed bottom-0 w-screen h-[82px] flex items-center border-t z-50 bg-white">
        {/* TODO 文言 */}
        <FootNavigationButton
          Icon={Home}
          label="ホーム"
          path="/demo/wallet/01_home"
        />
        <FootNavigationButton
          Icon={Change}
          label="アカウント切替"
          path="#"
          type="button"
          onClick={() => setToggle(true)}
        />
        <FootNavigationButton Icon={Notification} label="お知らせ" path="#" />
      </footer>
    </>
  );
}
