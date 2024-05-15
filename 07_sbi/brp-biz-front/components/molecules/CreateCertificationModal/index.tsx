import Button from '@/components/atoms/Button'
import Checkbox from '@/components/atoms/Checkbox'
import InputField from '@/components/atoms/InputField'
import { FC } from 'react'
import { useState } from 'react'
import Overlay from '@/components/atoms/Overlay'
import { User, VcForBusinessUnitForm } from '@/types'

interface CreateCertificationModalProps {
  open?: boolean;
  user: User;
  level: string;
  requestStatus: 'NONE' | 'REQUEST' | 'FINISH';
  onClose?: () => void;
  // eslint-disable-next-line no-unused-vars
  onRequest?: (value: VcForBusinessUnitForm) => void;
  errors?: {message: string};
}

const CreateCertificationModal: FC<CreateCertificationModalProps> = ({ open, user, level = '1', requestStatus, onClose, onRequest, errors }) => {
  const options = ["はい"]
  const [businessUnitName, setBusinessUnitName] = useState(user.businessUnit.name)
  const [businessUnitCountry, setBusinessUnitCountry] = useState('日本')
  const [businessUnitAddress, setBusinessUnitAddress] = useState(user.businessUnit.address)
  const [contactName, setContactName] = useState(user.name)
  const [contactDepartment, setContactDepartment] = useState('')
  const [contactJobTitle, setContactJobTitle] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [legalEntityId, setLegalEntityId] = useState('')
  const [legalEntityName, setLegalEntityName] = useState(user.businessUnit.legalEntity.name)
  const [legalEntityLocation, setLegalEntityLocation] = useState('')
  const [includeBusinessUnitAddress, setIncludeBusinessUnitAddress] = useState(true)
  const [includeContactInfo, setIncludeContactInfo] = useState(true)
  const handleChange = (setter: any) => (e: any) => setter(e.target.value)
  
  const handleClose = () => { 
    onClose && onClose()
  }

  const handleRequest = () => {
    onRequest && onRequest({
      authenticationLevel: Number(level),
      businessUnitName: businessUnitName,
      businessUnitCountry: businessUnitCountry,
      businessUnitAddress: includeBusinessUnitAddress ? businessUnitAddress : '',
      contactName: includeContactInfo ? contactName : '',
      contactDepartment: includeContactInfo ? contactDepartment : '',
      contactJobTitle: includeContactInfo ? contactJobTitle : '',
      contactNumber: includeContactInfo ? contactNumber : '',
      legalEntityId: legalEntityId,
      legalEntityName: legalEntityName,
      legalEntityLocation: legalEntityLocation,
      businessUnitId: user.businessUnitId,
      hasPublicVc: false,
    })
  }

  const handleRequestWithPublic = () => {
    onRequest && onRequest({
      authenticationLevel: Number(level),
      businessUnitName: businessUnitName,
      businessUnitCountry: businessUnitCountry,
      businessUnitAddress: includeBusinessUnitAddress ? businessUnitAddress : '',
      contactName: includeContactInfo ? contactName : '',
      contactDepartment: includeContactInfo ? contactDepartment : '',
      contactJobTitle: includeContactInfo ? contactJobTitle : '',
      contactNumber: includeContactInfo ? contactNumber : '',
      legalEntityId: legalEntityId,
      legalEntityName: legalEntityName,
      legalEntityLocation: legalEntityLocation,
      businessUnitId: user.businessUnitId,
      hasPublicVc: true,
    })
  }

  if (requestStatus === 'FINISH') {
    handleClose()
  }

  return (
    <Overlay open={open} onBackdropClick={handleClose}>
      <div className='flex flex-col justify-start text-left border-solid border-gray border-0 rounded rounded-md bg-white w-[70vw] px-12 py-24 my-8'>
        <div className='mb-8'>
          <span className='text-xl mb-4 font-bold text-left'>１．事業所情報</span>
          <InputField label="事業所名" placeholder='例：工場A' value={businessUnitName} onChange={handleChange(setBusinessUnitName)}></InputField>
          <InputField label="所在地国" placeholder='例：日本' value={businessUnitCountry} onChange={handleChange(setBusinessUnitCountry)}></InputField>
          <InputField label="所在地" placeholder='例：東京都港区六本木１丁目６−１' value={businessUnitAddress} onChange={handleChange(setBusinessUnitAddress)}></InputField>
          <div className='flex w-full gap-x-2 mt-3'>
            <div className='w-1/3'></div>
            <span className='w-1/3'>所在地をVCに含みますか</span>
            <Checkbox options={options} checked={includeBusinessUnitAddress} onChange={e => setIncludeBusinessUnitAddress(e.target.checked)}></Checkbox>
          </div>
          <span className='text-lg font-semibold my-6'>連絡先情報</span>
          <InputField label="担当者名" placeholder='例：夏目漱石' isIndented value={contactName} onChange={handleChange(setContactName)}></InputField>
          <InputField label="部署名" placeholder='例：事業総括部' isIndented value={contactDepartment} onChange={handleChange(setContactDepartment)}></InputField>
          <InputField label="役職名" placeholder='例：管理者' isIndented value={contactJobTitle} onChange={handleChange(setContactJobTitle)}></InputField>
          <InputField label="連絡先電話番号" placeholder='例：0312345678' isIndented value={contactNumber} onChange={handleChange(setContactNumber)}></InputField>
          <div className='flex w-full gap-x-2 mt-3'>
            <div className='w-1/3'></div>
            <span className='w-1/3'>連絡先情報をVCに含みますか</span>
            <Checkbox options={options} checked={includeContactInfo} onChange={e => setIncludeContactInfo(e.target.checked)}></Checkbox>
          </div>
        </div>
        <div className='mb-8'>
          <span className='text-xl mb-4 font-bold'>2．事業者情報</span>
          <InputField label="事業者識別子" placeholder='例：6010401045208' value={legalEntityId} onChange={handleChange(setLegalEntityId)}></InputField>
          <InputField label="事業者名" placeholder='例：SBI Holdings' value={legalEntityName} onChange={handleChange(setLegalEntityName)}></InputField>
          <InputField label="所在地" placeholder='例：東京都港区六本木１丁目６−１' value={legalEntityLocation} onChange={handleChange(setLegalEntityLocation)}></InputField>
        </div>
        <div className='flex w-full gap-x-4 items-end justify-end'>
          {errors && <span className="text-red-600">{errors.message}</span>}
          <Button onClick={handleClose} color="secondary"><div className="py-3">キャンセル</div></Button>
          <Button onClick={handleRequest}>Private Trust<br />のみ申請</Button>
          <Button onClick={handleRequestWithPublic}>Public Trust<br />も同時申請</Button>
        </div>
      </div>
    </Overlay>
  )
}

export default CreateCertificationModal