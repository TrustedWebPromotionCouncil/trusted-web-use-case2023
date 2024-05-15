import { User } from '@/types'
import Overlay from '@/components/atoms/Overlay'
import Button from '@/components/atoms/Button'
import { FC, useEffect, useState } from 'react'
import { ContractVp } from '@/types'

interface Props {
  user?: User
  contractVp?: ContractVp;
  showVerificationResult: boolean;
  onClose?: () => void;
  open?: boolean
}

const ContractVpModal: FC<Props> = ({ contractVp, showVerificationResult, open, onClose }) => {
  const [isValid, setIsValid] = useState(false)


  const createDate = (date: Date) => {
    const result = new Date(date)
    return result.toLocaleString('sv-SE')
  }

  useEffect(() => {
    if (contractVp?.contractVpVerificationResult) {
      setIsValid(
        contractVp.contractVpVerificationResult.hasValidChallengeVc &&
        contractVp.contractVpVerificationResult.hasOpponentChallenge &&
        contractVp.contractVpVerificationResult.hasValidVp &&
        contractVp.contractVpVerificationResult.hasValidVcForBusinessUnit &&
        contractVp.contractVpVerificationResult.hasValidIssuerVp &&
        contractVp.contractVpVerificationResult.hasValidIssuerVc &&
        contractVp.contractVpVerificationResult.hasValidBusinessUnitCredentialStatus &&
        contractVp.contractVpVerificationResult.hasValidIssuerCredentialStatus
      )
    }
  }, [contractVp?.contractVpVerificationResult]);



  return (
    <Overlay open={open} onBackdropClick={onClose}>
      <div className="bg-white flex flex-col my-5 py-12 px-12 border rounded-2xl w-[60vw]">
        {showVerificationResult && contractVp && contractVp.contractVpVerificationResult &&
          <div>
            <div className="text-center text-l">検証日：{contractVp.contractVpVerificationResult && createDate(contractVp.contractVpVerificationResult.date)}</div>
            {isValid === true ? <div className='text-2xl text-blue-700'>有効</div> : <div className='text-2xl text-red-700'>無効</div>}
            <div className="flex justify-end py-2"><Button color='secondary' onClick={onClose}>閉じる</Button></div>
            <span className='text-2xl my-3'>{contractVp?.issuerName}（VP）検証</span>
            <table className='w-full space-y-2'>
              <thead className='bg-blue-600 text-xl text-white'>
                <tr>
                  <th className='text-center'>No.</th>
                  <th className='text-center'>検証項目</th>
                  <th className='text-center'>結果</th>
                </tr>
              </thead>
              <tbody className='text-left'>
                <tr className='text-left font-bold'><td colSpan={3} className='py-3'>１．Challenge VC</td></tr>
                <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>①</td><td className='border-2 border-gray-300 border-solid'>事業所のデジタル署名を検証（VC）</td><td className={`${contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidChallengeVc ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidVp ? "有効" : "無効"}</td></tr>
                <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>②</td><td className='border-2 border-gray-300 border-solid'>Challenge値</td><td className={`${contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasOpponentChallenge ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasOpponentChallenge ? "有効" : "無効"}</td></tr>
              </tbody>
              <tbody className='text-left'>
                <tr className='text-left font-bold'><td colSpan={3} className='py-3'>２−１．デジタル証明書</td></tr>
                <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>①</td><td className='border-2 border-gray-300 border-solid'>事業所のデジタル署名を検証（VP）</td><td className={`${contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidVp ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidChallengeVc ? "有効" : "無効"}</td></tr>
                <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>②</td><td className='border-2 border-gray-300 border-solid'>事業所VCを検証（VC）</td><td className={`${contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidVcForBusinessUnit ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidVcForBusinessUnit ? "有効" : "無効"}</td></tr>
                <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>③</td><td className='border-2 border-gray-300 border-solid'>デジタル認証機構のデジタル署名を検証（VP）</td><td className={`${contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidIssuerVp ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidIssuerVp ? "有効" : "無効"}</td></tr>
                <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>④</td><td className='border-2 border-gray-300 border-solid'>デジタル認証機構のVCを検証（VC）</td><td className={`${contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidIssuerVc ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidIssuerVc ? "有効" : "無効"}</td></tr>
              </tbody>
              <tbody className='text-left'>
                <tr className='text-left font-bold'><td colSpan={3} className='py-3'>２−２．有効/無効確認</td></tr>
                <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>⑤</td><td className='border-2 border-gray-300 border-solid'>	事業所の証明書ステータス</td><td className={`${contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidBusinessUnitCredentialStatus ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidBusinessUnitCredentialStatus ? "有効" : "無効"}</td></tr>
                <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>⑥</td><td className='border-2 border-gray-300 border-solid'>	デジタル認証機構の証明書ステータス</td><td className={`${contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidIssuerCredentialStatus ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{contractVp.contractVpVerificationResult && contractVp.contractVpVerificationResult.hasValidIssuerCredentialStatus ? "有効" : "無効"}</td></tr>
              </tbody>
            </table>
            <div className='relative my-12'>
              <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2'>
                検証対象となる事業所VP
              </div>
              <hr className='border-t-2 border-gray-300' />
            </div>
          </div>}
        <div className='text-2xl text-left' style={{ fontFamily: '"Your Ming Typeface", serif' }}>Verifiable Presentation</div>

        <div className='mx-5 text-left'>
          <div className='mx-12 my-2 w-full grid grid-cols-3'>
            <div className='col-span-1'>生成日</div><div className='col-span-2'>{contractVp?.challengeVcValidFrom?.substring(0, 10)} {Number(contractVp?.challengeVcValidFrom?.substring(11, 12)) + 9}{contractVp?.challengeVcValidFrom?.slice(13, 19)}</div>
            <div className='col-span-1'>所有者の識別子</div><div className='col-span-2 overflow-clip mr-6'>{contractVp?.challengeVcHolderId}</div>
            <div className='col-span-1'>所有者</div><div className='col-span-2'>{contractVp?.challengeVcHolderName}</div>
          </div>
        </div>

        <div className='mx-5 text-left' style={{ fontFamily: '"Your Ming Typeface", serif' }}>(1) Verifiable Credentials  ー  Challenge VC</div>
        <div className='border-solid border-2 border-black rounded-[20px] mt-6 mb-14 py-12 px-4 mx-5'>
          <h1 className='text-5xl text-center my-10' style={{ fontFamily: '"Your Ming Typeface", serif' }}>Challenge VC</h1>
          <div className='content grid grid-cols-5 gap-3 mx-5 text-left'>
            <p className='title col-span-2'>発行日</p>
            <p className='content col-span-3'>{contractVp?.challengeVcValidFrom?.slice(0, 10)} {Number(contractVp?.challengeVcValidFrom?.substring(11, 12)) + 9}{contractVp?.challengeVcValidFrom?.slice(13, 19)}</p>
            <p className='title col-span-2'>有効期限</p>
            <p className='content col-span-3'>{contractVp?.challengeVcValidUntil?.slice(0, 10)} {Number(contractVp?.challengeVcValidUntil?.substring(11, 12)) + 9}{contractVp?.challengeVcValidUntil?.slice(13, 19)}</p>
            <p className='title mt-7 col-span-2'>発行者の識別子</p>
            <p className='content mt-7 col-span-3 overflow-clip'>{contractVp?.challengeVcIssuerId}</p>
            <p className='title col-span-2'>発行者</p>
            <p className='content col-span-3'>{contractVp?.challengeVcIssuerName}</p>
            <p className='title mt-7 col-span-2'>所有者の識別子</p>
            <p className='content mt-7 col-span-3 overflow-clip'>{contractVp?.challengeVcHolderId}</p>
            <p className='title col-span-2'>所有者</p>
            <p className='content col-span-3'>{contractVp?.challengeVcHolderName}</p>
            <p className='title mt-7 col-span-2'>Challenge</p>
            <p className='content mt-7 col-span-3'>{contractVp?.challenge}</p>
          </div>
        </div>


        <div className='mx-5 mb-4 text-left' style={{ fontFamily: '"Your Ming Typeface", serif' }}>(2) Verifiable Credentials  ー  事業所VC</div>
        <div className='border-solid border-2 border-black rounded-[20px] mt-6 mb-14 py-12 px-4 mx-5'>
          <h1 className='text-5xl text-center my-12' style={{ fontFamily: '"Your Ming Typeface", serif' }}>Certificate of<br />Business Unit Identity</h1>
          <div className='content grid grid-cols-6 gap-2 mx-5 my-7 text-left'>
            <p className='title col-span-3'>発行日</p>
            <p className='content col-span-3 overflow-clip'>{contractVp?.vcValidFrom?.slice(0, 10)} {contractVp?.vcValidFrom?.slice(11, 19)}</p>
            <p className='title col-span-3'>有効期限</p>
            <p className='content col-span-3'>{contractVp?.vcValidUntil?.slice(0, 10)} {contractVp?.vcValidUntil?.slice(11, 19)}</p>
            <p className='title col-span-3'>UUID</p>
            <p className='content col-span-3 overflow-clip'>{contractVp?.vcUuid}</p>
          </div>



          <h2 className='text-center text-xl my-7 underline'>発行者</h2>
          <div className='content grid grid-cols-6 gap-2 mx-5 text-left'>
            <p className='title col-span-3'>デジタル認証機構の識別子</p>
            <p className='content col-span-3 overflow-clip'>{contractVp?.vcAuthId}</p>
            <p className='title col-span-3'>デジタル認証機構名</p>
            <p className='content col-span-3'>{contractVp?.vcAuthName}</p>
            <p className='title col-span-3'>デジタル認証機構の認定者</p>
            <p className='content col-span-3'>{contractVp?.vcAuthCertifierName}</p>
          </div>

          <h2 className='text-center text-xl my-7 underline'>所有者</h2>
          <div className='content grid grid-cols-6 gap-2 mx-5 text-left'>
            <p className='title col-span-3'>事業所の識別子</p>
            <p className='content col-span-3 overflow-clip'>{contractVp?.vcBusinessUnitId}</p>
            <p className='title col-span-3'>事業所名</p>
            <p className='content col-span-3'>{contractVp?.vcBusinessUnitName}</p>
            <p className='title col-span-3'>所在地国</p>
            <p className='content col-span-3'>{contractVp?.vcBusinessUnitCountry}</p>
            <p className='title col-span-3'>所在地</p>
            <p className='content col-span-3'>{contractVp?.vcBusinessUnitAddress}</p>
            <p className='title col-span-3'>事業者の識別子</p>
            <p className='content col-span-3'>{contractVp?.vcLegalEntityIdentifier}</p>
            <p className='title col-span-3'>事業者名</p>
            <p className='content col-span-3'>{contractVp?.vcLegalEntityName}</p>
            <p className='title col-span-3'>事業者の所在地</p>
            <p className='content col-span-3 mb-8'>{contractVp?.vcLegalEntityLocation}</p>
          </div>
        </div>
      </div>
    </Overlay>
  )
}
export default ContractVpModal