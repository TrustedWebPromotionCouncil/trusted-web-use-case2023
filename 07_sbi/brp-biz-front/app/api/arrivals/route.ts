import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/app/db'

const include = {
  shippingFor: {
    include: {
      legalEntity: true
    }
  },
  vp: {
    include: {
      verificationResult: true
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
    const orders = await prisma.order.findMany({
      include,
      where: {
        shippingForId: user.businessUnitId
      }
    })

    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}
