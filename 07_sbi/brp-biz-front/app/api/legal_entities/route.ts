import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/app/db'

// eslint-disable-next-line no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const legalEntities = await prisma.legalEntity.findMany({
      include: {
        businessUnits: {
          include: {
            vcsForBusinessUnit: true
          }
        }
      }
    })

    return NextResponse.json(legalEntities, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { name: string; color: string };
    const { name, color } = body;

    const newLegalEntity = await prisma.legalEntity.create({
      data: {
        name: name,
        color: color,
      }
    })

    return NextResponse.json({ data: newLegalEntity }, { status: 200 })

  } catch(error) {
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}