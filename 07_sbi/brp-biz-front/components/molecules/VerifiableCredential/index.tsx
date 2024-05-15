import { VcForBusinessUnit } from '@/types'
import { FC } from 'react'

interface Props {
  vcForBusinessUnit: VcForBusinessUnit,
}

const VerifiableCredential: FC<Props> = ({ vcForBusinessUnit }) => {
  return (
    <div className="border-solid border-2 border-black rounded-[20px] mt-6 mb-14 py-12 px-4 mx-20 w-[800px]">
      <h1 className="text-5xl text-center my-12" style={{ fontFamily: '"Your Ming Typeface", serif' }}>Certificate of<br />Business Unit Identity</h1>
      <div className="content grid grid-cols-6 gap-2 mx-8 text-left">
        <p className="title col-span-3">発行日</p>
        <p className="content col-span-3">{vcForBusinessUnit.validFrom?.toString()}</p>
        <p className="title col-span-3">有効期限</p>
        <p className="content col-span-3">{vcForBusinessUnit.validUntil?.toString()}</p>
        <p className="title col-span-3">UUID</p>
        <p className="content col-span-3">{vcForBusinessUnit.uuid}</p>
      </div>

      <h2 className="text-center text-xl my-7 underline">発行者</h2>
      <div className="content grid grid-cols-6 gap-2 mx-8 text-left">
        <p className="title col-span-3">デジタル認証機構の識別子</p>
        <p className="content col-span-3 overflow-clip">{vcForBusinessUnit.original?.vc.issuer.id}</p>
        <p className="title col-span-3">デジタル認証機構名</p>
        <p className="content col-span-3">{vcForBusinessUnit.original?.vc.credentialSubject.authenticatorInfo.digitalCertificateOrganizationName}</p>
        <p className="title col-span-3">デジタル認証機構の認定者</p>
        <p className="content col-span-3">{vcForBusinessUnit.original?.vc.credentialSubject.authenticatorInfo.digitalCertificateOrganizationCredentialIssuer}</p>
      </div>

      <h2 className="text-center text-xl my-7 underline">所有者</h2>
      <div className="content grid grid-cols-6 gap-2 mx-8 text-left overflow-clip">
        <p className="title col-span-3">事業所の識別子</p>
        <p className="content col-span-3">{vcForBusinessUnit.isPrivateVc && vcForBusinessUnit.original?.vc.credentialSubject.didDocument.id}</p>
        <p className="title col-span-3">事業所名</p>
        <p className="content col-span-3">{vcForBusinessUnit.isPrivateVc && vcForBusinessUnit.original?.vc.credentialSubject.businessUnitInfo.businessUnitName}</p>
        <p className="title col-span-3">所在地国</p>
        <p className="content col-span-3">{vcForBusinessUnit.original?.vc.credentialSubject.businessUnitInfo.country}</p>
        <p className="title col-span-3">所在地</p>
        <p className="content col-span-3">{vcForBusinessUnit.isPrivateVc && vcForBusinessUnit.original?.vc.credentialSubject.businessUnitInfo.address}</p>

        <p className="col-span-5 col-start-2 font-bold">連絡先情報</p>

        <p className="title col-span-2 col-start-2">担当者名</p>
        <p className="content col-span-3">{vcForBusinessUnit.isPrivateVc && vcForBusinessUnit.original?.vc.credentialSubject.businessUnitInfo.contactInfo.name}</p>
        <p className="title col-span-2 col-start-2">部署</p>
        <p className="content col-span-3">{vcForBusinessUnit.isPrivateVc && vcForBusinessUnit.original?.vc.credentialSubject.businessUnitInfo.contactInfo.department}</p>
        <p className="title col-span-2 col-start-2">役職</p>
        <p className="content col-span-3">{vcForBusinessUnit.isPrivateVc && vcForBusinessUnit.original?.vc.credentialSubject.businessUnitInfo.contactInfo.jobTitle}</p>
        <p className="title col-span-2 col-start-2">連絡番号</p>
        <p className="content col-span-3">{vcForBusinessUnit.isPrivateVc && vcForBusinessUnit.original?.vc.credentialSubject.businessUnitInfo.contactInfo.contactNumber}</p>
        <p className="title col-span-3">事業者の識別子</p>
        <p className="content col-span-3">{vcForBusinessUnit.isPrivateVc && vcForBusinessUnit.original?.vc.credentialSubject.legalEntityInfo.legalEntityIdentifier}</p>
        <p className="title col-span-3">事業者名</p>
        <p className="content col-span-3">{vcForBusinessUnit.isPrivateVc && vcForBusinessUnit.original?.vc.credentialSubject.legalEntityInfo.legalEntityName}</p>
        <p className="title col-span-3">事業者の所在地</p>
        <p className="content col-span-3 mb-8">{vcForBusinessUnit.isPrivateVc && vcForBusinessUnit.original?.vc.credentialSubject.legalEntityInfo.location}</p>
      </div>
    </div>
  )
}
export default VerifiableCredential