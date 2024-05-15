import React from 'react';
import { IconType } from 'react-icons';

export type CardProps = {
  children: React.ReactNode;
  label: string;
  Icon: IconType;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export default function Card({ children, label, Icon, ...props }: CardProps) {
  return (
    <div
      {...props}
      className="w-[328px] mx-auto p-4 bg-demo-card border border-demo-card rounded-xl"
    >
      <div className="flex items-center">
        <Icon size={25} />
        <h2 className="pl-2 text-xl font-bold">{label}</h2>
      </div>
      <div className="pt-6 pb-4 flex flex-col gap-6">{children}</div>
    </div>
  );
}
