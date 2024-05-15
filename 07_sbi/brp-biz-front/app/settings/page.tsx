'use client'
import Settings from '@/components/pages/Settings';
import { User, UserForm } from '@/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { NextAuthProvider } from '../providers';
import ProcessingModal from '@/components/molecules/ProcessingModal';


const InnerPage = () => {
  const { data: session, status } = useSession()
  const [requestedUser, setRequestedUser] = useState<User>()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(Boolean)
  const [requestStatus, setRequestStatus] = useState<'NONE' | 'REQUEST' | 'FINISH'>('NONE')
  const [errors, setErrors] = useState<{ message: string }>()
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      findUsers()
    }
  }, [status])

  if (status === 'loading') {
    return <ProcessingModal open></ProcessingModal>
  }

  if (status !== 'authenticated') {
    return ""
  }

  const findUsers = async () => {
    const response = await fetch("/api/users", { method: "GET" })
    if (!response.ok) throw new Error('サーバーエラーが発生しました')
    const json = await response.json()
    setUsers(json)
  }

  const handleRegisterUser = async (value: UserForm) => {
    setRequestStatus('REQUEST')
    const request = value
    let response = await fetch("/api/users", {
      method: 'POST',
      body: JSON.stringify(request)
    })
    setRequestStatus('FINISH')
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    findUsers()
    setProcessing(false)
    if (!response.ok) {
      setErrors({
        message: `登録処理中にサーバーエラーが発生しました[${response.statusText}]`
      })
      setRequestStatus('NONE')
      throw new Error('サーバーエラーが発生しました')
    }
  }

  const handleResetUser = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reset', {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data)
    } catch (error) {
      console.error('Error resetting:', error)
    }
    setLoading(false)
  }

  const handleUpdateUser = async (value: UserForm) => {
    setRequestStatus('REQUEST')
    const request = value
    let response = await fetch("/api/users", {
      method: 'PUT',
      body: JSON.stringify(request)
    })
    setRequestStatus('FINISH')
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    findUsers()
    setProcessing(false)
    if (!response.ok) {
      setErrors({
        message: `登録処理中にサーバーエラーが発生しました[${response.statusText}]`
      })
      setRequestStatus('NONE')
      throw new Error('サーバーエラーが発生しました')
    }
  }

  const handleShowDetails = async (value: number) => {
    const user = users.find(user => user.id === value)
    setRequestedUser(user)
  }

  const handleShowUpdate = async (value: number) => {
    const user = users.find(user => user.id === value)
    setRequestedUser(user)
  }



  const loginUser = (session.user as any).principle as User

  return (
    <Settings
      user={loginUser}
      users={users}
      requestedUser={requestedUser}
      onShowUpdate={(value) => handleShowUpdate(value)}
      onRegisterUser={handleRegisterUser}
      onResetUser={handleResetUser}
      onShowDetails={(value) => handleShowDetails(value)}
      onUpdateUser={handleUpdateUser}
      requestStatus={requestStatus}
      isLoading={loading}
      errors={errors}
      processing={processing}
    />
  )
}

const Page = () => {
  return (
    <NextAuthProvider>
      <InnerPage />
    </NextAuthProvider>
  )
}
export default Page