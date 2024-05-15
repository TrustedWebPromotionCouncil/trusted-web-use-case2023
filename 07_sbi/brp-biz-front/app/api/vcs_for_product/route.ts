import { NextResponse, NextRequest } from 'next/server'
import prisma from '../../db'

// eslint-disable-next-line no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const vcs = await prisma.vcForProduct.findMany({
      include: {
        product: true,
				lots: true,
      }
    })

    return NextResponse.json(vcs, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}
