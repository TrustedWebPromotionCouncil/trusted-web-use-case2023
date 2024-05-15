// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// export { default } from 'next-auth/middleware';
 
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL('/', request.url))
// }
 
// // See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!register|api|login).*)"],
}