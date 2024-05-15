import Button from '@/components/atoms/Button'
import Overlay from '@/components/atoms/Overlay'
import { VerificationResult } from '@/types/VerificationResult';
import { FC } from 'react'

interface InventoryConfirmModalProps {
  open?: boolean;
  isValid: boolean;
  verificationResult: VerificationResult
  onClose?: () => void;
}

const InventoryConfirmModal: FC<InventoryConfirmModalProps> = ({ ...props }) => {
  const createDate = (date: Date) => {
    const result = new Date(date)
    return result.toLocaleString('sv-SE')

  }

  return (
    <Overlay open={props.open} onBackdropClick={props.onClose}>
      <div className="bg-white flex flex-col py-12 px-12 border rounded-2xl w-[60vw]">
        <div className="text-center text-l">検証日：{props.verificationResult && createDate(props.verificationResult.date)}</div>
        {props.isValid === true ? <div className='text-2xl text-blue-700'>有効</div> : <div className='text-2xl text-red-700'>無効</div>}
        <div className="flex justify-end py-2"><Button color='secondary' onClick={props.onClose}>閉じる</Button></div>
        <span className='text-2xl my-3'>事業所（VC）検証</span>
        <table className='w-full space-y-2'>
          <thead className='bg-blue-600 text-xl text-white'>
            <tr>
              <th className='text-center'>No.</th>
              <th className='text-center'>検証項目</th>
              <th className='text-center'>結果</th>
            </tr>
          </thead>
          <span className='flex grow text-left font-bold'>１．デジタル証明書</span>
          <tbody className='text-left'>
            <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>①</td><td className='border-2 border-gray-300 border-solid'>事業所のデジタル署名を検証（VP）</td><td className={`${props.verificationResult && props.verificationResult.hasValidBusinessUnitSignature ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{props.verificationResult && props.verificationResult.hasValidBusinessUnitSignature ? "有効" : "無効"}</td></tr>
            <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>②</td><td className='border-2 border-gray-300 border-solid'>事業所VCを検証（VC）</td><td className={`${props.verificationResult && props.verificationResult.hasValidVcForBusinessUnit ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{props.verificationResult && props.verificationResult.hasValidVcForBusinessUnit ? "有効" : "無効"}</td></tr>
            <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>③</td><td className='border-2 border-gray-300 border-solid'>デジタル認証機構のデジタル署名を検証（VP）</td><td className={`${props.verificationResult && props.verificationResult.hasValidIssuerSignature ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{props.verificationResult && props.verificationResult.hasValidIssuerSignature ? "有効" : "無効"}</td></tr>
            <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>④</td><td className='border-2 border-gray-300 border-solid'>デジタル認証機構のVCを検証（VC）</td><td className={`${props.verificationResult && props.verificationResult.hasValidIssuerVc ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{props.verificationResult && props.verificationResult.hasValidIssuerVc ? "有効" : "無効"}</td></tr>
          </tbody>
          <div className='flex grow text-left font-bold'>２．有効/無効確認</div>
          <tbody className='text-left'>
            <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>⑤</td><td className='border-2 border-gray-300 border-solid'>	事業所の証明書ステータス</td><td className={`${props.verificationResult && props.verificationResult.hasValidBusinessUnitCredentialStatus ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{props.verificationResult && props.verificationResult.hasValidBusinessUnitCredentialStatus ? "有効" : "無効"}</td></tr>
            <tr className='border-2 border-gray-300 border-solid'><td className='border-2 border-gray-300 text-center'>⑥</td><td className='border-2 border-gray-300 border-solid'>	デジタル認証機構の証明書ステータス</td><td className={`${props.verificationResult && props.verificationResult.hasValidIssuerCredentialStatus ? 'text-blue-700' : 'text-red-700'} border-2 border-gray-300 border-solid text-center`}>{props.verificationResult && props.verificationResult.hasValidIssuerCredentialStatus ? "有効" : "無効"}</td></tr>
          </tbody>
        </table>
      </div>
    </Overlay>
  )
}

export default InventoryConfirmModal