export const dynamic = 'force-dynamic'
import { NextResponse, NextRequest } from 'next/server'

// eslint-disable-next-line no-unused-vars
export async function GET(request: NextRequest) {
  // 中小企業庁のサイトからとってくる
  const res = await fetch(`https://jirei-seido-api.mirasapo-plus.go.jp/case_studies?service_category=1%2C2%2CS2%2CS3&limit=10&offset=20`)
  const data = await res.json()
  return NextResponse.json(data, { status: 200 })
}

export async function POST(request: NextRequest) {
  const { message } = (await request.json()) as { message?: string }
  console.log(message);
  // 国土交通省のサイトからとってくる
  const res = await fetch(`https://jirei-seido-api.mirasapo-plus.go.jp/regions`)
  const data = await res.json()
  return NextResponse.json(data, { status: 200 })
}
