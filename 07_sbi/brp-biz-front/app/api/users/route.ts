export const dynamic = 'force-dynamic'
import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// eslint-disable-next-line no-unused-vars
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        businessUnit: {
          include: {
            legalEntity: true
          }
        }
      }
    })
    return NextResponse.json(users, { status: 200 })  
  } catch (e) {
    console.error(e)
    return NextResponse.json({ status: 500 }) 
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name: string;
      email: string;
      password: string;
      businessUnitName: string;
      legalEntityName: string;
      prefix: string;
      color: string;
      domainName: string;
      did: string;
      publicKey: string;
      privateKey: string;
      identifier: string;
    }

    const { name, email, password, businessUnitName, legalEntityName, prefix, color, domainName, did, publicKey, privateKey, identifier } = body
    const newLegalEntity = await prisma.legalEntity.create(
      { data: {
        name: legalEntityName,
        color: color,
        identifier: identifier,
      }})

    const newBusinessUnit = await prisma.businessUnit.create({
      data: {
        name: businessUnitName,
        domainName: domainName,
        prefix: prefix,
        numberOfIssuedVc: 0,
        numberOfIssuedVp: 0,
        did: did,
        publicKey: publicKey,
        privateKey: privateKey,
        legalEntityId: Number(newLegalEntity.id),
      }
    })


    const newUser = await prisma.user.create({
      data: 
      {
        name: name,
        email: email,
        password: bcrypt.hashSync(password, 10),
        businessUnitId: newBusinessUnit.id,
      }})

    return NextResponse.json(newUser, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      userId: number;
      name: string;
      email: string;
      password: string;
      businessUnitName: string;
      legalEntityName: string;
      businessUnitId: number;
      legalEntityId: number;
      color: string;
      domainName:  string;
      prefix: string;
      did: string;
      publicKey: string;
      privateKey: string;
      identifier: string;
    }

    const { userId, name, email, password, businessUnitId, legalEntityId, legalEntityName, businessUnitName, color, domainName, prefix, did, publicKey, privateKey, identifier } = body
    const updatedLegalEntity = await prisma.legalEntity.update({
      where: {
        id: legalEntityId
      },
      data: {
        name: legalEntityName,
        color: color,
        identifier: identifier
      }
    })
    const updatedBusinessUnit = await prisma.businessUnit.update({
      where: {
        id: businessUnitId
      }, 
      data: {
        name: businessUnitName,
        domainName: domainName,
        prefix: prefix,
        did: did,
        publicKey: publicKey,
        privateKey: privateKey,
        legalEntityId: Number(updatedLegalEntity.id),
      }
    })

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      }, 
      data: {
        name: name,
        email: email,
        password: bcrypt.hashSync(password, 10),
        businessUnitId: updatedBusinessUnit.id,
      }
    })


    return NextResponse.json(updatedUser, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}