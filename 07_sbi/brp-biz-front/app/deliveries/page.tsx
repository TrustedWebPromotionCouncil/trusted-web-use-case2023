'use client'
import Deliveries from '@/components/pages/Deliveries'
import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { NextAuthProvider } from '@/app/providers'
import { Order, User, VcForBusinessUnit, VcForProduct, Vp } from '@/types'
import ProcessingModal from '@/components/molecules/ProcessingModal'


const InnerPage = () => {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [vcForBusinessUnit, setVcForBusinessUnit] = useState<VcForBusinessUnit | undefined>(undefined)
  const [vcForProduct, setVcForProduct] = useState<VcForProduct[]>()
  const [processing, setProcessing] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [vp, setVp] = useState<Vp>()

  const findOrders = async () => {
    const response = await fetch("/api/orders", { method: 'GET' })
    if (!response.ok) throw new Error('サーバーエラーが発生しました')
    const json = await response.json()
    setOrders(json)
  }

  const createVp = async (orderId: number) => {
    try {
      const user = (session?.user as any).principle as User

      const requestStatus = {
        orderId: orderId,
        status: "Prepare"
      }

      const requestBody = {
        businessUnitId: user.businessUnit.id,
        did: user.businessUnit.did,
        orderId: orderId,
        vc: vcForBusinessUnit?.original.vc
      }
      let response = await
        fetch("/api/brp/vp", {
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      if (!response) {
        throw new Error('サーバーエラーが発生しました')
      }

      response = await fetch("/api/orders", {
        method: 'PUT',
        body: JSON.stringify(requestStatus)
      })
      if (!response) {
        throw new Error('サーバーエラーが発生しました')
      }
      const newVp = await response.json()
      setVp(newVp)
      await findOrders()

    } catch (error) {
      console.error('登録処理中にエラーが発生しました:', error)
    }
  }

  const setOrderWithoutVpQuality = async (orderId: number) => {
    try {
      const requestBody = {
        orderId: orderId,
        quality: "B",
        status: "Prepare"
      }

      const response = await fetch("api/orders/", {
        method: 'PUT',
        body: JSON.stringify(requestBody)
      })
      if (!response.ok) {
        throw new Error('サーバーエラーが発生しました')
      }
    } catch (error) {
      console.error('登録処理中にエラーが発生しました:', error)
    }
    findOrders()
  }
  const setShippingStatus = async (orderId: number) => {
    try {
      const requestBody = {
        orderId: orderId,
        status: "Shipped",
        shippingDate: new Date
      }

      const response = await fetch("api/orders/", {
        method: 'PUT',
        body: JSON.stringify(requestBody)
      })
      if (!response.ok) {
        throw new Error('サーバーエラーが発生しました')
      }
    } catch (error) {
      console.error('登録処理中にエラーが発生しました:', error)
    }
    findOrders()
  }



  const getVcsForBusinessUnit = async () => {
    try {
      const response = await fetch("/api/vcs_for_business_unit", {
        method: 'GET'
      })
      if (!response.ok) {
        throw new Error('サーバーエラーが発生しました')
      }
      const vcsForBusinessUnit = await response.json()
      setVcForBusinessUnit(vcsForBusinessUnit)
    } catch (error) {
      console.error('登録処理中にエラーが発生しました:', error)
    }
  }

  const getVcsForProducts = async () => {
    try {
      const response = await fetch("/api/vcs_for_product", {
        method: 'GET'
      })
      if (!response.ok) {
        throw new Error('サーバーエラーが発生しました')
      }
      const vcsForProducts = await response.json()
      setVcForProduct(vcsForProducts)
    } catch (error) {
      console.error('登録処理中にエラーが発生しました:', error)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      findOrders()
      getVcsForBusinessUnit()
      getVcsForProducts()
    }
  }, [status, processing])


  if (status === 'loading') {
    return <ProcessingModal open></ProcessingModal>
  }

  if (status !== 'authenticated') {
    return signIn()
  }

  const user = (session.user as any).principle as User
  const handleReady = async (orderId: number) => {
    const order = orders.filter(order => order.id == orderId)[0]
    const newOrder = { ...order }

    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setOrders([newOrder as any])
    setProcessing(false)
    createVp(orderId)
  }

  const handleReadyWithoutVP = async (orderId: number) => {
    const order = orders.filter(order => order.id == orderId)[0]
    const newOrder = { ...order }

    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setOrders([newOrder as any])
    setOrderWithoutVpQuality(orderId)
    setProcessing(false)
  }

  const handleShip = async (orderId: number) => {
    const order = orders.filter(order => order.id == orderId)[0]
    const newOrder = { ...order, status: 'Prepare' }
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setOrders([newOrder as any])
    setShippingStatus(orderId)
    setProcessing(false)
  }

  return (
    <Deliveries
      user={user}
      orders={orders}
      vcForBusinessUnit={vcForBusinessUnit}
      vcForProduct={vcForProduct}
      onReady={handleReady}
      onReadyWithoutVp={handleReadyWithoutVP}
      onShip={handleShip}
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
