import { useState, useEffect } from 'react';
import Battery from './Icon/Battery';
import Cellular from './Icon/Cellular';
import Wifi from './Icon/Wifi';

const getTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}`;
};

export default function LoginHeader() {
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(() => getTime());
    }, 1000);
    return () => {
      clearInterval(intervalID);
    };
  });

  return (
    <header className="fixed w-screen py-3 pl-7 pr-4 flex justify-between items-center">
      <span className="font-bold">{time}</span>
      <div className="flex gap-1">
        <Cellular />
        <Wifi />
        <Battery />
      </div>
    </header>
  );
}
