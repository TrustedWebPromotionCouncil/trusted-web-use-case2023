import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

export type GroupSelectProps<T extends FieldValues> = {
  id: string;
  label: string;
  createAt: number;
  checked?: boolean;
} & UseControllerProps<T>;

export default function GroupSelect<T extends FieldValues>({
  id,
  label,
  createAt,
  checked = false,
  ...props
}: GroupSelectProps<T>) {
  const date = new Date(createAt);
  return (
    <Controller
      {...props}
      render={({ field }) => {
        return (
          <div>
            <label className="w-[327px] h-[79px] p-4 flex gap-4 items-center border border-black rounded-lg">
              <input
                type="radio"
                id={id}
                {...field}
                value={id}
                className="w-6 h-6 scale-75 accent-blue-500"
                // checked={checked}
              />
              <div>
                <p>{label}</p>
                {/* TODO 文言 */}
                <p className="text-xs text-demo-gray">
                  {`${date.getFullYear()}年${
                    date.getMonth() + 1
                  }月${date.getDate()}日`}
                  登録
                </p>
              </div>
            </label>
          </div>
        );
      }}
    />
  );
}
