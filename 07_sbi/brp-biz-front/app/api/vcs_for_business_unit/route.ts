import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/app/db'
import { getServerSession } from 'next-auth'

// eslint-disable-next-line no-unused-vars
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const businessUnitId = url.searchParams.get('businessUnitId');
  if(businessUnitId) {
    const publicVc = await prisma.vcForBusinessUnit.findFirst({
      include: {
        businessUnit: {
          include: {
            legalEntity: true
          }
        }
      },
      where: {
        businessUnitId: Number(businessUnitId),
        isPrivateVc: false,
      },
      orderBy: [
        {
          validFrom: 'desc'
        }
      ]
    })
    const vcs = []
    vcs.push(publicVc)
    return NextResponse.json(vcs, { status: 200 })
  }

  const session = await getServerSession()
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: session?.user?.email! }})
    const privateVc = await prisma.vcForBusinessUnit.findFirst({
      include: {
        businessUnit: {
          include: {
            legalEntity: true
          }
        }
      },
      where: {
        businessUnitId: user.businessUnitId,
        isPrivateVc: true,
      },
      orderBy: [
        {
          validFrom: 'desc'
        }
      ]
    })

    const publicVc = await prisma.vcForBusinessUnit.findFirst({
      include: {
        businessUnit: {
          include: {
            legalEntity: true
          }
        }
      },
      where: {
        businessUnitId: user.businessUnitId,
        isPrivateVc: false,
      },
      orderBy: [
        {
          validFrom: 'desc'
        }
      ]
    })
    const vcs = []
    if(publicVc) vcs.push(publicVc)
    if(privateVc) vcs.push(privateVc)

    return NextResponse.json(vcs, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      issuerName?: string;
      uuid?: string;
      validFrom?: Date;
      validUntil?: Date;
      original: JSON;
      businessUnitId: number;
    }
    const { issuerName, uuid, validFrom, validUntil, original, businessUnitId } = body

    const newVc = await prisma.vcForBusinessUnit.create({
      data: {
        issuerName: issuerName,
        uuid: uuid,
        validFrom: validFrom,
        validUntil: validUntil,
        original: original,
        businessUnitId: businessUnitId,
        isPrivateVc: true,
      }
    })

    return NextResponse.json({ data: newVc }, { status: 200 })

  } catch(error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}