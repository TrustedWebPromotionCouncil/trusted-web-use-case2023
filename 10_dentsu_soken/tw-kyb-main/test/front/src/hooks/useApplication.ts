import { applicationState } from '@/states/applicationList';
import { COE, KYB, KYC, Bank } from '@/types';
import { randomString } from '@stablelib/random';
import { useAtom } from 'jotai';

export const useApplication = () => {
  const [application, setApplication] = useAtom(applicationState);

  const addApplication = (data: KYC | KYB | COE | Bank, issuer: string) => {
    setApplication((prev) => [
      ...prev,
      {
        id: randomString(10),
        status: false,
        content: data,
        issuer,
      },
    ]);
  };
  const getLastKYC = (): KYC | null => {
    const kycList = application.filter((v) => v.content.type === 'kyc');
    if (kycList.length <= 0) {
      return null;
    }
    if (kycList[kycList.length - 1].content.type === 'kyc') {
      return kycList[kycList.length - 1].content as KYC;
    }
    return null;
  };

  const getLastKYB = (): KYB | null => {
    const kycList = application.filter((v) => v.content.type === 'kyb');
    if (kycList.length <= 0) {
      return null;
    }
    if (kycList[kycList.length - 1].content.type === 'kyb') {
      return kycList[kycList.length - 1].content as KYB;
    }
    return null;
  };

  const issue = (id: string) => {
    setApplication((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          v.status = true;
        }
        return v;
      })
    );
  };

  return { addApplication, application, getLastKYC, issue, getLastKYB };
};
