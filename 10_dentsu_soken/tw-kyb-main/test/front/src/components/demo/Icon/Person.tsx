import { useState } from 'react';
import { GenIcon, IconBaseProps } from 'react-icons';
import { FaRegCircleCheck } from 'react-icons/fa6';
import Copy from './Copy';

const Icon = GenIcon({
  tag: 'svg',
  attr: {
    width: '45',
    height: '45',
    viewBox: '0 0 45 45',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  },
  child: [
    {
      tag: 'path',
      attr: {
        d: 'M22.5 4.21875C12.4198 4.21875 4.21875 12.4198 4.21875 22.5C4.21875 32.5802 12.4198 40.7812 22.5 40.7812C32.5802 40.7812 40.7812 32.5802 40.7812 22.5C40.7812 12.4198 32.5802 4.21875 22.5 4.21875ZM18.0861 14.4861C19.1997 13.3058 20.7668 12.6562 22.5 12.6562C24.2332 12.6562 25.7862 13.3102 26.9042 14.4967C28.0371 15.699 28.5882 17.3145 28.4581 19.0512C28.198 22.5 25.5261 25.3125 22.5 25.3125C19.4739 25.3125 16.7968 22.5 16.5419 19.0503C16.4127 17.2995 16.9629 15.6788 18.0861 14.4861ZM22.5 37.9688C20.435 37.9701 18.3907 37.5568 16.4884 36.7533C14.5861 35.9498 12.8646 34.7725 11.4258 33.2912C12.2498 32.1161 13.2997 31.1169 14.5143 30.3521C16.7546 28.916 19.5899 28.125 22.5 28.125C25.4101 28.125 28.2454 28.916 30.4831 30.3521C31.6986 31.1166 32.7495 32.1158 33.5742 33.2912C32.1356 34.7727 30.414 35.9501 28.5117 36.7536C26.6094 37.5571 24.5651 37.9703 22.5 37.9688Z',
        fill: '#856DB8',
      },
      child: [],
    },
  ],
});

export type PersonProps = {
  name: string;
  id: string;
  type?: 'button' | 'icon';
} & IconBaseProps;

export default function Person({
  name,
  id,
  type = 'button',
  ...props
}: PersonProps) {
  const [toggle, setToggle] = useState(false);
  const [msg, setMsg] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | undefined>();

  const copyToClipboard = async () => {
    // TODO try~catchにしてエラーになった場合も実装
    await global.navigator.clipboard.writeText(id);
    //TODO Dialogを作る
    console.log('timeoutId :>> ', timeoutId);
    !!timeoutId && setMsg(false);
    !!timeoutId && clearTimeout(timeoutId);
    setMsg(true);
    setTimeoutId(
      window.setTimeout(() => {
        setMsg(false);
      }, 3000)
    );
  };

  if (type === 'icon') {
    return <Icon {...props} />;
  }

  if (toggle) {
    return (
      <>
        <Icon {...props} />
        <div className="w-screen h-screen absolute inset-0 bg-demo-modal bg-blend-screen opacity-70"></div>
        <div className="fixed inset-0 w-screen">
          <div
            className={`absolute inset-x-0 inset-y-full -translate-y-60 w-60 h-6 px-4 py-6 flex gap-4 items-center justify-start bg-white rounded ${
              msg
                ? ' transition duration-500 ease-in-out'
                : '-translate-x-full transition duration-500 ease-in-out'
            }`}
          >
            <FaRegCircleCheck className="fill-demo-success" />
            <span className="text-demo-success font-bold tracking-wide">
              コピーしました。
            </span>
          </div>
        </div>
        <div className="fixed inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[272px] h-[218px] p-4 rounded-xl bg-white">
          <div className="text-2xl font-medium flex justify-between items-center">
            <span>{name}</span>
            <Icon size={44} />
          </div>
          <div className="w-full pt-4">
            {/* TODO　文言 */}
            <p>アカウントID</p>
            <div className="flex items-center">
              <span className="inline-block max-w-[90%] truncate">{id}</span>
              <Copy
                className="inline-block hover:opacity-70 active:opacity-90"
                size={18}
                onClick={copyToClipboard}
              />
            </div>
          </div>
          <button
            className="w-60 h-14 pt-6 text-demo-blue font-bold underline tracking-widest"
            onClick={() => setToggle(!toggle)}
          >
            閉じる
          </button>
        </div>
      </>
    );
  }
  return <Icon {...props} onClick={() => setToggle(!toggle)} />;
}
