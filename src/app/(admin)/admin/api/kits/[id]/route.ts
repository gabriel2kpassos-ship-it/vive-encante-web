import { NextResponse } from "next/server";
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

  const email = decoded.email || null;
  if (!isAllowedAdminEmail(email)) return null;

  return { email };
}

async function getId(ctx: { params: Promise<{ id: string }> | { id: string } }) {
  const p = await Promise.resolve(ctx.params);
  const id = p?.id;
  if (!id || typeof id !== "string" || !id.trim()) {
    throw new Error("Missing/invalid id param");
  }
  return id.trim();
}

function serializeTimestampToMillis(value: unknown): number | null {
  if (!value) return null;
  const v = value as { toMillis?: () => number; seconds?: number };
  if (typeof v?.toMillis === "function") return v.toMillis();
  if (typeof v?.seconds === "number") return v.seconds * 1000;
  return null;
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const me = await requireAdmin(req);
    if (!me) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const id = await getId(ctx);

    const app = getAdminApp();
    const db = app.firestore();

    const docSnap = await db.collection("kits").doc(id).get();
    if (!docSnap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data = (docSnap.data() || {}) as Record<string, unknown>;
    const createdAt = serializeTimestampToMillis(data.createdAt);

    const kit = {
      id: docSnap.id,
      ...data,
      // Defaults para UI
      ativo: typeof data.ativo === "boolean" ? data.ativo : true,
      publicado: typeof data.publicado === "boolean" ? data.publicado : false,
      createdAt,
    };

    return NextResponse.json({ kit });
  } catch (e: unknown) {
    const err = e as { message?: string } | null;
    return NextResponse.json({ error: err?.message || "Erro" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const me = await requireAdmin(req);
    if (!me) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const id = await getId(ctx);
    const body = (await req.json()) as Record<string, unknown>;

    const allowed = [
      "nome",
      "descricao",
      "preco",
      "ativo",
      "publicado",
      "ordem",
      "fotoUrl",
      "fotoPublicId",
      "codigo",
      // Se você quiser permitir editar itens via web, descomente:
      // "itens",
    ] as const;

    const update: Record<string, unknown> = {};

    for (const k of allowed) {
      if (!(k in body)) continue;
      const v = body[k];
      if (typeof v === "undefined") continue;

      if (k === "nome") update.nome = String(v).trim();
      else if (k === "descricao") update.descricao = String(v ?? "").trim();
      else if (k === "preco") update.preco = typeof v === "number" ? v : Number(v) || 0;
      else if (k === "ativo") update.ativo = Boolean(v);
      else if (k === "publicado") update.publicado = Boolean(v);
      else if (k === "ordem") update.ordem = typeof v === "number" ? v : Number(v) || 0;
      else if (k === "fotoUrl") update.fotoUrl = String(v ?? "");
      else if (k === "fotoPublicId") update.fotoPublicId = String(v ?? "");
      else if (k === "codigo") update.codigo = String(v ?? "").trim();
      // else if (k === "itens") update.itens = Array.isArray(v) ? v : [];
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const app = getAdminApp();
    const db = app.firestore();

    await db.collection("kits").doc(id).update(update);

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const err = e as { message?: string } | null;
    return NextResponse.json({ error: err?.message || "Erro" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const me = await requireAdmin(req);
    if (!me) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const id = await getId(ctx);

    const app = getAdminApp();
    const db = app.firestore();

    await db.collection("kits").doc(id).delete();

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const err = e as { message?: string } | null;
    return NextResponse.json({ error: err?.message || "Erro" }, { status: 500 });
  }
}
