import { useState } from 'react';

export type TabMenuParams = {
  displays: {
    button: string;
    children: React.ReactNode;
  }[];
};

type ButtonProps = {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  on: boolean;
};

const Button = ({ label, onClick, on }: ButtonProps) => {
  return (
    <button
      className={`px-4 py-[8.5px] border border-b-0 rounded-t-lg relative ${
        on
          ? "after:absolute after:content-[''] after:block after:w-full after:h-1 after:px-4 after:left-0 after:bottom-0 after:translate-y-1 after:bg-white"
          : 'bg-tab-off'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default function TabMenu({ displays }: TabMenuParams) {
  const [buttons, setButtons] = useState<boolean[]>(
    displays.map((_, i) => i === 0)
  );
  const [view, setView] = useState(displays[0].children);

  const change = (target: number) => {
    setButtons(buttons.map((_, i) => i === target));
    setView(displays[target].children);
  };

  return (
    <div className="pt-7">
      <div className="w-screen pl-4 flex gap-2">
        {displays.map((v, i) => {
          return (
            <Button
              label={v.button}
              key={i}
              on={buttons[i]}
              onClick={() => change(i)}
            />
          );
        })}
      </div>
      <hr />
      <div>{view}</div>
    </div>
  );
}
