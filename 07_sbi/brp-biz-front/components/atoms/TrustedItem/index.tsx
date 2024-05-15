import { FC } from 'react'
import NationalFlag from '../NationalFlag';
import Globe from '../Icons/Globe';
import { TrustedItem } from '@/types';

export interface TrustedItemProps {
  country?: string
  trustedItem?: TrustedItem
  empty?: boolean
}

const TrustedItemView: FC<TrustedItemProps> = ({ trustedItem, empty }) => {
  return (
    <div className="border rounded-md drop-shadow-md py-4 px-2" style={{ height: '150px', width: '350px' }}>
      {!empty && <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="mb-1">
            <div className="font-bold text-left">{trustedItem?.country}</div>
            <div className="text-left">取得日：{trustedItem?.obtainedDate?.toString().slice(0, 10)}</div>
          </div>
          <div className="flex justify-center self-center w-36">
            {trustedItem?.country === '日本' ? <NationalFlag country="jp" /> : <Globe />}
          </div>
        </div>
        <div className="whitespace-pre-line break-all">
          <div className="mb-2 text-left whitespace-nowrap text-overflow-ellipsis overflow-hidden">公的機関の識別子：{trustedItem?.publicMultibaseIdentifier}</div>
          <div className="mb-2 text-left whitespace-nowrap text-overflow-ellipsis overflow-hidden">公的機関の公開鍵：{trustedItem?.publicMultibaseKey}</div>
        </div>
      </div>}
    </div>
  )
}

export default TrustedItemView