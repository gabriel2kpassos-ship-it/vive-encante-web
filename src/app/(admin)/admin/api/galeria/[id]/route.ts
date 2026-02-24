import { NextResponse } from "next/server";
import { getAdminApp } from "@/lib/firebase/admin";
import { isAllowedAdminEmail } from "@/lib/auth/auth";
import admin from "firebase-admin";

/* ================= AUTH ================= */

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

  const email = decoded.email || null;
  if (!isAllowedAdminEmail(email)) return null;

  return { email };
}

/* ================= UTILS ================= */

function serializeTimestampToMillis(value: unknown): number | null {
  if (!value) return null;
  const v = value as { toMillis?: () => number; seconds?: number } | null;
  if (v && typeof v.toMillis === "function") return v.toMillis();
  if (v && typeof v.seconds === "number") return v.seconds * 1000;
  return null;
}

function toBool(v: unknown, fallback: boolean) {
  return typeof v === "boolean" ? v : fallback;
}

function toStr(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

/* ================= GET (1 ITEM) ================= */

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const me = await requireAdmin(req);
    if (!me) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const { id } = await ctx.params;

    const app = getAdminApp();
    const db = app.firestore();

    const doc = await db.collection("galeria").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data = doc.data() as Record<string, unknown>;

    const item = {
      id: doc.id,
      titulo: toStr(data.titulo, ""),
      descricao: toStr(data.descricao, "") || undefined,
      ativo: toBool(data.ativo, true),
      fotoUrl: toStr(data.fotoUrl, ""),
      fotoPublicId: toStr(data.fotoPublicId, ""),
      createdAt: serializeTimestampToMillis(data.createdAt),
    };

    return NextResponse.json({ item });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro" }, { status: 500 });
  }
}

/* ================= PATCH (UPDATE) ================= */

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const me = await requireAdmin(req);
    if (!me) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const { id } = await ctx.params;
    const body = (await req.json()) as Record<string, unknown>;

    const app = getAdminApp();
    const db = app.firestore();

    const ref = db.collection("galeria").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // ✅ UPDATE PARCIAL (não exige titulo pra toggle de ativo)
    const update: Record<string, unknown> = {};

    if ("titulo" in body) {
      const titulo = toStr(body.titulo, "").trim();
      if (titulo.length < 3) {
        return NextResponse.json({ error: "Título muito curto" }, { status: 400 });
      }
      update.titulo = titulo;
    }

    if ("descricao" in body) update.descricao = toStr(body.descricao, "").trim();
    if ("ativo" in body) update.ativo = toBool(body.ativo, true);
    if ("fotoUrl" in body) update.fotoUrl = toStr(body.fotoUrl, "");
    if ("fotoPublicId" in body) update.fotoPublicId = toStr(body.fotoPublicId, "");

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    update.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await ref.update(update);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro" }, { status: 500 });
  }
}

/* ================= DELETE ================= */

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const me = await requireAdmin(req);
    if (!me) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const { id } = await ctx.params;

    const app = getAdminApp();
    const db = app.firestore();

    const ref = db.collection("galeria").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await ref.delete();

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro" }, { status: 500 });
  }
}