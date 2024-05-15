import React from 'react';

export default function BankHeader() {
  return (
    <header className="fixed top-0 z-50  h-[50px] w-screen pr-5 flex items-center justify-end bg-demo-yellow">
      {/* TODO 文言 */}
      <span className="font-bold text-white">トラスト銀行</span>
    </header>
  );
}
