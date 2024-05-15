export const dynamic = 'force-dynamic'
import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/app/db'
import { Credential, Proof } from '@/types'
import * as multibase from 'multibase'
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    authenticationLevel: string,
    businessUnitName: string,
    businessUnitCountry: string,
    businessUnitAddress: string,
    contactName: string,
    contactDepartment: string,
    contactJobTitle: string,
    contactNumber: string,
    legalEntityId: string,
    legalEntityName: string,
    legalEntityLocation: string,
    businessUnitId: number,
    isPrivateVc: boolean,
  }
  
  const {
    authenticationLevel,
    businessUnitName,
    businessUnitCountry,
    businessUnitAddress,
    contactName,
    contactDepartment,
    contactJobTitle,
    contactNumber,
    legalEntityId,
    legalEntityName,
    legalEntityLocation,
    businessUnitId,
    isPrivateVc,
  } = body

  const businessUnit = await prisma.businessUnit.findUnique({
    where: {
      id: businessUnitId,
    }
  })

  let res = await fetch(`${process.env.BRP_WEB_API_URL}/authority-1/challenge`)
  const challengeData = await res.json()
  const authId = challengeData.authId
  const challenge = challengeData.challenge
  console.log(challengeData)

  const publicKeyBuffer = Buffer.from(businessUnit.publicKey, 'base64');
  const publicKeyBase58btc = multibase.encode('base58btc', publicKeyBuffer);
  const publicKey = Buffer.from(publicKeyBase58btc).toString();

  const vc = {
    keyName: businessUnit.domainName,
    vcID: `${businessUnit.prefix}${String(businessUnit.numberOfIssuedVc + 1).padStart(5, '0')}`,
    issuerId: "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
    issuerName: "JP Digital Certificate Organization 1",
    credentialSubject: {
      didDocument: {
        "@context":"https://w3id.org/did/v1",
        id:businessUnit.did,
        verificationMethod: [
          {
            "id":`${businessUnit.did}#${businessUnit.domainName}`,
            "type":"Ed25519VerificationKey2018",
            "controller":businessUnit.did,
            "publicKeyMultibase": publicKey,
          }
        ]
      },
      "businessUnitInfo": {
        "businessUnitName": businessUnitName,
        "country": businessUnitCountry,
        "address": businessUnitAddress,
        "contactInfo": {
          "name": contactName,
          "department": contactDepartment,
          "jobTitle": contactJobTitle,
          "contactNumber": contactNumber
        }
      },
      "legalEntityInfo": {
        "legalEntityIdentifier":legalEntityId,
        "legalEntityName":legalEntityName,
        "location":legalEntityLocation
      },
      "authenticationLevel": authenticationLevel,
      "challenge": challenge
    }
  }

  const credential: Credential = {
    "@context": ['https://www.w3.org/2018/credentials/v2'],
    id: vc.vcID,
    type: ['VerifiableCredential'],
    credentialSubject: vc.credentialSubject,
    issuer: { id: vc.issuerId, name: vc.issuerName },
    validFrom: new Date().toISOString(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
  }
  const credentialString = JSON.stringify(credential)
  const privateKeyUint8Array = naclUtil.decodeBase64(businessUnit.privateKey)
  const messageUint8Array = new Uint8Array(Buffer.from(credentialString))
  const signature = nacl.sign.detached(messageUint8Array, privateKeyUint8Array)
  const signatureBuffer = multibase.encode('base58btc', signature)
  const signatureValue = Buffer.from(signatureBuffer).toString('utf8')

  const proof: Proof = {
    type: 'Ed25519Signature2018',
    created: new Date().toISOString(),
    proofPurpose: 'assertionMethod',
    verificationMethod: `${vc.issuerId}#${vc.keyName}`,
    signatureValue: signatureValue,
  }
  const vcString = JSON.stringify({ ...credential, proof })
  console.log('リクエストボディ:', vcString)

  res = await fetch(`${process.env.BRP_WEB_API_URL}/authority-1/vc-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'TTW-Auth-Id': authId
    },
    body: vcString,
  })
  if (!res.ok) {
    console.error('VCの発行に失敗しました', res)
    return NextResponse.json(res, { status: 500 })
  }

  await prisma.businessUnit.update({
    where: {
      id: businessUnitId,
    },
    data: {
      numberOfIssuedVc: businessUnit.numberOfIssuedVc + 1
    }
  })
  const text = await res.text()
  console.log('VC発行リクエストの返却値:', text)

  const data = JSON.parse(text)
  const issuerName = data.vc?.issuer?.name ?? ''
  const uuid = data.vc?.credentialSubject?.uuid ?? ''
  const issuerUuid = data.vc?.credentialSubject?.linkedVP?.verifiableCredential[0]?.credentialSubject?.uuid ?? ''
  const vcSignature = data.vc?.proof?.signatureValue ?? ''
  const issuerVpSignature = data.vc?.credentialSubject?.linkedVP?.proof[0]?.signatureValue ?? ''
  const issuerVcSignature = data.vc?.credentialSubject?.linkedVP?.verifiableCredential[0]?.proof?.signatureValue ?? ''
  const issuerPublicKey = data.vc?.credentialSubject?.linkedVP?.verifiableCredential[0]?.credentialSubject?.didDocument?.verificationMethod[0]?.publicKeyMultibase ?? ''
  const validFrom = data.vc?.validFrom
  const validUntil = data.vc?.validUntil

  const newVc = await prisma.vcForBusinessUnit.create({
    data: {
      authenticationLevel: parseInt(authenticationLevel, 10),
      vcContent: credentialString,
      signature: signatureValue,
      uuid: uuid,
      issuerName: issuerName,
      issuerUuid: issuerUuid,
      issuerSignature: vcSignature,
      issuerVpSignature: issuerVpSignature,
      issuerVcSignature: issuerVcSignature,
      signedVcContent: createSignedVcContent(text),
      signedVpContent: createSignedVpContent(text),
      issuerSignedContent: createIssuerSignedContent(text),
      issuerPublicKey: issuerPublicKey,
      validFrom: validFrom,
      validUntil: validUntil,
      original: data,
      businessUnitId: businessUnitId,
      isPrivateVc: isPrivateVc,
    }
  })
  return NextResponse.json(newVc, { status: 200 })
}

function createSignedVcContent(text: string): string {
  try {
    const vcIndex = text.indexOf('"vc":')
    if (vcIndex === -1) throw new Error('VCが見つかりません')

    let braceCount = 0
    let startIndex = -1
    let endIndex = -1
    for (let i = vcIndex; i < text.length; i++) {
      if (text[i] === '{') {
        braceCount++
        if (startIndex === -1) startIndex = i
      } else if (text[i] === '}') {
        braceCount--
        if (braceCount === 0 && startIndex !== -1) {
          endIndex = i
          break
        }
      }
    }

    if (startIndex === -1 || endIndex === -1) throw new Error('有効なJSON文字列ではありません')

    let vcContent = text.slice(startIndex, endIndex + 1)

    const proofIndex = vcContent.lastIndexOf('"proof":')
    if (proofIndex !== -1) {
      let proofBraceCount = 0
      let proofEndIndex = -1
      for (let i = proofIndex; i < vcContent.length; i++) {
        if (vcContent[i] === '{') proofBraceCount++
        else if (vcContent[i] === '}') {
          proofBraceCount--
          if (proofBraceCount === 0) {
            proofEndIndex = i
            break
          }
        }
      }

      if (proofEndIndex !== -1) {
        const beforeProofContent = vcContent.slice(0, proofIndex).replace(/,\s*$/, '')
        const afterProofContent = vcContent.slice(proofEndIndex + 1)
        vcContent = beforeProofContent + afterProofContent
      } else throw new Error('有効なJSON文字列ではありません')
    } else throw new Error('proofが見つかりません')

    return vcContent
  } catch(e) {
    console.error(e)
    return ''
  }
}

function createSignedVpContent(text: string): string {
  try {
    const vpIndex = text.indexOf('"linkedVP":')
    if (vpIndex === -1) throw new Error('linkedVPが見つかりません')

    let braceCount = 0, startIndex = -1, endIndex = -1
    for (let i = vpIndex; i < text.length; i++) {
      if (text[i] === '{' && (startIndex === -1 ? startIndex = i : true)) braceCount++
      else if (text[i] === '}' && !--braceCount && startIndex !== -1) { endIndex = i; break }
    }

    if (startIndex === -1 || endIndex === -1) throw new Error('有効なJSON文字列ではありません')

    let vpContent = text.slice(startIndex, endIndex + 1)

    const proofIndex = vpContent.lastIndexOf('"proof":')
    if (proofIndex !== -1) {
      let proofBraceCount = 0, proofEndIndex = -1
      for (let i = proofIndex; i < vpContent.length; i++) {
        if (vpContent[i] === '[') proofBraceCount++
        else if (vpContent[i] === ']' && !--proofBraceCount) { proofEndIndex = i; break }
      }

      if (proofEndIndex !== -1) {
        vpContent = vpContent.slice(0, proofIndex).replace(/,\s*$/, '') + vpContent.slice(proofEndIndex + 1)
      } else throw new Error('有効なJSON文字列ではありません')
    } else throw new Error('proofが見つかりません')

    return vpContent
  } catch(e) {
    console.error(e)
    return ''
  }
}

function createIssuerSignedContent(text: string): string {
  try {
    const vpIndex = text.indexOf('"verifiableCredential":[')
    if (vpIndex === -1) throw new Error('verifiableCredentialが見つかりません')

    let braceCount = 0, startIndex = -1, endIndex = -1
    for (let i = vpIndex; i < text.length; i++) {
      if (text[i] === '{' && (startIndex === -1 ? startIndex = i : true)) braceCount++
      else if (text[i] === '}' && !--braceCount && startIndex !== -1) { endIndex = i; break }
    }

    if (startIndex === -1 || endIndex === -1) throw new Error('有効なJSON文字列ではありません')

    let vpContent = text.slice(startIndex, endIndex + 1)

    const proofIndex = vpContent.lastIndexOf('"proof":')
    if (proofIndex !== -1) {
      let proofBraceCount = 0, proofEndIndex = -1
      for (let i = proofIndex; i < vpContent.length; i++) {
        if (vpContent[i] === '{') proofBraceCount++
        else if (vpContent[i] === '}' && !--proofBraceCount) { proofEndIndex = i; break }
      }

      if (proofEndIndex !== -1) {
        vpContent = vpContent.slice(0, proofIndex).replace(/,\s*$/, '') + vpContent.slice(proofEndIndex + 1)
      } else throw new Error('有効なJSON文字列ではありません')
    } else throw new Error('proofが見つかりません')

    return vpContent
  } catch(e) {
    console.error(e)
    return ''
  }
}
