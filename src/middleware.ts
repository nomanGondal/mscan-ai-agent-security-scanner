import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { AUTH, UNAUTHORIZED } from "./constants"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const pathname = req.nextUrl.pathname

  if (!token && pathname !== AUTH) {
    return NextResponse.redirect(new URL(AUTH, req.url))
  }

  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL(UNAUTHORIZED, req.url))
  }

  if (pathname.startsWith("/user") && token?.role !== "user") {
    return NextResponse.redirect(new URL(UNAUTHORIZED, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
}
