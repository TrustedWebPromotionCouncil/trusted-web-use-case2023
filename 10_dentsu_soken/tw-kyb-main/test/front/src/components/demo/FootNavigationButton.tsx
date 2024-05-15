import React from 'react';
import { IconType } from 'react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type FootNavigationButtonParams = {
  label: string;
  Icon: IconType;
  path: string;
  type?: 'link' | 'button';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function FootNavigationButton({
  Icon,
  label,
  path,
  type = 'link',
  onClick,
}: FootNavigationButtonParams) {
  const pathname = usePathname();

  if (type === 'button') {
    return (
      <button
        onClick={onClick}
        className="w-1/3 h-full flex flex-col justify-center items-center"
      >
        <div
          className={`w-14 h-8 flex items-center justify-center rounded-[18px] ${
            path === pathname ? 'bg-demo-blur-blue' : ''
          }`}
        >
          <Icon
            size={24}
            className={`${
              path === pathname ? 'fill-demo-blue' : 'fill-black'
            } `}
          />
        </div>
        <span
          className={`text-xs font-bold ${
            path === pathname ? 'text-demo-blue' : ''
          }`}
        >
          {label}
        </span>
      </button>
    );
  }

  return (
    <Link
      href={path}
      className="w-1/3 h-full flex flex-col justify-center items-center"
    >
      <div
        className={`w-14 h-8 flex items-center justify-center rounded-[18px] ${
          path === pathname ? 'bg-demo-blur-blue' : ''
        }`}
      >
        <Icon
          size={24}
          className={`${path === pathname ? 'fill-demo-blue' : 'fill-black'} `}
        />
      </div>
      <span
        className={`text-xs font-bold ${
          path === pathname ? 'text-demo-blue' : ''
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
