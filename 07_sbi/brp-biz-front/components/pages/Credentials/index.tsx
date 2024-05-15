import Button from '@/components/atoms/Button'
import CreateCertificationModal from '@/components/molecules/CreateCertificationModal'
import CreateCertificationMoqModal from '@/components/molecules/CreateCertificationMoqModal'
import LevelModal from '@/components/molecules/LevelModal'
import CredentialList from '@/components/organisms/CredentialList'
import PageWithMenu from '@/components/templates/PageWithMenu'
import MiniCertificate from '@/components/atoms/MiniCertificate'
import { FC, useState } from 'react'
import { User, VcForBusinessUnit, VcForBusinessUnitForm, VcForProduct } from '@/types'
import ProcessingModal from '@/components/molecules/ProcessingModal'
import { vcType } from '@/types/VcType'

interface Props {
  user: User;
  vcForBusinessUnit?: VcForBusinessUnit;
  vcsForBusinessUnit?: VcForBusinessUnit[];
  vcForProduct?: VcForProduct[];
  requestStatus: 'NONE' | 'REQUEST' | 'FINISH';
  // eslint-disable-next-line no-unused-vars
  onRequestVcForProduct: () => void;
  // eslint-disable-next-line no-unused-vars
  onRequestVcForBusinessUnit: (value: VcForBusinessUnitForm) => void;
  processing?: boolean;
  errors?: { message: string };
}

const Credentials: FC<Props> = ({ user, vcsForBusinessUnit, vcForProduct, requestStatus, onRequestVcForProduct, onRequestVcForBusinessUnit, processing, errors }) => {
  const [selectedLevel, setSelectedLevel] = useState('')
  const [showLevelModal, setShowLevelModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleCreateProductCredentials = () => {
    onRequestVcForProduct && onRequestVcForProduct()
  }

  const handleSelectLevel = (level: string) => {
    setSelectedLevel(level)
    setShowLevelModal(false)
    setShowCreateModal(true)
  }

  const handleRequestVcForBusinessUnit = (value: VcForBusinessUnitForm) => {
    onRequestVcForBusinessUnit && onRequestVcForBusinessUnit(value)
  }

  return (
    <PageWithMenu
      user={user}
      active="credentials"
    >
      <div className='flex text-2xl'>Public Trust設定</div>
      <div className='ml-4'>製品の製造場所の問い合わせに対して提示する事業所(VC)を選択</div>
      <div className="flex items-center ml-4 mt-2 gap-2">
        <div className="border p-2 h-7 w-24 flex items-center justify-center">
          UUID
        </div>
        <select className="form-select w-full text-center border rounded-full">
          {vcsForBusinessUnit && vcsForBusinessUnit.map((vc, index) => (
            <option key={index} value={vc.uuid}>{vc.uuid}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col" style={{ width: 765 }}>
        <div className="flex gap-4 justify-end mb-4 mt-6">
          {/* <Button onClick={handleCreateProductCredentials}>製品(VC)申請</Button> */}
          <Button onClick={() => setShowLevelModal(true)}>事業所(VC)申請</Button>
        </div>
        <div>
          <div className="bg-gray-600 flex flex-wrap grow h-10 justify-center items-center text-white px-3">証明書(VC)</div>
          <div className="flex flex-wrap gap-8 justify-center">
            {vcsForBusinessUnit && vcsForBusinessUnit.length >= 1 && <CredentialList vcForBusinessUnit={vcsForBusinessUnit.find(x => x.isPrivateVc === true)}></CredentialList>}
            {vcsForBusinessUnit && vcsForBusinessUnit.length >= 2 && <CredentialList vcForBusinessUnit={vcsForBusinessUnit.find(x => x.isPrivateVc === false)}></CredentialList>}
            {vcForProduct?.length ?
              <div className="mb-3">
                <div>
                  <MiniCertificate
                    size={320}
                    type={vcType.PRODUCTS}
                    color="bg-blue-200"
                    {...vcForProduct}
                  />
                </div>
                <div className="opacity-0 absolute -mt-[235px] h-[235px] hover:opacity-100 w-[320px] border-2 flex items-center justify-center border-solid bg-gray-500 bg-opacity-80 rounded-md">
                  <div className="z-20">
                    <Button>詳細</Button>
                  </div>
                </div>
              </div> : <div className="mb-3 mx-3 bg-none w-[320px] border-gray-200 border-2 border-solid rounded-md"></div>}
            <div className="mb-3 mx-3 bg-none w-[320px] h-[235px] border-gray-200 border-2 border-solid rounded-md"></div>
            {vcsForBusinessUnit && vcsForBusinessUnit.length <= 1 && <div className="mb-3 mx-3 bg-none w-[320px] h-[235px] border-gray-200 border-2 border-solid rounded-md"></div>}
            {vcsForBusinessUnit && vcsForBusinessUnit.length <= 0 && <div className="mb-3 mx-3 bg-none w-[320px] h-[235px] border-gray-200 border-2 border-solid rounded-md"></div>}
          </div>
        </div>
      </div>

      <LevelModal
        open={showLevelModal}
        onCancel={() => setShowLevelModal(false)}
        onNext={handleSelectLevel}
      />
      {user?.id === 8 ?
        <CreateCertificationMoqModal
          user={user}
          open={showCreateModal}
          level={selectedLevel}
          requestStatus={requestStatus}
          onClose={() => setShowCreateModal(false)}
          onRequest={handleRequestVcForBusinessUnit}
          errors={errors}
        />
        : <CreateCertificationModal
          user={user}
          open={showCreateModal}
          level={selectedLevel}
          requestStatus={requestStatus}
          onClose={() => setShowCreateModal(false)}
          onRequest={handleRequestVcForBusinessUnit}
          errors={errors}
        />
      }
      <ProcessingModal open={processing} />
    </PageWithMenu>
  )
}
export default Credentials