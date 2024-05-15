'use client';

import { useSearchParams } from 'next/navigation';
import KYC from './KYC';
import COE from './COE';
import KYB from './KYB';

export type Application = {
  settlement: boolean;
  saving: boolean;
  finance: boolean;
  trade: boolean;
  others: boolean;
};

export default function Pagesess() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const getContent = () => {
    switch (type) {
      case 'kyc':
        return <KYC />;
      case 'coe':
        return <COE />;
      case 'kyb':
        return <KYB />;

      default:
        break;
    }
  };

  return <>{getContent()}</>;
}
