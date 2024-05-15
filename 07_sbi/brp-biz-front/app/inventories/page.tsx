'use client'
import Inventories from '@/components/pages/Inventories'
import { signIn, useSession } from 'next-auth/react'
import { NextAuthProvider } from '@/app/providers'
import { Order, User } from '@/types'
import { useState, useEffect } from 'react'
import { VerificationResult } from '@/types/VerificationResult'
import ProcessingModal from '@/components/molecules/ProcessingModal'

const InnerPage = () => {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [processing, setProcessing] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [verificationResult, setVerificationResult] = useState<VerificationResult>()

  const findOrders = async () => {
    const response = await fetch("/api/arrivals", { method: 'GET' })

    if (!response.ok) throw new Error('サーバーエラーが発生しました')
    const json = await response.json()
    setOrders(json)
  }

  const getVerificationResults = async (orderId: number) => {
    try {
      const requestBody = {
        orderId: orderId,
      }
      const response = await fetch("/api/verifications", {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })
      if (!response.ok) {
        throw new Error('サーバーエラーが発生しました')
      }
      const newVp = await response.json()
      setVerificationResult(newVp)
    } catch (error) {
      console.error('登録処理中にエラーが発生しました:', error)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      findOrders()
    }
  }, [status])

  if (status === 'loading') {
    return <ProcessingModal open></ProcessingModal>
  }

  if (status !== 'authenticated') {
    return signIn()
  }

  const user = (session.user as any).principle as User
  const handleValidate = async (orderId: number) => {
    const order = orders.filter(order => order.id == orderId)[0]

    const newOrder = { ...order }
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    findOrders()
    setOrders(orders.map(order => order.id == orderId ? newOrder : order) as any)
    getVerificationResults(orderId)
    setProcessing(false)
  }

  return (
    <Inventories
      user={user}
      orders={orders}
      onValidate={handleValidate}
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
