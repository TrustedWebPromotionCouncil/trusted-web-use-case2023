import { User } from '@/types'
import Overlay from '@/components/atoms/Overlay'
import Button from '@/components/atoms/Button'
import { FC, useState } from 'react'
import Eye from '@/components/atoms/Icons/Eye'
import DocumentSearch from '@/components/atoms/Icons/DocumentSearch'

interface Props {
  user?: User
  open?: boolean;
  onClose?: () => void;
}

const UserDetailsModal: FC<Props> = ({ user, open, onClose }) => {
  const [isPasswordShown, setPasswordShown] = useState(Boolean)

  const handleShowPassword = () => {
    setPasswordShown(true)
  }

  const handleHidePassword = () => {
    setPasswordShown(false)
  }

  const handleShowDocument = () => {

  }


  return (
    <Overlay open={open} onBackdropClick={onClose}>
      <div className="bg-white py-12 px-20 border w-[60vw] my-2 rounded-2xl">
        <div className='login-info flex flex-col justify-start items-start'>
          <div className="text-2xl text-left my-3">ログイン情報</div>
          <div className="text-xl font-bold my-3 ml-3">ユーザー名</div>
          <div className="text-l my-3 mx-6">{user?.name}</div>
          <div className="text-xl font-bold my-3 ml-3">ログインID</div>
          <div className="text-l my-3 mx-6">{user?.email}</div>
          <div className="text-xl font-bold my-3 ml-3">ログインパスワード</div>
          {/* TODO: check for login password */}
          <div className='flex flex-grow items-center justify-between'>
            <div className="text-l my-3 mx-6">
              {isPasswordShown ?
                <div className='flex flex-grow items-center justify-between'>
                  <div className='w-96 text-left'>Passw0rd</div>
                  <button onClick={() => handleHidePassword()}><Eye size={24}></Eye></button>
                </div> :
                <div className='flex flex-grow justify-between'>
                  <div className='w-96 text-left'>********</div>
                  <button onClick={() => handleShowPassword()}><Eye size={24}></Eye></button>
                </div>}
            </div>
          </div>
        </div>
        <div className='unit-info flex flex-col justify-start items-start'>
          <div className="text-2xl my-3">会社情報</div>
          <div className="text-xl font-bold my-3 ml-3">事業者名</div>
          <div className="text-l my-3 mx-6">{user?.businessUnit.legalEntity.name}</div>
          <div className="text-xl font-bold my-3 ml-3">事業所名</div>
          <div className="text-l my-3 mx-6">{user?.businessUnit.name}</div>
          <div className="text-xl font-bold my-3 ml-3">Ref-Prefix</div>
          <div className="text-l my-3 mx-6">{user?.businessUnit.prefix}</div>
        </div>
        <div className='user-info flex flex-col justify-start items-start'>
          <div className="text-2xl my-3">詳細情報</div>
          <div className="text-xl font-bold my-3 ml-3">事業所のDID</div>
          <div className="text-l my-3 mx-6">{user?.businessUnit.did}</div>
          <div className="text-xl font-bold my-3 ml-3">公開鍵</div>
          <div className="text-l my-3 mx-6">{user?.businessUnit.publicKey}</div>
          <div className="text-xl font-bold my-3 ml-3">秘密鍵</div>
          <div className="text-l my-3 ml-6 text-left whitespace-wrap w-[50vw]">{user?.businessUnit.privateKey}</div>
          <div className="text-xl font-bold my-3 ml-3">Trusted List</div>
          <div className='flex items-center justify-between'>
            <div className="w-96 text-left text-l my-3 mx-6 font-blue">trustedlist.json</div>
            <button onClick={handleShowDocument}><DocumentSearch size={24}></DocumentSearch></button>
          </div>
          <div className="text-xl font-bold my-3 ml-3">事業者識別子</div>
          <div className="text-l my-3 mx-6">{user?.businessUnit.legalEntity.identifier}</div>
        </div>
        <div className="flex grow justify-end mt-12 mr-8"><Button color="secondary" onClick={onClose}>閉じる</Button></div>
      </div>
    </Overlay>
  )
}
export default UserDetailsModal