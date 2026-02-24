import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permite acessar a página de login
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Verifica cookie de sessão criado pelo Firebase Admin
  const session = req.cookies.get("session");

  // Se não tiver sessão, redireciona para login
  if (!session) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se tiver sessão, continua normalmente
  return NextResponse.next();
}

// IMPORTANTE: limita o middleware apenas ao /admin
export const config = {
  matcher: ["/admin/:path*"],
};