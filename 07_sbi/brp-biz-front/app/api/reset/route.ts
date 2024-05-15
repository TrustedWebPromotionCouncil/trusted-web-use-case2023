import { NextResponse } from 'next/server'
import prisma from '@/app/db'
import { getServerSession } from 'next-auth'
import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

export async function GET() {
  try {
    const session = await getServerSession()
    const user = await prisma.user.findUniqueOrThrow({ where: { email: session?.user?.email! }})
    if(!user) throw new Error(`このユーザーはデータベースをリセットできません`)
    
    const { stdout, stderr } = await execPromise('yarn reset-db')
    console.log(stdout)
    if (stderr) {
      console.error(stderr)
    } else {
      console.log('----------データベースのデータリセットを行いました----------')
    }
    return NextResponse.json({ message: 'Script executed successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error executing script:', error)
    return NextResponse.json({ message: 'Error executing script', error }, { status: 500 })
  }
}
