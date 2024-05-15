import Button from '@/components/atoms/Button';
import MiniCertificate from '@/components/atoms/MiniCertificate'
import Overlay from '@/components/atoms/Overlay';
import VerifiableCredential from '@/components/molecules/VerifiableCredential';
import { FC, useState } from 'react'
import { VcForBusinessUnit } from '@/types'
import { vcType } from '@/types/VcType';

interface CredentialListProps {
  vcForBusinessUnit: VcForBusinessUnit
}

const CredentialList: FC<CredentialListProps> = ({ vcForBusinessUnit }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toOpenDetails = () => {
    setShowDetails(true)
  }

  const onCloseDetails = () => {
    setShowDetails(false)
  }

  return (
    <div>
      <div className="m-3 ">
        <div>
          <MiniCertificate
            size={320}
            {...vcForBusinessUnit}
            type={vcType.BUSINESS_UNITS}
          />
        </div>
        <div className="opacity-0 absolute -mt-[235px] hover:opacity-100 h-[235px] w-[320px] border-2 flex items-center justify-center border-solid bg-gray-500 bg-opacity-80 rounded-md">
          <div className="z-20">
            <Button onClick={toOpenDetails}>詳細</Button>
          </div>
        </div>
      </div>
      {showDetails === true ?
        <Overlay open onBackdropClick={onCloseDetails}>
          <div className="bg-white my-8 rounded-lg">
            <div className="flex grow justify-end mt-12 mr-8"><Button color="secondary" onClick={onCloseDetails}>閉じる</Button></div>
            <VerifiableCredential vcForBusinessUnit={vcForBusinessUnit}></VerifiableCredential>
          </div>
        </Overlay> : null}
    </div>
  )
}

export default CredentialList