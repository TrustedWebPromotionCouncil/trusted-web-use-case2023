import NextAuth from 'next-auth'
import { options } from '@/app/options'

const handler = NextAuth(options)

export { 
  handler as GET, 
  handler as POST, 
  handler as PUT, 
  handler as PATCH, 
  handler as DELETE 
}
