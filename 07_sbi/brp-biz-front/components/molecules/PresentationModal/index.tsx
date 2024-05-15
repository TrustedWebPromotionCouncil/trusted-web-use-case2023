import { User, VcForBusinessUnit, VerificationResult } from '@/types'
import Overlay from '@/components/atoms/Overlay'
import Button from '@/components/atoms/Button'
import { FC, useEffect, useState } from 'react'

interface Props {
  user?: User
  vcForBusinessUnit: VcForBusinessUnit;
  open?: boolean;
  verificationResult: VerificationResult
  onClose?: () => void;
}

const PresentationModal: FC<Props> = ({ user, vcForBusinessUnit, verificationResult, open, onClose }) => {
  const [isValid, setIsValid] = useState(false)

  const createDate = (date: Date) => {
    const result = new Date(date)
    return result.toLocaleString('sv-SE')
  }

  useEffect(() => {
    if (verificationResult) {
      setIsValid(
        verificationResult.hasValidBusinessUnitSignature &&
        verificationResult.hasValidVcForBusinessUnit &&
        verificationResult.hasValidIssuerSignature &&
        verificationResult.hasValidIssuerVc &&
        verificationResult.hasValidBusinessUnitCredentialStatus &&
        verificationResult.hasValidIssuerCredentialStatus
      )
    }
  }, [verificationResult]);

  return (
    <Overlay open={open} onBackdropClick={onClose}>
      <div className="bg-white flex flex-col my-4 py-12 px-12 border rounded-2xl w-[65vw]">
        <div className="text-center text-l">検証日：{verificationResult && createDate(verificationResult.date)}</div>
        {isValid === true ? <div className='text-2xl text-blue-700'>有効</div> : <div className='text-2xl text-red-700'>無効</div>}
        <div className="flex justify-end py-2"><Button color='secondary' onClick={onClose}>閉じる</Button></div>
        {user ? <span className='text-2xl my-3'>事業所Q（VP）検証</span> : <span className='text-2xl my-3'>******（VP）検証</span>}
        <table className='w-full space-y-2'>
          <thead className='bg-blue-600 text-xl text-white'>
            <tr>
              <th className='text-center'>No.</th>
              <th className='text-center'>検証項目</th>
              <th className='text-center'>結果</th>
            </tr>
          </thead>
          <div className='flex grow text-left font-bold'>１．デジタル証明書</div>
          <tbody className='text-left'>
            <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>①</td><td className='border-2 border-gray-300 border-solid'>事業所のデジタル署名を検証（VP）</td><td className={`${verificationResult && verificationResult.hasValidBusinessUnitSignature ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{verificationResult && verificationResult.hasValidBusinessUnitSignature ? "有効" : "無効"}</td></tr>
            <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>②</td><td className='border-2 border-gray-300 border-solid'>事業所VCを検証（VC）</td><td className={`${verificationResult && verificationResult.hasValidVcForBusinessUnit ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{verificationResult && verificationResult.hasValidVcForBusinessUnit ? "有効" : "無効"}</td></tr>
            <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>③</td><td className='border-2 border-gray-300 border-solid'>デジタル認証機構のデジタル署名を検証（VP）</td><td className={`${verificationResult && verificationResult.hasValidIssuerSignature ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{verificationResult && verificationResult.hasValidIssuerSignature ? "有効" : "無効"}</td></tr>
            <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>④</td><td className='border-2 border-gray-300 border-solid'>デジタル認証機構のVCを検証（VC）</td><td className={`${verificationResult && verificationResult.hasValidIssuerVc ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{verificationResult && verificationResult.hasValidIssuerVc ? "有効" : "無効"}</td></tr>
          </tbody>
          <div className='flex grow text-left font-bold'>２．有効/無効確認</div>
          <tbody className='text-left'>
            <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>⑤</td><td className='border-2 border-gray-300 border-solid'>	事業所の証明書ステータス</td><td className={`${verificationResult && verificationResult.hasValidBusinessUnitCredentialStatus ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{verificationResult && verificationResult.hasValidBusinessUnitCredentialStatus ? "有効" : "無効"}</td></tr>
            <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>⑥</td><td className='border-2 border-gray-300 border-solid'>	デジタル認証機構の証明書ステータス</td><td className={`${verificationResult && verificationResult.hasValidIssuerCredentialStatus ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{verificationResult && verificationResult.hasValidIssuerCredentialStatus ? "有効" : "無効"}</td></tr>
          </tbody>
        </table>
        <div className='relative my-12'>
          <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2'>
            検証対象となる事業所VP
          </div>
          <hr className='border-t-2 border-gray-300' />
        </div>
        <div className='mx-5 my-4 text-left'>
          <div className='text-2xl font-bold'>Verifiable Presentation</div>
          <div className='my-2 flex'>
            <div className='font-semibold'>VPの宛先:</div>{user ? <div className='ml-36'>{user.businessUnit.name}</div> : <div className='ml-36'>不明</div>}
          </div>
          <div className='my-2'>
            <div className='font-semibold'>Public Trust URI:</div>
            {user && <div className='ml-32 flex'><div>事業所Q</div><div className='ml-5'>http://192.168.0.1/pubtrust/fcd50e24-4515-4b98-a040-e032e9503a63</div></div>}
            <div className='ml-52'>http://192.168.0.1/pubtrust/{vcForBusinessUnit.uuid}</div>
          </div>
        </div>
        <div className='border-solid border-2 border-black rounded-[20px] mt-6 mb-14 py-12 px-4 mx-5'>
          <h1 className='text-5xl text-center my-12' style={{ fontFamily: '"Your Ming Typeface", serif' }}>Certificate of<br />Business Unit Identity</h1>
          <div className='content grid grid-cols-6 gap-2 mx-8 text-left'>
            <p className='title col-span-3'>発行日</p>
            <p className='content col-span-3'>{vcForBusinessUnit.validFrom?.toString()}</p>
            <p className='title col-span-3'>有効期限</p>
            <p className='content col-span-3'>{vcForBusinessUnit.validUntil?.toString()}</p>
            <p className='title col-span-3'>UUID</p>
            {user ? <p className='content col-span-3'>fcd50e24-4515-4b98-a040-e032e9503a63</p> : <p className='content col-span-3'>{vcForBusinessUnit.uuid}</p>}
          </div>

          <h2 className='text-center text-xl my-7 underline'>発行者</h2>
          <div className='content grid grid-cols-6 gap-2 mx-8 text-left'>
            <p className='title col-span-3'>デジタル認証機構の識別子</p>
            <p className='content col-span-3 overflow-clip'>{vcForBusinessUnit.original?.vc.issuer.id}</p>
            <p className='title col-span-3'>デジタル認証機構名</p>
            <p className='content col-span-3'>{vcForBusinessUnit.original?.vc.credentialSubject.authenticatorInfo.digitalCertificateOrganizationName}</p>
            <p className='title col-span-3'>デジタル認証機構の認定者</p>
            <p className='content col-span-3'>{vcForBusinessUnit.original?.vc.credentialSubject.authenticatorInfo.digitalCertificateOrganizationCredentialIssuer}</p>
          </div>

          <h2 className='text-center text-xl my-7 underline'>所有者</h2>
          <div className='content grid grid-cols-6 gap-2 mx-8 text-left'>
            <p className='title col-span-3'>事業所の識別子</p>
            <p className='content col-span-3 overflow-clip'>{vcForBusinessUnit.original?.vc.credentialSubject.didDocument.id}</p>
            <p className='title col-span-3'>事業所名</p>
            <p className='content col-span-3'>{vcForBusinessUnit.original?.vc.credentialSubject.businessUnitInfo.businessUnitName}</p>
            <p className='title col-span-3'>所在地国</p>
            <p className='content col-span-3'>{vcForBusinessUnit.original?.vc.credentialSubject.businessUnitInfo.country}</p>
            <p className='title col-span-3'>所在地</p>
            <p className='content col-span-3'>{vcForBusinessUnit.original?.vc.credentialSubject.businessUnitInfo.address}</p>
            <p className='title col-span-3'>事業者の識別子</p>
            <p className='content col-span-3'>{vcForBusinessUnit.original?.vc.credentialSubject.legalEntityInfo.legalEntityIdentifier}</p>
            <p className='title col-span-3'>事業者名</p>
            <p className='content col-span-3'>{vcForBusinessUnit.original?.vc.credentialSubject.legalEntityInfo.legalEntityName}</p>
            <p className='title col-span-3'>事業者の所在地</p>
            <p className='content col-span-3 mb-8'>{vcForBusinessUnit.original?.vc.credentialSubject.legalEntityInfo.location}</p>
          </div>
        </div>
      </div>
    </Overlay>
  )
}
export default PresentationModal