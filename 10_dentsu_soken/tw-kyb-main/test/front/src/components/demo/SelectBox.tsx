import React from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import Arrow from './Icon/Arrow';

export type SelectBoxProps<T extends FieldValues> = {
  options: {
    label: string;
    value: string;
  }[];
  size?: 'small' | 'large';
} & UseControllerProps<T>;

export default function SelectBox<T extends FieldValues>({
  options,
  size = 'small',
  ...props
}: SelectBoxProps<T>) {
  const selectWidth = size === 'small' ? 'w-[327px]' : 'w-[327px]';

  return (
    <Controller
      {...props}
      render={({ field }) => {
        return (
          <div className="relative w-fit h-fit">
            <select
              {...field}
              className={`${selectWidth} bg-white h-16 px-4 py-3 border border-black rounded-lg appearance-none`}
            >
              {options.map((v, i) => {
                return (
                  <option value={v.value} key={i}>
                    {v.label}
                  </option>
                );
              })}
            </select>
            <Arrow className="absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
        );
      }}
    />
  );
}
