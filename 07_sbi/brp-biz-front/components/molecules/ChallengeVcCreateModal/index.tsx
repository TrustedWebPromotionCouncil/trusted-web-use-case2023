import MiniCertificate from '@/components/atoms/MiniCertificate'
import Overlay from '@/components/atoms/Overlay'
import StepperController from '@/components/atoms/StepperController'
import { User, Contract, VcForBusinessUnit } from '@/types'
import { FC, ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import ProcessingModal from '../ProcessingModal'
import { vcType } from '@/types/VcType'


interface ChallengeVcCreateModalProps {
  open?: boolean;
  user: User;
  contract: Contract;
  challengeVc: any;
  vcForBusinessUnit?: VcForBusinessUnit;
  // eslint-disable-next-line no-unused-vars
  onVpGenerate?: (values: number[]) => void;
  onClose?: () => void;
  onReady?: () => void;
  onReadyWithOutVp?: () => void;
  onCreateChallengeVc?: () => void;
  onGetVc?: () => void;
  onCreateContractVp?: () => void;
  steps: string[];
}

const ChallengeVcCreateModal: FC<ChallengeVcCreateModalProps> = ({ user, contract, challengeVc, steps, open, vcForBusinessUnit, onVpGenerate, onClose, onCreateChallengeVc, onCreateContractVp, onGetVc }) => {
  // eslint-disable-next-line no-unused-vars
  const [generated, setGenerated] = useState(false);
  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const [labelNext, setLabelNext] = useState("実行")
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setProcessing] = useState(Boolean)
  const [isCreatedContractVp, setCreatedContractVP] = useState(Boolean)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (checkedValues.includes(Number(e.target.value))) {
      setCheckedValues(checkedValues.filter(checkedValue => checkedValue !== Number(e.target.value)))
    } else {
      setCheckedValues([...checkedValues, Number(e.target.value)])
    }
  }

  const handleFinish = () => {
    if (onVpGenerate != undefined) {
      onVpGenerate(checkedValues)
    } else {
      setGenerated(true)
    }
    setGenerated(true)
    onClose && onClose()
  }

  const handleClose = () => {
    onClose && onClose()
  }

  const UL = styled.ul`
    li:before {
      content: '';
    }
    `

  const createPartnerBusinessUnitName = () => {
    if (loginUserIsInPartyA()) return contract.partyB.name
    else return contract.partyA.name
  }

  const createPartnerChallenge = () => {
    if (loginUserIsInPartyA()) return contract.partyBChallenge
    else return contract.partyAChallenge
  }

  const loginUserIsInPartyA = () => {
    return user.businessUnit.id === contract.partyAId
  }

  const getChallengeContent = () => {
    return (
      <div className='flex flex-col mx-8 px-16 gap-8 mx-auto justify-center text-left'>
        <div className="text-left text-lg bg-stone-200 py-12 px-8 rounded-xl my-4">
          <UL>
            <li>・Request from: {createPartnerBusinessUnitName()}</li>
            <li>・Challenge: {createPartnerChallenge()}</li>
          </UL>
        </div>
      </div>
    )
  }


  const createdChallengeVcContent = () => {
    return (
      <div className='flex flex-col mx-auto w-full justify-center items-center'>
        <div className='font-bold text-center mb-6'>ChallengeVC生成完了</div>
        <MiniCertificate size={325} type={vcType.CHALLENGE_VC} validFrom={challengeVc.validFrom} issuer={challengeVc?.issuerName} challenge={challengeVc?.challenge} ></MiniCertificate>
      </div>
    )
  }

  const createVpContent = () => {
    return (
      <div>
        {!isCreatedContractVp ? <div className="flex flex-col items-center py-2 mx-16 gap-6 overflow-auto border" style={{ height: '280px' }}>
          <div className='font-bold text-center'>VCを選択する</div>
          {vcForBusinessUnit && <label className="flex gap-2 items-center">
            <MiniCertificate size={325} {...vcForBusinessUnit} type={vcType.BUSINESS_UNITS} original={vcForBusinessUnit.original} uuid={vcForBusinessUnit.uuid} />
            <input
              type="checkbox"
              value={vcForBusinessUnit?.id}
              checked={checkedValues.includes(vcForBusinessUnit?.id)}
              onChange={handleChange}
              className="w-4 h-4 ml-4"
            />
          </label>}
          {challengeVc && <label className="flex gap-2 items-center">
            <MiniCertificate size={325} {...challengeVc} type={vcType.CHALLENGE_VC} validFrom={challengeVc.validFrom} issuer={challengeVc?.issuerName} challenge={challengeVc?.challenge} />
            <input
              type="checkbox"
              value={challengeVc?.id}
              checked={checkedValues.includes(challengeVc!.id)}
              onChange={handleChange}
              className="w-4 h-4 ml-4"
            />
          </label>}
        </div> : <div>
          <div className="flex flex-col items-center py-2 my-2 gap-2 mx-16 overflow-auto border" style={{ height: '280px' }}>
            <div className='font-bold text-center'>VPを生成完了</div>
            <div className='py-3 mb-4 px-20 flex flex-col gap-4 rounded rounded-md bg-blue-100'>
              <p className='font-bold text-left'>Verifiable Presentation</p>
              {vcForBusinessUnit && <label className="flex gap-2 items-center">
                <MiniCertificate size={325} {...vcForBusinessUnit} type={vcType.BUSINESS_UNITS} original={vcForBusinessUnit.original} uuid={vcForBusinessUnit.uuid} />
              </label>}
              {challengeVc && <label className="flex gap-2 items-center">
                <MiniCertificate size={325} {...challengeVc} type={vcType.CHALLENGE_VC} validFrom={challengeVc.validFrom} issuer={challengeVc?.issuerName} challenge={challengeVc?.challenge} />
              </label>}
            </div>
          </div>
        </div>}
      </div>
    )
  }

  const confirmContent = () => {
    return <div className='h-full'>
      <div className="mx-20 px-32 text-lg bg-stone-200 p-8 rounded-xl">
        <UL className='text-left'>
          <li>・事業者名：{contract?.partyA.legalEntity.name}</li>
          <li>・事業所名：{contract?.partyA.name}</li>
          <br /><br />
          <li>・VPの構成</li>
          <li className='pl-4'>- Challenge VC</li>
          <li className='pl-4'>- 事業所VC</li>
        </UL>
      </div>
      <p className='mt-3'>検証可能な証明書を含んだVP提示完了</p>
    </div>
  }

  const displaySteps = (step: number) => {
    switch (step) {
      case 1:
        return getChallengeContent()
      case 2:
        return createdChallengeVcContent()
      case 3:
        return createVpContent()
      case 4:
        return confirmContent()

      default: <div></div>
    }
  }

  const handleReturn = () => {
    if (currentStep === 1) onClose && onClose()
    else setCurrentStep(currentStep - 1)
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      onCreateChallengeVc && onCreateChallengeVc()
      setProcessing(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setProcessing(false)
      setCurrentStep(currentStep + 1)
      setLabelNext("進む")

    }
    else if (currentStep === 2) {
      onGetVc && onGetVc()
      setCurrentStep(currentStep + 1)
      setLabelNext("実行")
    }
    else if (currentStep === 3) {
      setCreatedContractVP(false)
      !isCreatedContractVp && setLabelNext("実行")
      setProcessing(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setCreatedContractVP(true)
      setLabelNext("進む")
      setProcessing(false)
      onCreateContractVp && onCreateContractVp()
      isCreatedContractVp && setCurrentStep(currentStep + 1)
    }
  }

  return (
    <div>
      <Overlay open={open} onBackdropClick={handleClose}>
        <div className="bg-white flex flex-col px-14 border rounded-2xl" style={{ width: '780px', height: '550px' }}>
          <div className="flex flex-col justify-between flex-grow">
            <StepperController currentStep={currentStep} steps={steps} labelNext={labelNext} onReturn={() => handleReturn()} onNext={() => handleNext()} onFinish={handleFinish}>{displaySteps(currentStep)}</StepperController>
          </div>
        </div>
      </Overlay>
      <ProcessingModal open={isProcessing}></ProcessingModal>
    </div>
  )
}

export default ChallengeVcCreateModal