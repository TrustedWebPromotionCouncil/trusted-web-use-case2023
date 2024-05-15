import { NextResponse, NextRequest } from 'next/server'
import prisma from '../../db'

// eslint-disable-next-line no-unused-vars
export async function GET(request: NextRequest) {
	try {
		const products = await prisma.product.findMany({
			include: {
				businessUnit: {
					include: {
						legalEntity: true,
					}
				},
				lots: true,
			}
		})

		return NextResponse.json(products, { status: 200 })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
	}
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
			productName: string,
			productNumber: string,
			lotName: string,
			lotNumber: number,
		}
    const { productName, productNumber, lotName, lotNumber } = body

		const newProduct = await prisma.product.create({
			data: {
				name: productName,
				number: productNumber,
				businessUnitId: 1,
			}
		})

		await prisma.lot.create({
			data: {
				name: lotName,
				number: lotNumber,
				productId: newProduct.id,
			}
		})

		return NextResponse.json({ data: newProduct }, { status: 200 })

	} catch(error) {
		console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
	}
}