import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/app/db'
import { ShippingStatusType, Rank } from '@prisma/client'
import { getServerSession } from 'next-auth'

const include = {
  shippingFor: {
    include: {
      legalEntity: true
    }
  },
  vp: {
    include: {
      verificationResult: true,
    }
  },
  lot: {
    include: {
      vcForProduct: true,
      product: {
        include: {
          businessUnit: {
            include: {
              legalEntity: true
            }
          }
        }
      }
    }
  }
}

// eslint-disable-next-line no-unused-vars
export async function GET(request: NextRequest) {
  const session = await getServerSession()
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: session?.user?.email! }})
    const productIds = await prisma.product.findMany({ where: { businessUnitId: user.businessUnitId }, select: { id: true }})
    const lotIds = await prisma.lot.findMany({ where: { productId: { in: productIds.map(productId => productId.id)} }, select: { id: true }})
    const orders = await prisma.order.findMany({
      include,
      where: {
        lotId: { in: lotIds.map(lotId => lotId.id) }
      }
    })

    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      businessUnitId: number
      shippingDate?: Date
      lotId: number
      quality: Rank
      status: ShippingStatusType
    }
    const { businessUnitId, shippingDate, lotId, quality, status } = body

    const newOrder = await prisma.order.create({
      data: {
        shippingForId: businessUnitId,
        shippingDate: shippingDate,
        lotId: lotId,
        quality: quality,
        status: status,
      }
    })

    return NextResponse.json({ data: newOrder }, { status: 200 })

  } catch(error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      orderId?: number
      quality?: Rank
      status?: ShippingStatusType
      shippingDate?: Date
    }

    const { orderId, quality, status, shippingDate } = body

    const newStatus = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        quality: quality,
        status: status,
        shippingDate: shippingDate
      }
    })
    
    return NextResponse.json({data: newStatus}, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
}}