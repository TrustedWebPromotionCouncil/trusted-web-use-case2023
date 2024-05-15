import { useState } from 'react';
import VC from './Icon/VC';
import { useLocale } from '@/hooks/useLocale';
import { KYC, COE, KYB, Bank } from '@/types';

export type VCCardParams = {
  color: 'green' | 'orange';
  type: 'kyb' | 'kyc' | 'bank' | 'coe';
  issuer: string;
  info: KYC | KYB | Bank | COE | Bank;
};

const KYCInfo = (info: KYC) => {
  return (
    <>
      <p>
        {info.lastName} {info.firstName}
      </p>
      <p>
        {info.prefectuer}
        {info.city}
        {info.address}
        {info.building}
      </p>
      <p>
        <span>{new Date(info.birthday).toLocaleDateString()}</span>
        <span>　　男</span>
      </p>
    </>
  );
};

const COEInfo = (info: COE) => {
  return (
    <>
      <p>{info.corpName}</p>
      <p>
        {info.lastName} {info.firstName}
      </p>

      <p>{new Date(info.hireDate).toLocaleDateString()}入社</p>
    </>
  );
};

export default function VCCard({ color, type, issuer, info }: VCCardParams) {
  const { t } = useLocale();
  const [toggle, setToggle] = useState(true);
  const [reverse, setReverse] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | undefined>();

  const onClick = () => {
    timeoutId && clearTimeout(timeoutId);
    setReverse(true);
    setToggle(!toggle);
    setTimeoutId(window.setTimeout(() => setReverse(false), 400));
  };

  const getContent = () => {
    switch (type) {
      case 'bank':
        return <></>;
      case 'kyb':
        return <></>;
      case 'kyc':
        return <KYCInfo {...(info as KYC)} />;
      case 'coe':
        return <COEInfo {...(info as COE)} />;
    }
  };

  const iconColor = color === 'green' ? 'fill-vc-green' : 'fill-vc-orange';
  const textColor = color === 'green' ? 'text-vc-green' : 'text-vc-orange';
  const getText = () => {
    switch (type) {
      case 'bank':
        return t.COMPONENTS.VC_CARD.BANK;
      case 'kyb':
        return t.COMPONENTS.VC_CARD.KYB;
      case 'kyc':
        return t.COMPONENTS.VC_CARD.KYC;
      case 'coe':
        return '在籍証明';
      case 'bank':
        return '口座開設証明';
      default:
        return t.COMPONENTS.VC_CARD.INVALID;
    }
  };

  const Front = (
    <div>
      <div className="flex justify-between">
        <VC size={30} className={`${iconColor}`} />
        <span className="text-[11px] text-white tracking-wide">
          {t.COMPONENTS.VC_CARD.HEADING}
        </span>
      </div>
      <div className="h-[80px] pt-[30px] pl-5 text-vc font-bold">
        <span>{getText()}</span>
        {/* {type} */}
      </div>
      <span className={`text-[11px] font-bold ${textColor}`}>{issuer}</span>
    </div>
  );

  const Back = (
    <>
      <div className="flex justify-between card-reverse">
        <span className="text-vc font-bold">{getText()}</span>
        <VC size={30} className={`${iconColor}`} />
      </div>
      <div className="h-[80px] pt-3 pl-5 text-xs text-vc card-reverse">
        {getContent()}
      </div>
    </>
  );
  // TODO KYBは項目が多すぎて表示しきれないのでhoverしたときにh-fitにして伸びるのはどうだろうか
  return (
    <div
      className={`w-80 h-[149px] px-[10px] py-[8px] rounded-[10px] shadow border-2 border-vc vc-${color}
       duration-700 ${toggle ? '' : 'card-reverse'} ${
        reverse ? '[&>div]:invisible' : ''
      }`}
      onClick={onClick}
    >
      {toggle ? Front : Back}
    </div>
  );
}
