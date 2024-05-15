import { User, UserForm, } from '@/types'
import Overlay from '@/components/atoms/Overlay'
import Button from '@/components/atoms/Button'
import { FC, useEffect, useState } from 'react'
import InputField from '@/components/atoms/InputField'
import Eye from '@/components/atoms/Icons/Eye'
import Upload from '@/components/atoms/Icons/Upload'

interface UserUpdateModalProps {
  user?: User;
  userId?: number;
  userName?: string;
  email?: string;
  legalEntityName?: string;
  legalEntityId?: number;
  businessUnitName?: string;
  businessUnitId?: number;
  color?: string;
  prefix?: string;
  domainName?: string,
  did?: string,
  publicKey?: string;
  privateKey?: string;
  identifier?: string;
  open?: boolean;
  onClose?: () => void;
  // eslint-disable-next-line no-unused-vars
  onRequest?: (value: UserForm) => void;
  requestStatus: 'NONE' | 'REQUEST' | 'FINISH';
  errors?: { message: string }

}

const UserUpdateModal: FC<UserUpdateModalProps> = ({ ...props }) => {
  const [userId, setUserId] = useState(props.userId)
  const [userName, setUserName] = useState(props.userName)
  const [email, setEmail] = useState(props.email)
  const [password, setPassword] = useState("Passw0rd")
  const [legalEntityName, setLegalEntityName] = useState(props.legalEntityName)
  const [businessUnitName, setBusinessUnitName] = useState(props.businessUnitName)
  const [businessUnitId, setBusinessUnitId] = useState(props.businessUnitId)
  const [legalEntityId, setLegalEntityId] = useState(props.legalEntityId)
  const [color, setColor] = useState(props.color)
  const [prefix, setPrefix] = useState(props.prefix)
  const [domainName, setDomainName] = useState(props.domainName)
  const [did, setDid] = useState(props.did)
  const [publicKey, setPublicKey] = useState(props.publicKey)
  const [privateKey, setPrivateKey] = useState(props.privateKey)
  const [identifier, setIdentifier] = useState(props.identifier)
  const [isPasswordShown, setShowPassword] = useState(Boolean)
  const handleChange = (setter: any) => (e: any) => {
    setter(e.target.value)
  }

  useEffect(() => {
    setUserName(props.userName)
    setEmail(props.email)
    setLegalEntityName(props.legalEntityName)
    setBusinessUnitName(props.businessUnitName)
    setColor(props.color)
    setPrefix(props.prefix)
    setDomainName(props.domainName)
    setDid(props.did)
    setPublicKey(props.publicKey)
    setPrivateKey(props.privateKey)
    setIdentifier(props.identifier)
    setUserId(props.userId)
    setBusinessUnitId(props.businessUnitId)
    setLegalEntityId(props.legalEntityId)
  }, [props.userName, props.businessUnitId, props.userId, props.email, props.legalEntityId, props.legalEntityName, props.businessUnitName, props.color, props.prefix, props.domainName, props.publicKey, props.privateKey, props.identifier, props.did]
  )

  const handleShowPassword = () => {
    setShowPassword(true)
  }

  const handleHidePassword = () => {
    setShowPassword(false)
  }

  const handleClose = () => {
    props.onClose && props.onClose()
  }

  const handleRequest = () => {
    props.onRequest && props.onRequest({
      userId: userId,
      name: userName,
      email: email,
      password: password,
      legalEntityName: legalEntityName,
      identifier: identifier,
      businessUnitName: businessUnitName,
      prefix: prefix,
      color: color,
      domainName: domainName,
      did: did,
      publicKey: publicKey,
      privateKey: privateKey,
      businessUnitId: businessUnitId,
      legalEntityId: legalEntityId
    })
  }

  if (props.requestStatus === 'FINISH') {
    handleClose()
  }

  return (
    <Overlay open={props.open} onBackdropClick={handleClose}>
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
          <InputField className='w-[45vw]' placeholder='例：unit7' value={domainName} onChange={handleChange(setDomainName)}></InputField>
          <div className="text-xl font-bold my-3 ml-3">Ref-Prefix</div>
          <InputField className='w-[45vw]' placeholder='例：pp' value={prefix} onChange={handleChange(setPrefix)}></InputField>
        </div>
        <div className='user-info flex flex-col justify-start items-start'>
          <div className="text-2xl my-3">詳細情報</div>
          <div className="text-xl font-bold my-3 ml-3">事業所のDID</div>
          <InputField className='w-[45vw]' placeholder='例：did:example:z1BucZo4E61VN434Lny5SSBm1wDGjNrayfbRYsvfUkDVpB​' value={did} onChange={handleChange(setDid)}></InputField>
          <div className="text-xl font-bold my-3 ml-3">公開鍵</div>
          <InputField disabled className='w-[45vw]' placeholder='例：abc11' value={publicKey} onChange={handleChange(setPublicKey)}></InputField>
          <div className="text-xl font-bold my-3 ml-3">秘密鍵</div>
          <InputField disabled className='w-[45vw]' placeholder='例：def22' value={privateKey} onChange={handleChange(setPrivateKey)}></InputField>
          <div className="text-xl font-bold my-3 ml-3">Trusted List</div>
          <div className='flex items-center justify-between'>
            <div className="w-[41vw] text-left text-l my-3 ml-6 text-blue-500">trustedlist.json</div>
            <button><Upload size={24} /></button>
          </div>
          <div className="text-xl font-bold my-3 ml-3">事業者の識別子</div>
          <InputField className='w-[45vw]' placeholder='例：1231231230000' value={identifier} onChange={handleChange(setIdentifier)}></InputField>
        </div>
        <div className="flex grow justify-end gap-3 mt-12">
          {props.errors && <span className="text-red-600">{props.errors.message}</span>}
          <Button color="secondary" onClick={handleClose}>閉じる</Button>
          <Button color='primary' onClick={handleRequest}>完了</Button>
        </div>
      </div>
    </Overlay >
  )
}
export default UserUpdateModal