export const dynamic = 'force-dynamic'
import { NextResponse, NextRequest } from 'next/server'

export async function GET( request: NextRequest,  { params }: { params: { uuid: string } } ) {
  const { uuid } = params

  try {
  const response = await fetch(`${process.env.BRP_WEB_API_URL}/revoke-1/vc-status/${uuid}`)
  const data = await response.json()

  console.log('revoke-1の返却値:', data)

  return NextResponse.json(data, { status: 200 })
  } catch(error) {
    console.error('revoke-1のリクエストに失敗しました:', error)
    console.log('UUID:', uuid)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}