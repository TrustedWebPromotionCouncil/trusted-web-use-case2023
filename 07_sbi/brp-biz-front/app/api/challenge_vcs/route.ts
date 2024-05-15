export const dynamic = 'force-dynamic'
import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/app/db'
import { Proof } from '@/types'
import * as multibase from 'multibase'
import nacl from 'tweetnacl'
import naclUtil from 'tweetnacl-util'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      selfBusinessUnitId: number,
      contractId: number,
    }

    const { selfBusinessUnitId, contractId } = body

    const businessUnit = await prisma.businessUnit.findUnique({
      where: {
        id: selfBusinessUnitId
      }
    })

    if (!businessUnit) throw Error(`有効なBusinessUnitID（ID:${selfBusinessUnitId}）ではありません`)

    const contract = await prisma.contract.findUnique({
      where: {
        id: contractId
      }
    })

    if (!contract) throw new Error(`有効なContractID（ID:${contractId}ではありません`)
    if (contract.partyAId !== selfBusinessUnitId && contract.partyBId !== selfBusinessUnitId) throw new Error(`有効なBusinessUnitID（ID:${selfBusinessUnitId}）、ContractID（ID:${contractId}）ではありません`)

    const isPartyA = selfBusinessUnitId === contract.partyAId
    const opponentChallenge = isPartyA ? contract.partyBChallenge : contract.partyAChallenge

    if (!opponentChallenge) throw new Error(`この契約（ID:${contractId}）の相手（${isPartyA ? 'PartyB' : 'PartyA'}）事業所（ID:${isPartyA ? contract.partyBId : contract.partyAId}）はチャレンジを取得していません`)

    const challengeVc = {
      "@context": [
        "https://www.w3.org/2018/credentials/examples/v1"
      ],
      id: `${businessUnit.prefix}${String(businessUnit.numberOfIssuedVc + 1).padStart(5, '0')}`,
      type: [
        "VerifiableCredential"
      ],
      credentialSubject: {
        didDocument: {
          "@context": "https://w3id.org/did/v1",
          id: businessUnit.did,
          verificationMethod: [
            {
              id: `${businessUnit.did}#${businessUnit.domainName}`,
              type: "Ed25519VerificationKey2018",
              controller: businessUnit.did,
              publicKeyMultibase: businessUnit.publicKey
            }
          ]
        },
        challenge: opponentChallenge
      },
      issuer: {
        id: businessUnit.did,
        name: businessUnit.name
      },
      validFrom: new Date().toISOString(),
      validUntil: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
    }

    const credentialString = JSON.stringify(challengeVc)
    const privateKeyUint8Array = naclUtil.decodeBase64(businessUnit.privateKey)
    const messageUint8Array = new Uint8Array(Buffer.from(credentialString))
    const signature = nacl.sign.detached(messageUint8Array, privateKeyUint8Array)
    const signatureBuffer = multibase.encode('base58btc', signature)
    const signatureValue = Buffer.from(signatureBuffer).toString('utf8')

    const proof: Proof = {
      type: 'Ed25519Signature2018',
      created: new Date().toISOString(),
      proofPurpose: 'assertionMethod',
      verificationMethod: `${businessUnit.did}:${businessUnit.publicKey}#${businessUnit.domainName}`,
      signatureValue: signatureValue,
    }

    const vcString = JSON.stringify({...challengeVc, proof})
    const original = JSON.parse(vcString)

    const newVc = await prisma.challengeVc.create({
      data: {
        challenge: opponentChallenge,
        issuerName: challengeVc.issuer.name,
        issuerId: challengeVc.issuer.id,
        content: credentialString,
        signature: signatureValue,
        validFrom: challengeVc.validFrom,
        validUntil: challengeVc.validUntil,
        original: original,
        businessUnitId: selfBusinessUnitId,
        contractId: contractId,
      }
    })

    await prisma.businessUnit.update({
      where: {
        id: selfBusinessUnitId,
      },
      data: {
        numberOfIssuedVc: businessUnit.numberOfIssuedVc + 1
      }
    })

    return NextResponse.json(newVc, { status :200 })
  } catch(error) {
    console.error('VP作成中にエラーが発生しました:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}