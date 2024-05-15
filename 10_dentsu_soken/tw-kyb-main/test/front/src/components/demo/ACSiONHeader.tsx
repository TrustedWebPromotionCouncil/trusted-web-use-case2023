import React from 'react';
import ACSiON from './Icon/ACSiON';
import { IoReorderThreeSharp } from 'react-icons/io5';

export default function ACSiONHeader() {
  return (
    <header>
      <div className="h-[39px] w-screen bg-demo-green"></div>
      <div className="h-[50px] w-screen px-2 flex justify-between bg-demo-darkGray">
        <ACSiON size={50} />
        <IoReorderThreeSharp size={50} stroke={'white'} />
      </div>
    </header>
  );
}
