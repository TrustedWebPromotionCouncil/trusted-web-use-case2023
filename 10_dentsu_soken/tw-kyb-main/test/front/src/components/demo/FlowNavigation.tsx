import { useLocale } from '@/hooks/useLocale';
import { useQRCode } from 'next-qrcode';
import Image from 'next/image';

export type FlowNavigationProps = {
  number: string;
  heading: string;
  text: string;
  url: string;
  img: string;
};

export default function FlowNavigation({
  number,
  heading,
  text,
  url,
  img,
}: FlowNavigationProps) {
  const { t } = useLocale();
  const { Canvas } = useQRCode();
  return (
    <div>
      <div className="flex gap-3">
        <div className="w-[60px] h-[60px] text-6xl font-bold text-demo-gray">
          {number}
        </div>
        <div className="tracking-widest">
          <h3 className="text-xl font-bold">{heading}</h3>
          <p className="whitespace-pre-wrap">{text}</p>
        </div>
      </div>
      <div className="flex items-center pt-2">
        <div className="pt-10">
          <Canvas text={url} options={{ width: 92 }} />
          <a
            href={url}
            className="text-demo-yellow whitespace-pre-wrap text-center [&>span]:block underline font-bold"
          >
            <span>{t.COMPONENTS.FLOW_NAVIGATION.LINK_MSG1}</span>
            <span>{t.COMPONENTS.FLOW_NAVIGATION.LINK_MSG2}</span>
          </a>
        </div>
        <div className="h-20 w-8 mx-3 bg-gray-300 triangle"></div>
        <div className="flex items-center h-64 w-32">
          <Image src={img} alt={img} />
        </div>
      </div>
    </div>
  );
}
