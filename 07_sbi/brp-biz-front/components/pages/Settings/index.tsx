import Button from '@/components/atoms/Button';
import TaskList from '@/components/atoms/Icons/TaskList';
import ProcessingModal from '@/components/molecules/ProcessingModal';
import UserDetailsModal from '@/components/molecules/UserDetailsModal';
import UserRegisterModal from '@/components/molecules/UserRegisterModal';
import UserUpdateModal from '@/components/molecules/UserUpdateModal';
import PageWithMenu from '@/components/templates/PageWithMenu'
import { User, UserForm } from '@/types'
import { FC, useState } from 'react';

interface Props {
  user: User;
  requestedUser?: User;
  // eslint-disable-next-line no-unused-vars
  users: User[];
  requestStatus: 'NONE' | 'REQUEST' | 'FINISH';
  onResetUser?: () => void
  // eslint-disable-next-line no-unused-vars
  onRegisterUser?: (value: UserForm) => void
  // eslint-disable-next-line no-unused-vars
  onShowDetails?: (userId: number) => void
  // eslint-disable-next-line no-unused-vars
  onShowUpdate?: (userId: number) => void
  // eslint-disable-next-line no-unused-vars
  onUpdateUser?: (value: UserForm) => void
  isLoading: boolean
  errors?: { message: string };
  processing?: boolean
}

const Settings: FC<Props> = ({ ...props }) => {
  // const [requestedUser, setRequestedUser] = useState<User>(props.requestedUser)
  const [isDetailsShown, setShowDetails] = useState(Boolean)
  const [showRegisterUserModal, setShowRegisterUserModal] = useState(false)
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false)

  const handleResetUser = () => {
    props.onResetUser && props.onResetUser()
  }

  const handleRegisterUser = (value: UserForm) => {
    props.onRegisterUser && props.onRegisterUser(value)
  }

  const handleShowDetails = (value: number) => {
    setShowDetails(true)
    props.onShowDetails && props.onShowDetails(value)
  }

  const handleShowUpdateUserModal = (value: number) => {
    setShowUpdateUserModal(true)
    props.onShowUpdate && props.onShowUpdate(value)
  }


  const handleHideDetails = () => {
    setShowDetails(false)
  }

  const handleUpdateUser = (value: UserForm) => {
    props.onUpdateUser && props.onUpdateUser(value)
  }

  const spinnerStyle = {
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid #fff',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    animation: 'spin 2s linear infinite',
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  }

  return (
    <PageWithMenu user={props.user} active='settings'>
      <div className='ml-2'>
        <div className='my-auto'>
          <div className='mt-4 ml-3'>データリセット</div>
          <Button color="primary" onClick={handleResetUser}>
            <div className="flex">{props.isLoading && <div style={spinnerStyle} className='w-24 mr-3'></div>}リセット実行</div>
          </Button>
        </div>
        <div className='my-4'>
          <div className='mt-4 ml-3'>ユーザー管理</div>
          <Button color="primary" onClick={() => setShowRegisterUserModal(true)}>新規作成</Button>
        </div>
        <table className="table-auto flex-none mb-12 w-[80vw]">
          <thead>
            <tr>
              <th className="h-12 bg-slate-700 text-white px-6">事業者名</th>
              <th className="h-12 bg-slate-700 text-white px-6">事業所名</th>
              <th className="h-12 bg-slate-700 text-white px-6">Ref-Prefix</th>
              <th className="h-12 bg-slate-700 text-white px-6">ユーザー名</th>
              <th className="h-12 bg-slate-700 text-white px-6">ログインID</th>
              <th className="h-12 bg-slate-700 text-white px-6">詳細</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.users.map(user =>
              <tr key={user.id} className="h-12 text-center">
                <td className='px-6'>{user.businessUnit.legalEntity.name}</td>
                <td className='px-6'>{user.businessUnit.name}</td>
                <td className='px-6'>{user.businessUnit.prefix}</td>
                <td className='px-6'>{user.name}</td>
                <td className='px-6'>{user.email}</td>
                <td className='px-6'>
                  <button onClick={() => handleShowDetails(user.id)}>
                    <TaskList size={24}></TaskList>
                  </button>
                </td>
                <td className='px-6'><Button color='primary' onClick={() => handleShowUpdateUserModal(user.id)}>修正</Button></td>
              </tr>)}
          </tbody>
        </table>
        {isDetailsShown && props.onShowDetails && <UserDetailsModal user={props.requestedUser} open onClose={handleHideDetails}></UserDetailsModal>}
      </div>

      <UserRegisterModal
        open={showRegisterUserModal}
        onClose={() => setShowRegisterUserModal(false)}
        onRequest={handleRegisterUser}
        requestStatus={props.requestStatus}
        errors={props.errors}>
      </UserRegisterModal>
      <UserUpdateModal
        open={showUpdateUserModal}
        user={props.requestedUser}
        userId={props.requestedUser?.id}
        userName={props.requestedUser?.name}
        email={props.requestedUser?.email}
        legalEntityName={props.requestedUser?.businessUnit.legalEntity.name}
        legalEntityId={props.requestedUser?.businessUnit.legalEntity.id}
        businessUnitName={props.requestedUser?.businessUnit.name}
        businessUnitId={props.requestedUser?.businessUnit.id}
        color={props.requestedUser?.businessUnit.legalEntity.color}
        prefix={props.requestedUser?.businessUnit.prefix}
        publicKey={props.requestedUser?.businessUnit.publicKey}
        privateKey={props.requestedUser?.businessUnit.privateKey}
        domainName={props.requestedUser?.businessUnit.domainName}
        did={props.requestedUser?.businessUnit.did}
        identifier={props.requestedUser?.businessUnit.legalEntity.identifier}
        onClose={() => setShowUpdateUserModal(false)}
        onRequest={handleUpdateUser}
        requestStatus={props.requestStatus}
        errors={props.errors}
      ></UserUpdateModal>
      <ProcessingModal open={props.processing} />
    </PageWithMenu>
  )
}

export default Settings