import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/admin";
import { isAllowedAdminEmail } from "@/lib/auth/auth";

export async function POST(req: Request) {
  try {
    const { idToken } = (await req.json()) as { idToken?: string };
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const adminAuth = getAuth(getAdminApp());
    const decoded = await adminAuth.verifyIdToken(idToken);

    const email = decoded.email || null;
    if (!isAllowedAdminEmail(email)) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const expiresIn = 1000 * 60 * 60 * 24 * 7;

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
