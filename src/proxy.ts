import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Só protege /admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Permite página de login
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Permite API (ela já valida sessão internamente)
  if (pathname.startsWith("/admin/api")) {
    return NextResponse.next();
  }

  // Verifica cookie de sessão
  const session = req.cookies.get("session")?.value;

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};