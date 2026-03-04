import { getAdminApp } from "@/lib/firebase/admin";
import type { Kit, KitItem } from "@/types/kit";

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

/* =================================
   Resolve nome do produto REAL
================================= */
async function resolveItens(
  itensRaw: any[],
  db: FirebaseFirestore.Firestore
): Promise<KitItem[]> {

  const produtosRef = db.collection("produtos");

  const itens: KitItem[] = [];

  for (const it of itensRaw) {
    if (!it?.produtoId) continue;

    let nome =
      toStr(it.produtoNome) ||
      toStr(it.nome) ||
      toStr(it.titulo);

    /* 🔥 fallback inteligente */
    if (!nome) {
      const prodDoc = await produtosRef
        .doc(String(it.produtoId))
        .get();

      if (prodDoc.exists) {
        nome = toStr(prodDoc.data()?.nome, "Produto");
      }
    }

    itens.push({
      produtoId: String(it.produtoId),
      produtoNome: nome || "Produto",
      quantidade: toNum(it.quantidade, 1),
    });
  }

  return itens;
}

async function normalizeKit(
  id: string,
  data: Record<string, unknown>,
  db: FirebaseFirestore.Firestore
): Promise<Kit> {

  const itens = Array.isArray(data.itens)
    ? await resolveItens(data.itens, db)
    : [];

  return {
    id,

    nome: toStr(data.nome),
    descricao: toStr(data.descricao),
    preco: toNum(data.preco, 0),
    codigo: toStr(data.codigo),

    ordem: toNum(data.ordem, 0),

    ativo: toBool(data.ativo, true),
    publicado: toBool(data.publicado, false),

    fotoUrl: toStr(data.fotoUrl),
    fotoPublicId: toStr(data.fotoPublicId),

    itens,
  };
}

export class KitPublicService {

  static async getAll(): Promise<Kit[]> {
    const db = getAdminApp().firestore();

    const snap = await db
      .collection("kits")
      .where("ativo", "==", true)
      .where("publicado", "==", true)
      .orderBy("ordem", "asc")
      .get();

    const kits = await Promise.all(
      snap.docs.map((d) =>
        normalizeKit(d.id, d.data(), db)
      )
    );

    return kits;
  }

  static async getById(id: string): Promise<Kit | null> {
    const db = getAdminApp().firestore();

    const doc = await db.collection("kits").doc(id).get();
    if (!doc.exists) return null;

    const kit = await normalizeKit(
      doc.id,
      doc.data() ?? {},
      db
    );

    if (!kit.ativo || !kit.publicado) return null;

    return kit;
  }
}