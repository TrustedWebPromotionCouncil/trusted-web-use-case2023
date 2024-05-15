import React from 'react';
import Link from 'next/link';

export type ButtonProps = {
  label: string;
  variant?: 'fill' | 'outline';
  color?: 'blue' | 'green' | 'yellow' | 'gray';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  path?: string;
  size?: 'xs' | 'small' | 'medium' | 'large';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Button({
  label,
  variant = 'outline',
  color = 'blue',
  disabled,
  type = 'button',
  path,
  size = 'small',
  onClick,
}: ButtonProps) {
  const getFillColor = () => {
    switch (color) {
      case 'gray':
        return 'bg-demo-gray';
      case 'green':
        return 'bg-demo-green';
      case 'yellow':
        return 'bg-demo-yellow';
      case 'blue':
        return 'bg-demo-blue';
      default:
        return 'bg-demo-blue';
    }
  };

  const getOutlineColor = () => {
    switch (color) {
      case 'gray':
        return 'border-demo-gray text-demo-gray hover:bg-demo-gray';
      case 'green':
        return 'border-demo-green text-demo-green hover:bg-demo-green';
      case 'yellow':
        return 'border-demo-yellow text-demo-yellow hover:bg-demo-yellow';
      case 'blue':
        return 'border-demo-blue text-demo-blue hover:bg-demo-blue';
      default:
        return 'border-demo-blue text-demo-blue hover:bg-demo-blue';
    }
  };

  const getWidth = () => {
    switch (size) {
      case 'xs':
        return 'w-[240px]';
      case 'small':
        return 'w-64';
      case 'medium':
        return 'w-[327px]';
      case 'large':
        return 'w-[496px]';
    }
  };

  const buttonColor =
    variant === 'fill'
      ? `${getFillColor()} text-white hover:opacity-70 active:opacity-50`
      : `border ${getOutlineColor()} bg-white hover:text-white active:opacity-70`;

  const buttonWidth = getWidth();

  const Base = () => (
    <button
      disabled={disabled}
      type={type}
      className={`${buttonWidth} h-14 mx-auto rounded-lg text-center font-bold tracking-widest ${
        disabled ? 'bg-demo-gray text-white opacity-40' : buttonColor
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
  if (type === 'button' && !!path) {
    return (
      <Link href={path} className="w-fit h-fit">
        <Base />
      </Link>
    );
  }
  return <Base />;
}
