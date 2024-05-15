'use client'
import Home from '@/components/pages/Home'
import { signIn, useSession } from 'next-auth/react'
import { NextAuthProvider } from '@/app/providers'
import { User } from '@/types'
import ProcessingModal from '@/components/molecules/ProcessingModal'

const InnerPage = () => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <ProcessingModal open></ProcessingModal>
  }

  if (status !== 'authenticated') {
    return signIn()
  }

  const user = (session.user as any).principle as User


  return (
    <Home user={user} />
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
