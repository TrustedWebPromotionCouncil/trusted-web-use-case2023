import React from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

export type CheckBoxProps<T extends FieldValues> = {
  label: string;
} & UseControllerProps<T>;

export default function CheckBox<T extends FieldValues>({
  label,
  ...props
}: CheckBoxProps<T>) {
  return (
    <Controller
      {...props}
      render={({ field }) => {
        return (
          <label
            htmlFor={props.name}
            className="w-[327px] h-11 py-2 flex items-center gap-4 tracking"
          >
            <input type="checkbox" id={props.name} {...field} />
            <span>{label}</span>
          </label>
        );
      }}
    />
  );
}
