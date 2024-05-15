'use client'
import { ChallengeVc, Contract, ContractVp, User } from '@/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { NextAuthProvider } from '../providers';
import Partners from '@/components/pages/Partners';
import ProcessingModal from '@/components/molecules/ProcessingModal';


const InnerPage = () => {
  const { data: session, status } = useSession()
  const [contract, setContract] = useState<Contract>()
  const [contractList, setContractList] = useState<Contract[]>([])
  const [challengeVc, setChallengeVc] = useState<ChallengeVc>()
  const [contractVp, setContractVp] = useState<ContractVp>()
  const [contractVpList, setContractVpList] = useState<ContractVp[]>([])



  useEffect(() => {
    if (status === 'authenticated') {
      findContracts(((session.user as any).principle as User).businessUnit.id)
    }
  }, [status])

  if (status === 'loading') {
    return <ProcessingModal open></ProcessingModal>
  }

  if (status !== 'authenticated') {
    return ""
  }

  const loginUser = (session.user as any).principle as User


  const findContracts = async (businessUnitId: number) => {
    const response = await fetch(`/api/contracts?id=${businessUnitId}`, { method: "GET" })
    if (!response.ok) throw new Error('サーバーエラーが発生しました')
    const json = await response.json()
    const sortedContracts = json.sort((a, b) => a.id - b.id)
    setContractList(sortedContracts)
  }

  const handleShowVp = async (value: Number) => {
    const vp = contractVpList!.find(contractVp => contractVp.id === value)
    setContractVp(vp)
  }



  return (
    <Partners
      user={loginUser}
      contracts={contractList}
      onShowVp={handleShowVp}
      findContracts={() => findContracts(((session.user as any).principle as User).businessUnit.id)}
    ></Partners>
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