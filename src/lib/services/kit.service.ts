import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Kit } from "@/types/kit";
import type { KitItem } from "@/types/kit";

function normalizeKit(id: string, data: any): Kit {
  const itensRaw = Array.isArray(data?.itens) ? data.itens : undefined;

  const itens: KitItem[] | undefined = itensRaw
    ? itensRaw
        .filter(Boolean)
        .map((it: any) => ({
          produtoId: String(it?.produtoId ?? ""),
          produtoNome: typeof it?.produtoNome === "string" ? it.produtoNome : undefined,
          quantidade: typeof it?.quantidade === "number" ? it.quantidade : 1,
        }))
        .filter((it: KitItem) => Boolean(it.produtoId))
    : undefined;

  return {
    id,

    // Flutter
    nome: String(data?.nome ?? ""),
    preco: typeof data?.preco === "number" ? data.preco : undefined,
    itens,

    fotoUrl: String(data?.fotoUrl ?? ""),
    fotoPublicId: String(data?.fotoPublicId ?? ""),

    // Texto vitrine
    descricao: String(data?.descricao ?? ""),

    // Regras de compatibilidade
    ativo: typeof data?.ativo === "boolean" ? data.ativo : true,
    publicado: typeof data?.publicado === "boolean" ? data.publicado : false,

    // Site
    codigo: String(data?.codigo ?? ""),
    ordem: typeof data?.ordem === "number" ? data.ordem : undefined,
    createdAt: data?.createdAt ?? null,
  };
}

export class KitService {
  static async listPublicActive(): Promise<Kit[]> {
    const ref = collection(db, "kits");
    const snap = await getDocs(ref);

    let kits = snap.docs.map((d) => normalizeKit(d.id, d.data()));

    kits = kits.filter((k) => k.publicado === true && k.ativo !== false);

    kits.sort((a, b) => {
      const ao = typeof a.ordem === "number" ? a.ordem : Number.POSITIVE_INFINITY;
      const bo = typeof b.ordem === "number" ? b.ordem : Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;

      return String(a.nome ?? "").toLowerCase().localeCompare(String(b.nome ?? "").toLowerCase());
    });

    return kits;
  }

  static async getPublicById(id: string): Promise<Kit | null> {
    const ref = doc(db, "kits", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const kit = normalizeKit(snap.id, snap.data());

    if (kit.publicado !== true) return null;
    if (kit.ativo === false) return null;

    return kit;
  }
}