// import { useLocale } from '@/hooks/demo/useLocale';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

export type TextInputProps<T extends FieldValues> = {
  label: string;
  size?: 'small' | 'medium';
  placeholder?: string;
} & UseControllerProps<T>;

// TODO 文言

export default function TextInput<T extends FieldValues>({
  label,
  size = 'medium',
  placeholder,
  ...props
}: TextInputProps<T>) {
  //   const { t } = useLocale();
  return (
    <Controller
      {...props}
      render={({ field }) => {
        return (
          <div className="flex flex-col">
            <label htmlFor={field.name} className="pl-2 pb-2">
              {label}
              {props.rules?.required === true ? (
                <span className="pl-2 text-xs text-demo-alert">
                  {/* {t.TEXT_INPUT.REQUIRED} */}
                  必須
                </span>
              ) : null}
            </label>
            <input
              type="text"
              placeholder={placeholder}
              {...field}
              id={field.name}
              className={`
            ${
              size === 'small' ? 'w-[162px]' : 'w-[295px]'
            } h-14 px-4 border border-black rounded-lg`}
            />
          </div>
        );
      }}
    />
  );
}
