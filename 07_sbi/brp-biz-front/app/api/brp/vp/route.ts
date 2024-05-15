export const dynamic = 'force-dynamic'
import { NextResponse, NextRequest } from 'next/server'
import prisma from '../../../db'
import * as multibase from 'multibase'
import nacl from 'tweetnacl'
import naclUtil from 'tweetnacl-util'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      businessUnitId: number,
      did: string,
      orderId: number,
      vc: any,
    }

    const { businessUnitId, orderId, vc } = body

    const businessUnit = await prisma.businessUnit.findUnique({
      where: {
        id: businessUnitId,
      }
    })

    const vp = {
      keyName: businessUnit.domainName,
      type: ['VerifiablePresentation'],
      vpID: `${businessUnit.prefix}${String(businessUnit.numberOfIssuedVp + 1).padStart(5, '0')}`,
      issuer: { id: businessUnit.did, name: businessUnit.name },
      verifiableCredential: [vc],
      validFrom: new Date().toISOString(),
      validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    }

    const privateKeyUint8Array = naclUtil.decodeBase64(businessUnit.privateKey)
    const vpUint8Array = new Uint8Array(Buffer.from(JSON.stringify(vp)))
    const signature = nacl.sign.detached(vpUint8Array, privateKeyUint8Array)
    const signatureBuffer = multibase.encode('base58btc', signature)
    const signatureValue = Buffer.from(signatureBuffer).toString('utf8')

    await prisma.businessUnit.update({
      where: {
        id: businessUnitId,
      },
      data: {
        numberOfIssuedVp: businessUnit.numberOfIssuedVp + 1
      }
    })

    const newVp = await prisma.vp.create({
      data: {
        original: JSON.stringify(vp),
        signature: signatureValue,
        orderId: orderId,
      }
    })

    return NextResponse.json(newVp, { status :200 })
  } catch(error) {
    console.error('VP作成中にエラーが発生しました:', error)
    throw error
  }
}