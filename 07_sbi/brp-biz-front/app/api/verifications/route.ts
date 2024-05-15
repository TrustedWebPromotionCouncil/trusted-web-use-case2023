export const dynamic = 'force-dynamic'
import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/app/db'
import * as multibase from 'multibase'
import nacl from 'tweetnacl'
import naclUtil from 'tweetnacl-util'
import { ContractVpStatusType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      type: string,
      vpId?: number,
      contractVpId?: number,
    } 

    const { type, vpId, contractVpId } = body

    let result
    if (type !== 'vp' && type !== 'contractVp') throw new Error('有効なtypeを入力してください')
    if (!vpId && !contractVpId) throw new Error(`検証のため${type === 'vp' ? 'vpId' : 'contractVpId'}を入力してください`)
    if (type === 'vp') {
      if (!vpId) throw new Error('有効なvpIdを入力してください')
      result = verifyVp(vpId)
    }
    else {
      if (!contractVpId) throw new Error('有効なcontractVpIdを入力してください')
      result = verifyContractVp(contractVpId)
    }

    return NextResponse.json({data: result}, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}


// VP検証モジュール
async function verifyVp(vpId: number) {
  const vp = await prisma.vp.findUnique({
    where: { id: vpId },
    include: {
      order: {
        include: {
          lot: {
            include: {
              product: {
                include: {
                  businessUnit: {
                    include: {
                      vcsForBusinessUnit: true
                    }
                  }
                }
              }
            }
          }
        }
      },
    }
  })

  if (!vp) throw new Error(`orderIdの値が不正です（ID:${vpId}）`)

  const vc = vp.order.lot.product.businessUnit.vcsForBusinessUnit[0]

  const hasValidBusinessUnitSignature = isValidSignature(vp.signature, vp.original, vp.order.lot.product.businessUnit.publicKey, "")
  const hasValidVcForBusinessUnit = isValidSignature(vc.signature, vc.vcContent, vp.order.lot.product.businessUnit.publicKey, "")
  const hasValidIssuerSignature = isValidSignature(vc.issuerSignature, vc.signedVcContent, "", vc.issuerPublicKey)
  const hasValidIssuerVc = isValidSignature(vc.issuerVpSignature, vc.signedVpContent, "", vc.issuerPublicKey)
  const hasValidBusinessUnitCredentialStatus = await revoke(vc.uuid)
  const hasValidIssuerCredentialStatus = await revoke(vc.issuerUuid)

  const verificationResult = await prisma.verificationResult.create({
    data: {
      date: new Date(),
      hasValidBusinessUnitSignature: hasValidBusinessUnitSignature,
      hasValidVcForBusinessUnit: hasValidVcForBusinessUnit,
      hasValidIssuerSignature: hasValidIssuerSignature,
      hasValidIssuerVc: hasValidIssuerVc,
      hasValidBusinessUnitCredentialStatus: hasValidBusinessUnitCredentialStatus,
      hasValidIssuerCredentialStatus: hasValidIssuerCredentialStatus,
      vpId: vpId,
    }
  })

  return verificationResult
}

// 契約VP検証モジュール
async function verifyContractVp(contractVpId: number) {
  const contractVp = await prisma.contractVp.findUnique({
    where: {
      id: contractVpId
    },
    include: {
      businessUnit: true,
      contract: true,
    }
  })

  if (!contractVp) throw new Error(`contractVpIdの値が不正です（ID:${contractVpId}）`)

  const businessUnitIsPartyA = contractVp.contract.partyAId === contractVp.businessUnit.id

  const hasValidChallengeVc = isValidSignature(contractVp.challengeVcSignature, contractVp.challengeVcContent, contractVp.businessUnit.publicKey, '')
  const hasOpponentChallenge = businessUnitIsPartyA ? contractVp.contract.partyBChallenge === contractVp.challenge : contractVp.contract.partyAChallenge === contractVp.challenge
  const hasValidVp = isValidSignature(contractVp.signature, contractVp.content, contractVp.businessUnit.publicKey, '')
  const hasValidVcForBusinessUnit = isValidSignature(contractVp.vcSignature, contractVp.vcContent, contractVp.businessUnit.publicKey, '')
  const hasValidIssuerVp = isValidSignature(contractVp.vcIssuerSignature, contractVp.vcSignedVcContent, '', contractVp.vcIssuerPublicKey)
  const hasValidIssuerVc = isValidSignature(contractVp.vcIssuerVpSignature, contractVp.vcSignedVpContent, '', contractVp.vcIssuerPublicKey)
  const hasValidBusinessUnitCredentialStatus = await revoke(contractVp.vcUuid)
  const hasValidIssuerCredentialStatus = await revoke(contractVp.vcIssuerUuid)

  const verificationResult = await prisma.contractVpVerificationResult.create({
    data: {
      date: new Date(),
      hasValidChallengeVc: hasValidChallengeVc,
      hasOpponentChallenge: hasOpponentChallenge,
      hasValidVp: hasValidVp,
      hasValidVcForBusinessUnit: hasValidVcForBusinessUnit,
      hasValidIssuerVp: hasValidIssuerVp,
      hasValidIssuerVc: hasValidIssuerVc,
      hasValidBusinessUnitCredentialStatus: hasValidBusinessUnitCredentialStatus,
      hasValidIssuerCredentialStatus: hasValidIssuerCredentialStatus,
      contractVpId: contractVpId,
    }
  })

  if (contractVp.businessUnitId === contractVp.contract.partyAId) {
    await prisma.contract.update({
      where: {
        id: contractVp.contractId
      },
      data: {
        partyAVpStatus: ContractVpStatusType.Verified
      }
    })
  } else if (contractVp.businessUnitId === contractVp.contract.partyBId) {
    await prisma.contract.update({
      where: {
        id: contractVp.contractId
      },
      data: {
        partyBVpStatus: ContractVpStatusType.Verified
      }
    })
  }

  return verificationResult
}

function isValidSignature(signatureBase58btc: string, originalBaseJson: string, publicKeyBase64: string, publicKeyBase58btc: string) {
  if ((publicKeyBase64 && publicKeyBase58btc) || (!publicKeyBase64 && !publicKeyBase58btc)) throw new Error("正しい公開鍵を指定してください。publicKeyBase64 または publicKeyBase58btc のいずれか一方のみが必要です。")
  try {
    const signatureUint8Array = multibase.decode(signatureBase58btc)
    const credentialUint8Array = new Uint8Array(Buffer.from(originalBaseJson))
    const publicKeyUint8Array = publicKeyBase64 === '' ? multibase.decode(publicKeyBase58btc) :naclUtil.decodeBase64(publicKeyBase64)
    return nacl.sign.detached.verify(credentialUint8Array, signatureUint8Array, publicKeyUint8Array)
  } catch (error) {
    console.error('Signature検証時にエラーが発生しました:', error)
    console.log('signature:', signatureBase58btc)
    console.log('original:', originalBaseJson)
    console.log('public key base64:', publicKeyBase64)
    console.log('public key base58btc:', publicKeyBase58btc)
    return false
  }
}

async function revoke(uuid: string) {
  try {
    const response = await fetch(`${process.env.BRP_WEB_API_URL}/revoke-1/vc-status/${uuid}`)
    const data = await response.json()

    return data.status === 'Valid'
  } catch(error) {
    console.error(`revokeリクエストに失敗しました:`, error)
    console.log('uuid:', uuid)
    return false
  }
}