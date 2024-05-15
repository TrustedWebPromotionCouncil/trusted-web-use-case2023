export const dynamic = 'force-dynamic'
import prisma from '@/app/db'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const session = await getServerSession()
    const user = await prisma.user.findUniqueOrThrow({ 
      include: {
        businessUnit: {
          include: {
            trustedListPartners: true,
          }
        }
      },
      where: { email: session?.user?.email!}
    })
    const trustedListPartners = user.businessUnit.trustedListPartners 
    let response = await fetch(`${process.env.BRP_ACCR_PUBLIC_KEY_URL}/api/publicKeyMultibase/vcauth-org-key`)
    let data = await response.json()
    
    console.log("日本公開鍵:", data)
    const jp = trustedListPartners.filter((e: any) => e.publicMultibaseIdentifier === "did:detc:VCAuthOrg")
    if (jp.length !== 0) {
      await prisma.trustedListPartner.update({
        where: {
          id: jp.find((x) => x).id,
        },
        data: {
          obtainedDate: new Date (),
          country: "日本",
          publicMultibaseIdentifier: "did:detc:VCAuthOrg",
          publicMultibaseKey: data.publicKeyMultibase,
          businessUnitId: user.businessUnitId
        }
      })
    } else {
      await prisma.trustedListPartner.create({
        data: {
          obtainedDate: new Date (),
          country: "日本",
          publicMultibaseIdentifier: "did:detc:VCAuthOrg",
          publicMultibaseKey: data.publicKeyMultibase,
          businessUnitId: user.businessUnitId
        }
      })
    }

    try {
      response = await fetch("http://uat-tw.detc.link:8080/api/publicKeyMultibase/vcauth-tw-org-key", {
        signal: AbortSignal.timeout(3000)
      })
      data = await response.json()
    } catch {
      data = { publicKeyMultibase: "z2hLAzzsefefwhekwXw1NEEhe99FYttdddddd" }
    }
    console.log("X国公開鍵:", data)
    const tw = trustedListPartners.filter((e: any) => e.publicMultibaseIdentifier === "did:detc:X-VCAuthOrg")
    if (tw.length !== 0) {
      await prisma.trustedListPartner.update({
        where: {
          id: tw.find((x) => x).id,
        },
        data: {
          obtainedDate: new Date (),
          country: "X国",
          publicMultibaseIdentifier: "did:detc:X-VCAuthOrg",
          publicMultibaseKey: data.publicKeyMultibase,
          businessUnitId: user.businessUnitId
        }
      })} else {
        await prisma.trustedListPartner.create({
          data: {
            obtainedDate: new Date (),
            country: "X国",
            publicMultibaseIdentifier: "did:detc:X-VCAuthOrg",
            publicMultibaseKey: data.publicKeyMultibase,
            businessUnitId: user.businessUnitId
          }
        })
      }

  return NextResponse.json({}, { status: 200 })
  } catch(error) {
    console.error('Trusted Listの取得が失敗しました: ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET()  {
  try {
    const session = await getServerSession()
    const user = await prisma.user.findUniqueOrThrow({ 
      include: {
        businessUnit: true
      },
      where: { email: session?.user?.email!}})

    const response = await prisma.trustedListPartner.findMany({
      where: {
        businessUnitId: user.businessUnitId
      }
    })

  return NextResponse.json(response, { status: 200 })
  } catch(error) {
    console.error('Trusted Listの取得が失敗しました: ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
