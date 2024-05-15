export const dynamic = 'force-dynamic'
import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/app/db'
import { Proof } from '@/types'
import * as multibase from 'multibase'
import nacl from 'tweetnacl'
import naclUtil from 'tweetnacl-util'
import { ContractVpStatusType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contractIdString = searchParams.get('contractId')
    const businessUnitIdString = searchParams.get('businessUnitId')

    if (!contractIdString) return NextResponse.json({ error: 'クエリパラメータにContractのID（?contractId=○○）を入れてください' }, { status: 400 })
    if (!businessUnitIdString) return NextResponse.json({ error: 'クエリパラメータにBusinessUnitのID（?businessUnitId=○○）を入れてください' }, { status: 400 })

    const contractId = parseInt(contractIdString, 10)
    const businessUnitId = parseInt(businessUnitIdString, 10)

    const contract = await prisma.contract.findUnique({
      where: {
        id: contractId
      },
      include: {
        contractVps: {
          include: {
            contractVpVerificationResult: true
          }
        }
      }
    })

    const contractVp = contract.contractVps
    .filter(vp => vp.businessUnitId === businessUnitId)
    .sort((a, b) => b.validFrom.getTime() - a.validFrom.getTime())[0]
    return NextResponse.json(contractVp, { status: 200 })
  } catch {
    console.error('契約VP取得中にエラーが発生しました:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      businessUnitId: number,
      contractId: number,
      vcId: number,
      challengeVcId: number,
    }

    const { businessUnitId, contractId, vcId, challengeVcId } = body

    const businessUnit = await prisma.businessUnit.findUnique({
      where: {
        id: businessUnitId,
      }
    })

    const contract = await prisma.contract.findUnique({
      where: {
        id: contractId
      }
    })

    const vc = await prisma.vcForBusinessUnit.findUnique({
      where: {
        id: vcId
      },
      include: {
        businessUnit: true
      }
    })

    const challengeVc = await prisma.challengeVc.findUnique({
      where: {
        id: challengeVcId
      },
      include: {
        businessUnit: true
      }
    })

    if (!businessUnit || !contract || !vc || !challengeVc) throw new Error('有効なIDを入力してください')
    if (businessUnitId !== contract.partyAId && businessUnitId !== contract.partyBId) {
      throw new Error(`契約（ID:${contract.id}）に紐付く事業所のIDと事業所ID（ID:${businessUnitId}）が一致しません`)
    }
    if (businessUnitId !== vc.businessUnit.id) throw new Error(`事業所ID（ID:${businessUnitId}）とVCの事業所ID（ID:${vc.businessUnit.id}）が一致しません`)
    if (businessUnitId !== challengeVc.businessUnit.id) throw new Error(`事業所ID（ID:${businessUnitId}）とチャレンジVCの事業所ID（ID:${challengeVc.businessUnit.id}）が一致しません`)

    const vp = {
      keyName: businessUnit.domainName,
      type: ['VerifiablePresentation'],
      vpID: `${businessUnit.prefix}${String(businessUnit.numberOfIssuedVp + 1).padStart(5, '0')}`,
      issuer: { id: businessUnit.did, name: businessUnit.name },
      verifiableCredential: [ vc.original, challengeVc.original ],
      validFrom: new Date().toISOString(),
      validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    }

    const credentialString = JSON.stringify(vp)
    const privateKeyUint8Array = naclUtil.decodeBase64(businessUnit.privateKey)
    const vpUint8Array = new Uint8Array(Buffer.from(credentialString))
    const signature = nacl.sign.detached(vpUint8Array, privateKeyUint8Array)
    const signatureBuffer = multibase.encode('base58btc', signature)
    const signatureValue = Buffer.from(signatureBuffer).toString('utf8')

    const proof: Proof = {
      type: 'Ed25519Signature2018',
      created: new Date().toISOString(),
      proofPurpose: 'assertionMethod',
      verificationMethod: `${businessUnit.did}:${businessUnit.publicKey}#${businessUnit.domainName}`,
      signatureValue: signatureValue,
    }

    const vpString = JSON.stringify({...vp, proof})
    const original = JSON.parse(vpString)

    const newVp = await prisma.contractVp.create({
      data: {
        issuerName: vp.issuer.name,
        issuerId: vp.issuer.id,
        content: credentialString,
        signature: signatureValue,
        validFrom: vp.validFrom,
        validUntil: vp.validUntil,
        challengeVcValidFrom: challengeVc.validFrom.toISOString(),
        challengeVcValidUntil: challengeVc.validUntil.toISOString(),
        challengeVcIssuerId: challengeVc.issuerId,
        challengeVcIssuerName: challengeVc.issuerName,
        challengeVcHolderId: challengeVc.businessUnit.did,
        challengeVcHolderName: challengeVc.businessUnit.name,
        challengeVcContent: challengeVc.content,
        challengeVcSignature: challengeVc.signature,
        challenge: challengeVc.challenge,
        vcValidFrom: vc.original.vc?.validFrom ?? "",
        vcValidUntil:vc.original.vc?.validUntil ?? "",
        vcUuid: vc.original.vc?.credentialSubject?.uuid ?? "",
        vcAuthId: vc.original.vc?.issuer?.id ?? "",
        vcAuthName: vc.original.vc?.issuer?.name ?? "",
        vcAuthCertifierName: vc.original.vc?.credentialSubject?.authenticatorInfo?.digitalCertificateOrganizationCredentialIssuer ?? "",
        vcBusinessUnitId: vc.original.vc?.credentialSubject?.didDocument?.id ?? "",
        vcBusinessUnitName: vc.original.vc?.credentialSubject?.businessUnitInfo?.businessUnitName ?? "",
        vcBusinessUnitCountry: vc.original.vc?.credentialSubject?.businessUnitInfo?.country ?? "",
        vcBusinessUnitAddress: vc.original.vc?.credentialSubject?.businessUnitInfo?.address ?? "",
        vcLegalEntityIdentifier: vc.original.vc?.credentialSubject?.legalEntityInfo?.legalEntityIdentifier ?? "",
        vcLegalEntityName: vc.original.vc?.credentialSubject?.legalEntityInfo?.legalEntityName ?? "",
        vcLegalEntityLocation: vc.original.vc?.credentialSubject?.legalEntityInfo?.location ?? "",
        vcContent: vc.vcContent,
        vcSignature: vc.signature,
        vcIssuerSignature: vc.issuerSignature,
        vcIssuerVpSignature: vc.issuerVpSignature,
        vcIssuerVcSignature: vc.issuerVcSignature,
        vcSignedVcContent: vc.signedVcContent,
        vcSignedVpContent: vc.signedVpContent,
        vcIssuerSignedContent: vc.issuerSignedContent,
        vcIssuerPublicKey: vc.issuerPublicKey,
        vcIssuerUuid: vc.issuerUuid,
        original: original,
        businessUnitId: businessUnitId,
        contractId: contractId,
      }
    })

    await prisma.businessUnit.update({
      where: {
        id: businessUnitId,
      },
      data: {
        numberOfIssuedVp: businessUnit.numberOfIssuedVp + 1
      }
    })

    if (businessUnitId === contract.partyAId) {
      await prisma.contract.update({
        where: {
          id: contractId,
        },
        data: {
          partyAVpStatus: ContractVpStatusType.Created
        }
      })
    } else if (businessUnitId === contract.partyBId) {
      await prisma.contract.update({
        where: {
          id: contractId,
        },
        data: {
          partyBVpStatus: ContractVpStatusType.Created
        }
      })
    }

    return NextResponse.json(newVp, { status :200 })
  } catch(error) {
    console.error('契約VP作成中にエラーが発生しました:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}