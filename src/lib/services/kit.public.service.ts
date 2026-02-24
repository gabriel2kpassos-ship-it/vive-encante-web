import { getAdminApp } from "@/lib/firebase/admin";
import type { Kit } from "@/types/kit";

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

export class KitPublicService {
  /** lista apenas kits ativos + publicados, ordenados por ordem (asc) */
  static async getAll(): Promise<Kit[]> {
    const app = getAdminApp();
    const db = app.firestore();

    const snap = await db
      .collection("kits")
      .where("ativo", "==", true)
      .where("publicado", "==", true)
      .orderBy("ordem", "asc")
      .get();

    return snap.docs.map((d) => {
      const data = (d.data() ?? {}) as Record<string, unknown>;
      return {
        id: d.id,
        nome: toStr(data.nome, ""),
        descricao: toStr(data.descricao, ""),
        preco: toNum(data.preco, 0),
        codigo: toStr(data.codigo, ""),
        ordem: toNum(data.ordem, 0),
        ativo: toBool(data.ativo, true),
        publicado: toBool(data.publicado, false),
        fotoUrl: toStr(data.fotoUrl, ""),
        fotoPublicId: toStr(data.fotoPublicId, ""),
        itens: Array.isArray(data.itens) ? (data.itens as any[]) : [],
      };
    });
  }

  /** busca por id, mas só retorna se estiver ativo+publicado */
  static async getById(id: string): Promise<Kit | null> {
    const app = getAdminApp();
    const db = app.firestore();

    const doc = await db.collection("kits").doc(id).get();
    if (!doc.exists) return null;

    const data = (doc.data() ?? {}) as Record<string, unknown>;

    const ativo = toBool(data.ativo, true);
    const publicado = toBool(data.publicado, false);
    if (!ativo || !publicado) return null;

    return {
      id: doc.id,
      nome: toStr(data.nome, ""),
      descricao: toStr(data.descricao, ""),
      preco: toNum(data.preco, 0),
      codigo: toStr(data.codigo, ""),
      ordem: toNum(data.ordem, 0),
      ativo,
      publicado,
      fotoUrl: toStr(data.fotoUrl, ""),
      fotoPublicId: toStr(data.fotoPublicId, ""),
      itens: Array.isArray(data.itens) ? (data.itens as any[]) : [],
    };
  }
}
