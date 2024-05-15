import TaskList from '@/components/atoms/Icons/TaskList';
import ChallengeVcCreateModal from '@/components/molecules/ChallengeVcCreateModal';
import ChallengeVcRequestModal from '@/components/molecules/ChallengeVcRequestModal';
import ContractVpModal from '@/components/molecules/ContractVpModal';
import PageWithMenu from '@/components/templates/PageWithMenu'
import { Contract, ContractVpVerificationResult, User, VcForBusinessUnit } from '@/types'
import { ContractVpStatusType, ChallengeVc, ContractVp } from '@prisma/client'
import { FC, useState } from 'react';

interface Props {
  contracts: Contract[]
  user: User;
  // eslint-disable-next-line no-unused-vars
  onCreateVp?: () => void
  // eslint-disable-next-line no-unused-vars
  onShowVp?: (value: number) => void
  // eslint-disable-next-line no-unused-vars
  findContracts: () => void
  errors?: { message: string };
}

const Partners: FC<Props> = ({ ...props }) => {
  const [showVp, setShowVp] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [contract, setContract] = useState<Contract>()
  const [contractVp, setContractVp] = useState<ContractVp>()
  const [contractVpVerificationResult, setContractVpVerificationResult] = useState<ContractVpVerificationResult | null>(null)
  const [challengeVc, setChallengeVc] = useState<ChallengeVc | null>()
  const [vcForBusinessUnit, setVcForBusinessUnit] = useState<VcForBusinessUnit>()
  const [showVerificationResult, setShowVerificationResult] = useState(false)

  const steps = ["Challenge取得", "ChallengeVC生成", "VP生成", "VP確認"]

  const handleClose = () => {
    setShowRequestModal(false)
    props.findContracts()
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
      const vc = vcsForBusinessUnit.find((vcForBusinessUnit: any) => vcForBusinessUnit.isPrivateVc === true);
      setVcForBusinessUnit(vc)
    } catch (error) {
      console.error('登録処理中にエラーが発生しました:', error)
    }
  }

  const handleCreateChallengeVc = async () => {
    try {
      const body = {
        selfBusinessUnitId: props.user.businessUnit.id,
        contractId: contract!.id,
      }
      const response = await fetch('/api/challenge_vcs', {
        method: 'POST',
        body: JSON.stringify(body)
      })
      const data = await response.json()
      setChallengeVc(data)
    } catch {
      console.error('チャレンジVC作成中にエラーが発生しました')
    }
  }

  const handleCreateContractVp = async () => {
    try {
      const body = {
        businessUnitId: props.user.businessUnit.id,
        contractId: contract!.id,
        vcId: vcForBusinessUnit?.id,
        challengeVcId: challengeVc!.id,
      }
      // eslint-disable-next-line no-unused-vars
      const response = await fetch('/api/contract_vps', {
        method: 'POST',
        body: JSON.stringify(body)
      })
      const data = await response.json()
    } catch {
      console.error('契約VP作成中にエラーが発生しました')
    }
  }

  const handleCreateVp = async (value: number) => {
    setShowCreateModal(true)
    const body = {
      selfBusinessUnitId: props.user.businessUnit.id,
      contractId: value,
    }
    //TODO: show create VP modal
    // eslint-disable-next-line no-unused-vars
    const response = await fetch('/api/challenge_vcs', {
      method: 'POST',
      body: JSON.stringify(body)
    })

    const requestedContract = props.contracts.find(contract => contract.id === value)
    setContract(requestedContract)
  }

  const handleShowVp = async (businessUnitId: number, contractId: number) => {
    try {
      const response = await fetch(`/api/contract_vps?businessUnitId=${businessUnitId}&contractId=${contractId}`, {
        method: 'GET'
      })
      if (!response.ok) {
        throw new Error('サーバーエラーが発生しました')
      }
      const contractVpList = await response.json()
      setContractVp(contractVpList)
      setShowVp(true)
    } catch (error) {
      console.error('登録処理中にエラーが発生しました:', error)
    }

    setContractVpVerificationResult({
      id: 1,
      date: new Date,
      hasValidChallengeVc: true,
      hasOpponentChallenge: true,
      hasValidVp: true,
      hasValidVcForBusinessUnit: true,
      hasValidIssuerVp: true,
      hasValidIssuerVc: true,
      hasValidBusinessUnitCredentialStatus: true,
      hasValidIssuerCredentialStatus: true,
      contractVpId: 1
    })
  }

  const handleVerifyContractVp = async (businessUnitId: number, contractId: number) => {
    try {
      const vpResponse = await fetch(`/api/contract_vps?businessUnitId=${businessUnitId}&contractId=${contractId}`, {
        method: 'GET'
      })
      const vpData = await vpResponse.json()
      setContractVp(vpData)
      const body = {
        type: 'contractVp',
        contractVpId: vpData.id
      }
      const verificationResponse = await fetch('/api/verifications', {
        method: 'POST',
        body: JSON.stringify(body)
      })
      const verificationData = await verificationResponse.json()
      setContractVpVerificationResult(verificationData)
      setTimeout(() => props.findContracts(), 1000)
    } catch (error) {
      console.error('検証中にエラーが発生しました', error)
    }
  }

  const handleShowRequestModal = (value: number) => {
    const requestedContract = props.contracts.find(contract => contract.partyBId === value)
    setShowRequestModal(true)
    setContract(requestedContract)
  }

  const renderContractVp = (owner: string, contract: any) => {
    const loginUserIsInPartyA = props.user.businessUnit.id === contract.partyA.id

    // 自己VP欄生成ロジック
    if (owner === 'self') {
      if (loginUserIsInPartyA) {
        if (contract.partyAVpStatus === ContractVpStatusType.PreRequest) {
          return (
            <td>
              VP生成
            </td>
          )
        } else if (contract.partyAVpStatus === ContractVpStatusType.Requested) {
          return (
            <td>
              <button onClick={() => handleCreateVp(contract.id)} className='text-blue-500 underline'>VP生成</button>
            </td>
          )
        } else if (contract.partyAVpStatus === ContractVpStatusType.Created || contract.partyAVpStatus === ContractVpStatusType.Verified) {
          return <td className='px-6'>
            <button onClick={() => {
              handleShowVp(contract.partyAId, contract.id)
              setShowVerificationResult(false)
            }}>
              <TaskList size={24}></TaskList>
            </button>
          </td>
        }
      }
      else {
        if (contract.partyBVpStatus === ContractVpStatusType.PreRequest) {
          return (
            <td>
              VP生成
            </td>
          )
        } else if (contract.partyBVpStatus === ContractVpStatusType.Requested) {
          return (
            <td>
              <button onClick={() => handleCreateVp(contract.id)} className='text-blue-500 underline'>VP生成</button>
            </td>
          )
        } else if (contract.partyBVpStatus === ContractVpStatusType.Created || contract.partyBVpStatus === ContractVpStatusType.Verified) {
          return <td className='px-6'>
            <button onClick={() => {
              handleShowVp(contract.partyBId, contract.id)
              setShowVerificationResult(false)
            }}>
              <TaskList size={24}></TaskList>
            </button>
          </td>
        }
      }
    }

    // 相手VP欄生成ロジック
    else if (owner === 'partner') {
      if (loginUserIsInPartyA) {
        switch (contract.partyBVpStatus) {
          case ContractVpStatusType.PreRequest:
            return (
              <td>
                <button onClick={() => handleShowRequestModal(contract.partyB.id)} className='text-blue-500 underline'>VP依頼</button>
              </td>
            )
          case ContractVpStatusType.Requested:
            return (
              <td>
                依頼済
              </td>
            )
          case ContractVpStatusType.Created:
            return (
              <td>
                <button onClick={() => handleVerifyContractVp(contract.partyBId, contract.id)} className='text-blue-500 underline'>検証実施</button>
              </td>
            )
          case ContractVpStatusType.Verified:
            return (
              <td className='px-6'>
                <button onClick={() => {
                  handleShowVp(contract.partyBId, contract.id)
                  setShowVerificationResult(true)
                }}>
                  <TaskList size={24}></TaskList>
                </button>
              </td>
            )
        }
      }
      else {
        switch (contract.partyAVpStatus) {
          case ContractVpStatusType.PreRequest:
            return (
              <td>
                <button onClick={() => handleShowRequestModal(contract.partyB.id)} className='text-blue-500 underline'>VP依頼</button>
              </td>
            )
          case ContractVpStatusType.Requested:
            return (
              <td>
                依頼済
              </td>
            )
          case ContractVpStatusType.Created:
            return (
              <td>
                <button onClick={() => handleVerifyContractVp(contract.partyAId, contract.id)} className='text-blue-500 underline'>検証実施</button>
              </td>
            )
          case ContractVpStatusType.Verified:
            return (
              <td className='px-6'>
                <button onClick={() => {
                  handleShowVp(contract.partyAId, contract.id)
                  setShowVerificationResult(true)
                }}>
                  <TaskList size={24}></TaskList>
                </button>
              </td>
            )
        }
      }
    }
  }

  return (
    <PageWithMenu user={props.user} active='partners'>
      <div className='mx-auto justify-center items-center mt-12'>
        <table className="table-auto w-[80vw] mx-auto">
          <thead>
            <tr>
              <th className="h-12 bg-slate-700 text-white px-6">事業者名</th>
              <th className="h-12 bg-slate-700 text-white px-6">事業所名</th>
              <th className="h-12 bg-slate-700 text-white px-6">ステータス</th>
              <th className="h-12 bg-slate-700 text-white px-6">契約締結日</th>
              <th className="h-12 bg-slate-700 text-white px-6">契約書</th>
              <th className="h-12 bg-slate-700 text-white px-6">自己VP</th>
              <th className="h-12 bg-slate-700 text-white px-6">相手先VP</th>
              <th className="h-12 bg-slate-700 text-white px-6 w-36">Challenge値</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.contracts.map(contract =>
              <tr key={contract.id} className="h-12 text-center">
                <td className='px-6'>{props.user.businessUnit.id === contract.partyBId ? contract.partyA.legalEntity.name : contract.partyB.legalEntity.name}</td>
                <td className='px-6'>{props.user.businessUnit.id === contract.partyBId ? contract.partyA.name : contract.partyB.name}</td>
                <td className='px-6'>{contract.contractDocumentStatus === "PreReview" ? "進行中" : "締結完了"}</td>
                <td className='px-6'>{contract.contractDate?.toLocaleString('sv-SE').slice(0, 10)}</td>
                <td className='px-6'>レビュー済</td>
                {renderContractVp('self', contract)}
                {renderContractVp('partner', contract)}
                <td className='px-6 w-36 overflow-hidden'>{props.user.businessUnit.id === contract.partyAId ? contract.partyAChallenge?.substring(0, 11) : contract.partyBChallenge?.substring(0, 11)}</td>
              </tr>)}
          </tbody>
        </table>
        {showRequestModal && contract && <ChallengeVcRequestModal open onClose={() => handleClose()} contract={contract} user={props.user}></ChallengeVcRequestModal>}
        {showVp && contract?.contractVp &&
          <button onClick={() => handleShowVp(contract.contractVp.id, contract.id)}>
            <TaskList size={24}></TaskList>
          </button>}
      </div>
      {contractVpVerificationResult && showVp && <ContractVpModal open onClose={() => setShowVp(false)} contractVp={contractVp} showVerificationResult={showVerificationResult}></ContractVpModal>}
      {showCreateModal && contract && <ChallengeVcCreateModal user={props.user} steps={steps} contract={contract} open challengeVc={challengeVc} vcForBusinessUnit={vcForBusinessUnit} onClose={() => { setShowCreateModal(false); props.findContracts() }} onCreateChallengeVc={() => handleCreateChallengeVc()} onCreateContractVp={() => handleCreateContractVp()} onGetVc={() => getVcsForBusinessUnit()}></ChallengeVcCreateModal>}
    </PageWithMenu>
  )
}

export default Partners