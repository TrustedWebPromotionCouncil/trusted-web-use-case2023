import prisma from '@/app/db'
import { NextResponse, NextRequest } from 'next/server'

// eslint-disable-next-line no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const businessUnits = await prisma.businessUnit.findMany({
      include: {
        legalEntity: true
      }
    })

    return NextResponse.json(businessUnits, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name: string;
      address?: string;
      legalEntityId: number;

    };
    const { name, address, legalEntityId } = body;

    const newBusinessUnit = await prisma.businessUnit.create({
      data: {
        name: name,
        address: address,
        legalEntityId: legalEntityId,
      }
    })

    return NextResponse.json({ data: newBusinessUnit }, { status: 200 })

  } catch(error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      businessUnitId?: number
      name?: string;
      address?: string;
    }

    const { businessUnitId, name, address } = body

    const newStatus = await prisma.businessUnit.update({
      where: {
        id: businessUnitId
      },
      data: {
        name: name,
        address: address,
      }
    })
    
    return NextResponse.json({data: newStatus}, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
}}



