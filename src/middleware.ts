import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {

  const { pathname } = req.nextUrl;

  // permite acessar login
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // verifica sessão
  const session = req.cookies.get("session");

  if (!session) {

    const url = new URL("/admin/login", req.url);

    url.searchParams.set("next", pathname);

    return NextResponse.redirect(url);

  }

  return NextResponse.next();
}


// MUITO IMPORTANTE
export const config = {
  matcher: ["/admin/:path*"],
};