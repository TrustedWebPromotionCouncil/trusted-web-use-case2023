export const dynamic = 'force-dynamic'
import { NextResponse, NextRequest } from 'next/server'
import prisma from '../../../db'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      productId: number,
    }
    const { productId } = body
    const newVc = await prisma.vcForProduct.create({
      data: {
        issuerName: 'デジタル認証機構',
        validFrom: new Date,
        validUntil: new Date,
        original: JSON.parse('{issuerName:デジタル認証機構}'),
        productId: productId,
      }
    })
    return NextResponse.json(newVc, { status :200 })
  } catch(error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}