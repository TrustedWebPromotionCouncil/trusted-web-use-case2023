import { FC } from 'react'
import GreenRibbon from '@/components/atoms/Icons/GreenRibbon'
import VioletRibbon from '../Icons/VioletRibbon';
import OrangeRibbon from '../Icons/OrangeRibbon';
import Plug from '../Icons/Plug';
import { VcType, vcType } from '@/types/VcType';

export interface MiniCertificateProps {
  type?: VcType;
  authenticationLevel?: number;
  validFrom?: Date | string | null;
  issuer?: string;
  challenge?: string;
  uuid?: string | null;
  color?: string | null;
  isPrivateVc?: boolean;
  original?: any;
  size: number
}

const MiniCertificate: FC<MiniCertificateProps> = ({ type, authenticationLevel, validFrom, issuer, challenge, uuid, isPrivateVc, original, size }) => {
  const issuedOn = validFrom && validFrom.toString().substring(0, 10)
  return (
    <div className={`${type === vcType.BUSINESS_UNITS || type === vcType.CHALLENGE_VC ? 'bg-red-100' : 'bg-blue-200'} rounded-md drop-shadow-md`} style={{ width: size }}>
      <div className="certificate-information px-3 py-4 whitespace-nowrap overflow-hidden flex flex-col">
        <div className="flex justify-between">
          <div className="font-bold mb-1 text-left self-end">種類：{type}</div>
          <div className="flex items-end h-16">
            {authenticationLevel === 1 && <GreenRibbon size={64} />}
            {type === vcType.CHALLENGE_VC && <GreenRibbon size={64} />}
            {authenticationLevel === 2 && <VioletRibbon size={64} />}
            {authenticationLevel === 3 && <OrangeRibbon size={64} />}
            {type === vcType.PRODUCTS && <Plug size={64} />}
          </div>
        </div>
        {type === vcType.CHALLENGE_VC ?
          <>
            <div className="mb-1 text-left whitespace-nowrap text-overflow-ellipsis overflow-hidden">発行日：{issuedOn}</div>
            <div className="mb-1 text-left whitespace-nowrap text-overflow-ellipsis overflow-hidden">発行者：{issuer}</div>
            <div className="mb-1 text-left whitespace-normal text-overflow-ellipsis overflow-hidden pb-4">Challenge：{challenge}</div>
          </> : <>
            {/* <div className="mb-1 text-left whitespace-nowrap text-overflow-ellipsis overflow-hidden">発行日：{issuedOn}</div> */}
            <div className="mb-1 text-left whitespace-nowrap text-overflow-ellipsis overflow-hidden">事業所名：{isPrivateVc && original?.vc?.credentialSubject?.businessUnitInfo?.businessUnitName}</div>
            <div className="mb-1 text-left whitespace-nowrap text-overflow-ellipsis overflow-hidden">所在地国：{original?.vc?.credentialSubject?.businessUnitInfo?.country}</div>
            <div className="mb-1 text-left whitespace-nowrap text-overflow-ellipsis overflow-hidden">所在地：{isPrivateVc && original?.vc?.credentialSubject?.businessUnitInfo?.address}</div>
            {/* <div className="mb-1 text-left whitespace-nowrap text-overflow-ellipsis overflow-hidden">発行者：{isPrivateVc && issuerName}</div> */}
            <div className="mb-1 text-left whitespace-normal text-overflow-ellipsis overflow-hidden">UUID：{uuid}</div>
          </>}
      </div>
    </div>
  )
}

export default MiniCertificate