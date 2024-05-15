import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/app/db'
import { ContractDocumentStatusType } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const idString = searchParams.get('id')

  if (!idString) return NextResponse.json({ error: 'クエリパラメータにBusinessUnitのID（?id=○○）を入れてください' }, { status: 400 })

  const id = parseInt(idString, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'BusinessUnitIDは整数で入力してください' }, { status: 400 })

  try {
    const contracts = await prisma.contract.findMany({
      where: {
        OR: [
          { partyAId: id },
          { partyBId: id }
        ]
      },
      include: {
        partyA: {
          include: {
            legalEntity: true,
          }
        },
        partyB: {
          include: {
            legalEntity: true,
          }
        },

        contractVps: true,
        challengeVcs: true,
      }
    })

    return NextResponse.json(contracts, { status: 200 })

  } catch (error) {
    console.error('Contractsの取得中にエラーが発生しました:', error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try{
    const body = (await request.json() as {
      contractId: number,
      contractDate: Date,
      contractDocumentStatus: ContractDocumentStatusType,
    })
    const { contractId, contractDate, contractDocumentStatus } = body

    const updatedContract = await prisma.contract.update({
      where: {
        id: contractId
      },
      data : {
        contractDate: contractDate,
        contractDocumentStatus: contractDocumentStatus,
      }
    })

    return NextResponse.json(updatedContract, {status:200})
  } catch(error) {
    console.error('Contractsの更新中にエラーが発生しました:', error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}