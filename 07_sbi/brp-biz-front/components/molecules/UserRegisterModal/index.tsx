import { UserForm, } from '@/types'
import Overlay from '@/components/atoms/Overlay'
import Button from '@/components/atoms/Button'
import { FC, useState } from 'react'
import InputField from '@/components/atoms/InputField'
import Eye from '@/components/atoms/Icons/Eye'
import Upload from '@/components/atoms/Icons/Upload'

interface UserRegisterModalProps {
  open?: boolean;
  onClose?: () => void;
  // eslint-disable-next-line no-unused-vars
  onRequest?: (value: UserForm) => void;
  requestStatus: 'NONE' | 'REQUEST' | 'FINISH';
  errors?: { message: string }
}

const UserRegisterModal: FC<UserRegisterModalProps> = ({ open, onClose, onRequest, requestStatus, errors }) => {
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [legalEntityName, setLegalEntityName] = useState("")
  const [businessUnitName, setBusinessUnitName] = useState("")
  const [color, setColor] = useState("")
  const [prefix, setPrefix] = useState("")
  const [domainName, setDomainName] = useState("")
  const [did, setDid] = useState("")
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [identifier, setIdentifier] = useState("")
  const [isPasswordShown, setShowPassword] = useState(Boolean)
  const handleChange = (setter: any) => (e: any) => setter(e.target.value)

  const handleShowPassword = () => {
    setShowPassword(true)
  }

  const handleHidePassword = () => {
    setShowPassword(false)
  }

  const handleClose = () => {
    onClose && onClose()
  }

  const handleRequest = () => {
    onRequest && onRequest({
      name: userName,
      email: email,
      password: password,
      legalEntityName: legalEntityName,
      identifier: identifier,
      businessUnitName: businessUnitName,
      color: color,
      domainName: domainName,
      prefix: prefix,
      did: did,
      publicKey: publicKey,
      privateKey: privateKey
    })
  }

  if (requestStatus === 'FINISH') {
    handleClose()
  }

  return (
    <Overlay open={open} onBackdropClick={handleClose}>
      <div className="bg-white py-12 px-20 border w-[57vw] my-2 rounded-2xl">
        <div className='login-info flex flex-col justify-start items-start text-left w-[54vw]'>
          <div className="text-2xl text-left my-3">ログイン情報</div>
          <div className="text-xl font-bold my-3 ml-3">ユーザー名</div>
          <InputField placeholder='例：userP' value={userName} onChange={handleChange(setUserName)} className='w-[45vw]'></InputField>
          <div className="text-xl font-bold my-3 ml-3">ログインID</div>
          <InputField className='w-[45vw]' placeholder='例：userP@a.com' value={email} onChange={handleChange(setEmail)}></InputField>
          <div className="text-xl font-bold my-3 ml-3">ログインパスワード</div>
          {/* TODO: check for login password */}
          <div className='flex w-[45vw]'>
            <InputField type={isPasswordShown ? 'text' : 'password'} className='w-[41vw]' placeholder='' value={password} onChange={handleChange(setPassword)}></InputField>
            {isPasswordShown ? <button onClick={handleHidePassword} ><Eye size={24} /></button> : <button onClick={handleShowPassword} ><Eye size={24} /></button>}
          </div>
        </div>
        <div className='unit-info flex flex-col justify-start items-start'>
          <div className="text-2xl my-3">会社情報</div>
          <div className="text-xl font-bold my-3 ml-3">事業者名</div>
          <InputField className='w-[45vw]' placeholder='例：事業所P' value={legalEntityName} onChange={handleChange(setLegalEntityName)}></InputField>
          <div className="text-xl font-bold my-3 ml-3">事業者カラー</div>
          <InputField className='w-[45vw]' placeholder='例：#000000' value={color} onChange={handleChange(setColor)}></InputField>
          <div className="text-xl font-bold my-3 ml-3">事業所名</div>
          <InputField className='w-[45vw]' placeholder='例：工場P' value={businessUnitName} onChange={handleChange(setBusinessUnitName)}></InputField>
          <div className="text-xl font-bold my-3 ml-3">Domain Name</div>
          <InputField className='w-[45vw]' placeholder='例：工場P' value={domainName} onChange={handleChange(setDomainName)}></InputField>
          <div className="text-xl font-bold my-3 ml-3">Ref-Prefix</div>
          <InputField className='w-[45vw]' placeholder='例：pp' value={prefix} onChange={handleChange(setPrefix)}></InputField>
        </div>
        <div className='user-info flex flex-col justify-start items-start'>
          <div className="text-2xl my-3">詳細情報</div>
          <div className="text-xl font-bold my-3 ml-3">事業所のDID</div>
          <InputField className='w-[45vw]' placeholder='例：did:example:z1BucZo4E61VN434Lny5SSBm1wDGjNrayfbRYsvfUkDVpB​' value={did} onChange={handleChange(setDid)}></InputField>
          <div className="text-xl font-bold my-3 ml-3">公開鍵</div>
          <InputField className='w-[45vw]' placeholder='例：abc11' value={publicKey} onChange={handleChange(setPublicKey)}></InputField>
          <div className="text-xl font-bold my-3 ml-3">秘密鍵</div>
          <InputField className='w-[45vw]' placeholder='例：abc11' value={privateKey} onChange={handleChange(setPrivateKey)}></InputField>
          <div className="text-xl font-bold my-3 ml-3">Trusted List</div>
          <div className='flex items-center justify-between'>
            <div className="w-[41vw] text-left text-l my-3 ml-6 text-blue-500">trustedlist.json</div>
            <button><Upload size={24} /></button>
          </div>
          <div className="text-xl font-bold my-3 ml-3">事業者の法人番号</div>
          <InputField className='w-[45vw]' placeholder='例：1231231230000' value={identifier} onChange={handleChange(setIdentifier)}></InputField>
        </div>
        <div className="flex grow justify-end gap-3 mt-12">
          {errors && <span className="text-red-600">{errors.message}</span>}
          <Button color='secondary' onClick={handleClose}>閉じる</Button>
          <Button color='primary' onClick={handleRequest}>新規登録</Button>
        </div>
      </div>
    </Overlay >
  )
}
export default UserRegisterModal