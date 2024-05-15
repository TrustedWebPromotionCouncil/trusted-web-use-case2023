export const dynamic = 'force-dynamic'
import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/app/db'
import { randomUUID } from 'crypto'
import { ContractVpStatusType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      contractId: number,
      businessUnitId: number,
    }

    const { contractId, businessUnitId } = body

    const contract = await prisma.contract.findUnique({
      where: {
        id: contractId
      }
    })

    if (!contract) throw new Error(`有効なContractID（ID:${contractId}ではありません`)
    if (businessUnitId !== contract.partyAId && businessUnitId !== contract.partyBId) {
      throw new Error(`契約（ID:${contract.id}）に紐付く事業所ID（ID:${businessUnitId}）が一致しません`)
    }
    const isPartyA = businessUnitId === contract.partyAId
    const challenge = randomUUID()

    if (isPartyA) {
      const newContact = await prisma.contract.update({
        where: {
          id: contractId
        },
        data : {
          partyAChallenge: challenge,
          partyBVpStatus: ContractVpStatusType.Requested
        }
      })

      return NextResponse.json(newContact, { status :200 })
    } else {
      const newContract = await prisma.contract.update({
        where: {
          id: contractId
        },
        data: {
          partyBChallenge: challenge,
          partyAVpStatus: ContractVpStatusType.Requested
        }
      })

      return NextResponse.json(newContract, { status :200 })
    }

  } catch(error) {
    console.error('challenge取得中にエラーが発生しました:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}