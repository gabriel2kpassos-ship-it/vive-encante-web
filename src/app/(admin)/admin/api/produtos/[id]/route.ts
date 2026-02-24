import { NextResponse } from "next/server";
import { getAdminApp } from "@/lib/firebase/admin";
import { isAllowedAdminEmail } from "@/lib/auth/auth";

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

type ParamsCtx = { params: Promise<{ id: string }> | { id: string } };

async function getId(ctx: ParamsCtx) {
  const p = ctx.params;
  const resolved = p instanceof Promise ? await p : p;
  const id = resolved?.id;

  if (!id || typeof id !== "string" || !id.trim()) {
    throw new Error("Missing/invalid id param");
  }
  return id.trim();
}

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

function toNum(v: unknown, fallback: number) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function toStr(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

/* ================= GET ================= */

export async function GET(req: Request, ctx: ParamsCtx) {
  try {
    const me = await requireAdmin(req);
    if (!me) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const id = await getId(ctx);

    const app = getAdminApp();
    const db = app.firestore();

    const docSnap = await db.collection("produtos").doc(id).get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = (docSnap.data() ?? {}) as Record<string, unknown>;

    // ✅ NÃO espalha data cru (pode conter Timestamp / objetos não-serializáveis)
    const produto = {
      id: docSnap.id,

      nome: toStr(data.nome, ""),
      descricao: toStr(data.descricao, ""),
      quantidade: toNum(data.quantidade, 0),

      preco: toNum(data.preco, 0),
      codigo: toStr(data.codigo, ""),
      ordem: toNum(data.ordem, 0),

      fotoUrl: toStr(data.fotoUrl, ""),
      fotoPublicId: toStr(data.fotoPublicId, ""),

      ativo: toBool(data.ativo, true),
      publicado: toBool(data.publicado, false),

      createdAt: serializeTimestampToMillis(data.createdAt),
    };

    return NextResponse.json({ produto });
  } catch (e: unknown) {
    const err = e as { message?: string } | null;
    return NextResponse.json({ error: err?.message || "Erro" }, { status: 500 });
  }
}

/* ================= PATCH ================= */

export async function PATCH(req: Request, ctx: ParamsCtx) {
  try {
    const me = await requireAdmin(req);
    if (!me) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const id = await getId(ctx);
    const body = (await req.json()) as Record<string, unknown>;

    const allowed = [
      "nome",
      "quantidade",
      "descricao",
      "preco",
      "ativo",
      "publicado",
      "ordem",
      "fotoUrl",
      "fotoPublicId",
      "codigo",
    ] as const;

    const update: Record<string, unknown> = {};

    for (const k of allowed) {
      if (!(k in body)) continue;

      const v = body[k];
      if (typeof v === "undefined") continue;

      if (k === "nome") update.nome = toStr(v, "").trim();
      else if (k === "descricao") update.descricao = toStr(v, "").trim();
      else if (k === "quantidade") update.quantidade = toNum(v, 0);
      else if (k === "preco") update.preco = toNum(v, 0);
      else if (k === "ativo") update.ativo = toBool(v, true);
      else if (k === "publicado") update.publicado = toBool(v, false);
      else if (k === "ordem") update.ordem = toNum(v, 0);
      else if (k === "fotoUrl") update.fotoUrl = toStr(v, "");
      else if (k === "fotoPublicId") update.fotoPublicId = toStr(v, "");
      else if (k === "codigo") update.codigo = toStr(v, "").trim();
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const app = getAdminApp();
    const db = app.firestore();

    await db.collection("produtos").doc(id).update(update);

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const err = e as { message?: string } | null;
    return NextResponse.json({ error: err?.message || "Erro" }, { status: 500 });
  }
}

/* ================= DELETE ================= */

export async function DELETE(req: Request, ctx: ParamsCtx) {
  try {
    const me = await requireAdmin(req);
    if (!me) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const id = await getId(ctx);

    const app = getAdminApp();
    const db = app.firestore();

    await db.collection("produtos").doc(id).delete();

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const err = e as { message?: string } | null;
    return NextResponse.json({ error: err?.message || "Erro" }, { status: 500 });
  }
}