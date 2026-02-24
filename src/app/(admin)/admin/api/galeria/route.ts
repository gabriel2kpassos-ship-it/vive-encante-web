import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getAdminApp } from "@/lib/firebase/admin";
import { isAllowedAdminEmail } from "@/lib/auth/auth";

function getSessionCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function requireAdmin(req: Request) {
  const sessionCookie = getSessionCookie(req);
  if (!sessionCookie) return null;

  const app = getAdminApp();
  const auth = app.auth();
  const decoded = await auth.verifySessionCookie(sessionCookie, true);

  if (!isAllowedAdminEmail(decoded.email || null)) return null;
  return { email: decoded.email };
}

export async function GET(req: Request) {
  const me = await requireAdmin(req);
  if (!me) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const db = getAdminApp().firestore();
  const snap = await db.collection("galeria").orderBy("ordem", "asc").get();

  const items = snap.docs.map(d => {
    const data = d.data();
    delete (data as any).createdAt;
    return { id: d.id, ...data };
  });

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const me = await requireAdmin(req);
  if (!me) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const body = await req.json();
  if (!body?.titulo || !body?.fotoUrl || !body?.fotoPublicId) {
    return NextResponse.json({ error: "Dados obrigatórios ausentes" }, { status: 400 });
  }

  const db = getAdminApp().firestore();
  const id = crypto.randomUUID();

  await db.collection("galeria").doc(id).set({
    titulo: body.titulo.trim(),
    descricao: body.descricao?.trim() || "",
    fotoUrl: body.fotoUrl,
    fotoPublicId: body.fotoPublicId,
    ativo: body.ativo ?? true,
    ordem: Date.now(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true, id });
}
