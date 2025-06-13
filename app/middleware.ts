import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Bypass authentication checks - allow all access
  return res

  /* Authentication temporarily disabled
  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If user is not signed in and the current path is not /login, redirect to /login
    if (!session && req.nextUrl.pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // If user is signed in and the current path is /login, redirect to /
    if (session && req.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error with Supabase, allow access to login page
    if (req.nextUrl.pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }
  */

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
