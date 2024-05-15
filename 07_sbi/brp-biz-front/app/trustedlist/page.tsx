'use client'
import TrustedList from '@/components/pages/TrustedList'
import { signIn, useSession } from 'next-auth/react'
import { NextAuthProvider } from '@/app/providers'
import { TrustedItem, User } from '@/types'
import { useEffect, useState } from 'react'
import ProcessingModal from '@/components/molecules/ProcessingModal'



const InnerPage = () => {
  const { data: session, status } = useSession()
  const [processing, setProcessing] = useState(false)
  const [trustedItems, setTrustedItems] = useState<TrustedItem[]>([])

  useEffect(() => {
    if (status === 'authenticated') {
      findTrustedItems()
    }
  }, [status])

  if (status === 'loading') {
    return <ProcessingModal open></ProcessingModal>
  }

  if (status !== 'authenticated') {
    return ""
  }

  const user = (session.user as any).principle as User

  const findTrustedItems = async () => {
    const response = await fetch(`/api/brp/trusted_list`, { method: 'GET' })
    const data = await response.json()
    setTrustedItems(data)
  }

  const handleRefreshTrustedItems = async () => {
    setProcessing(true)
    let response = await fetch(`/api/brp/trusted_list`, { method: 'POST' })
    if (!response.ok) throw new Error('サーバーエラーが発生しました')
    response = await fetch(`/api/brp/trusted_list`, { method: 'GET' })
    const data = await response.json()
    setTrustedItems(data)
    setProcessing(false)
  }


  return (
    <TrustedList
      user={user}
      trustedItems={trustedItems}
      onRefresh={handleRefreshTrustedItems}
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
