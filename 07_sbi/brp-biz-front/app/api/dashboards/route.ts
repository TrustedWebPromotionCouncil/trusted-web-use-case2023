export const dynamic = 'force-dynamic'
import { NextResponse, NextRequest } from 'next/server'

// eslint-disable-next-line no-unused-vars
export async function GET(request: NextRequest) {
  return NextResponse.json('ok', { status: 200 })
}
