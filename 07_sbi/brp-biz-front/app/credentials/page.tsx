'use client'
import Credentials from '@/components/pages/Credentials'
import { signIn, useSession } from 'next-auth/react'
import { NextAuthProvider } from '@/app/providers'
import { User, VcForBusinessUnit, VcForBusinessUnitForm, VcForProduct } from '@/types'
import { useEffect, useState } from 'react'
import ProcessingModal from '@/components/molecules/ProcessingModal'

const InnerPage = () => {
  const { data: session, status } = useSession()
  const [vcsForBusinessUnit, setVcsForBusinessUnit] = useState<VcForBusinessUnit[]>([])
  const [vcForProduct, setVcForProduct] = useState<VcForProduct[]>()
  const [requestStatus, setRequestStatus] = useState<'NONE' | 'REQUEST' | 'FINISH'>('NONE')
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<{ message: string }>()

  const getVcsForBusinessUnit = async () => {
    try {
      const response = await fetch("/api/vcs_for_business_unit", {
        method: 'GET'
      })
      if (!response.ok) {
        throw new Error('サーバーエラーが発生しました')
      }
      const data = await response.json()
      setVcsForBusinessUnit(data)
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
      getVcsForBusinessUnit()
      getVcsForProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  if (status === 'loading') {
    return <ProcessingModal open></ProcessingModal>
  }

  if (status !== 'authenticated') {
    return signIn()
  }

  const user = (session.user as any).principle as User
  const handleRequestVcForProduct = async () => {
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setVcForProduct(vcForProduct)
    setProcessing(false)
  }

  const handleRequestVcForBusinessUnit = async (value: VcForBusinessUnitForm) => {
    try {
      setErrors(undefined)
      setProcessing(true)
      setRequestStatus('REQUEST')
      const request = value
      request.isPrivateVc = true
      let response = await fetch("/api/brp/vc_for_business_unit", {
        method: 'POST',
        body: JSON.stringify(request),
      })
      if (!response.ok) {
        setErrors({
          message: `登録処理中にサーバーエラーが発生しました[${response.statusText}]`
        })

        throw new Error('サーバーエラーが発生しました')
      }

      let body = await new Response(response.body).text()

      if (value.hasPublicVc) {
        request.isPrivateVc = false
        response = await fetch("/api/brp/vc_for_business_unit", {
          method: 'POST',
          body: JSON.stringify(request),
        })
        if (!response.ok) {
          setErrors({
            message: `登録処理中にサーバーエラーが発生しました[${response.statusText}]`
          })

          throw new Error('サーバーエラーが発生しました')
        }

        body = await new Response(response.body).text()
        console.dir(body)
      }

      setRequestStatus('FINISH')
    } catch (error) {
      console.error('登録処理中にエラーが発生しました:', error)
      setRequestStatus('NONE')
      setErrors({
        message: `登録処理中にエラーが発生しました: ${error}`
      })
    } finally {
      setProcessing(false)
      // onClose && onClose()
    }
    getVcsForBusinessUnit()
  }

  return (
    <Credentials
      user={user}
      vcsForBusinessUnit={vcsForBusinessUnit as VcForBusinessUnit[]}
      vcForProduct={vcForProduct}
      onRequestVcForProduct={handleRequestVcForProduct}
      onRequestVcForBusinessUnit={handleRequestVcForBusinessUnit}
      requestStatus={requestStatus}
      processing={processing}
      errors={errors}
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
