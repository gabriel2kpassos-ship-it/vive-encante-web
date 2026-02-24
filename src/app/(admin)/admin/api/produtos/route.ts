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

  if (v && typeof v.seconds === "number") {
    return v.seconds * 1000;
  }

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

/* ================= GET (LISTAR) ================= */

export async function GET(req: Request) {
  try {
    const me = await requireAdmin(req);

    if (!me) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    const app = getAdminApp();
    const db = app.firestore();

    const snap = await db.collection("produtos").get();

    const produtos = snap.docs
      .map((d) => {
        const data = d.data() as Record<string, unknown>;

        const ordem =
          typeof data.ordem === "number"
            ? data.ordem
            : undefined;

        return {
          id: d.id,

          nome: toStr(data.nome, ""),
          quantidade: toNum(data.quantidade, 0),

          fotoUrl: toStr(data.fotoUrl, ""),
          fotoPublicId: toStr(data.fotoPublicId, ""),

          descricao: toStr(data.descricao, ""),
          preco: toNum(data.preco, 0),

          ativo: toBool(data.ativo, true),
          publicado: toBool(data.publicado, false),

          codigo: toStr(data.codigo, ""),

          createdAt: serializeTimestampToMillis(
            data.createdAt
          ),

          ordem,
        };
      })
      .sort((a, b) => {
        const ao =
          typeof a.ordem === "number"
            ? a.ordem
            : Number.POSITIVE_INFINITY;

        const bo =
          typeof b.ordem === "number"
            ? b.ordem
            : Number.POSITIVE_INFINITY;

        if (ao !== bo) return ao - bo;

        return String(a.nome).localeCompare(
          String(b.nome)
        );
      });

    return NextResponse.json({ produtos });
  } catch (e: unknown) {
    const err = e as { message?: string } | null;

    return NextResponse.json(
      { error: err?.message || "Erro" },
      { status: 500 }
    );
  }
}

/* ================= POST (CRIAR) ================= */

export async function POST(req: Request) {
  try {
    const me = await requireAdmin(req);

    if (!me) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    const body =
      (await req.json()) as Record<
        string,
        unknown
      >;

    const nome = toStr(body.nome, "").trim();

    if (!nome) {
      return NextResponse.json(
        { error: "Nome obrigatório" },
        { status: 400 }
      );
    }

    const app = getAdminApp();
    const db = app.firestore();

    /* ================= GERAR CODIGO AUTOMATICO ================= */

    const counterRef =
      db.collection("_counters").doc("produtos");

    const newNumber =
      await db.runTransaction(
        async (tx) => {
          const snap = await tx.get(counterRef);

          const current =
            snap.exists &&
            typeof snap.data()?.value === "number"
              ? snap.data()!.value
              : 0;

          const next = current + 1;

          tx.set(
            counterRef,
            { value: next },
            { merge: true }
          );

          return next;
        }
      );

    const codigoGerado = `PROD-${String(
      newNumber
    ).padStart(4, "0")}`;

    /* ================= CRIAR DOCUMENTO ================= */

    const id = crypto.randomUUID();

    await db.collection("produtos").doc(id).set({
      nome,

      quantidade: toNum(body.quantidade, 0),

      fotoUrl: toStr(body.fotoUrl, ""),
      fotoPublicId: toStr(
        body.fotoPublicId,
        ""
      ),

      descricao: toStr(
        body.descricao,
        ""
      ).trim(),

      preco: toNum(body.preco, 0),

      ativo: toBool(body.ativo, true),

      publicado: toBool(
        body.publicado,
        false
      ),

      ordem: toNum(body.ordem, Date.now()),

      codigo: codigoGerado,

      createdAt:
        admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      ok: true,
      id,
      codigo: codigoGerado,
    });
  } catch (e: unknown) {
    const err = e as {
      message?: string;
    } | null;

    return NextResponse.json(
      { error: err?.message || "Erro" },
      { status: 500 }
    );
  }
}