import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import type { Kit } from "@/types/kit";

/**
 * Dados que o painel admin pode editar
 */
type KitInput = {
  nome: string;
  descricao?: string;
  preco?: number;

  ativo: boolean;

  ordem?: number;

  fotoUrl?: string;
  fotoPublicId?: string;
};

function normalizeKit(id: string, data: any): Kit {
  return {
    id,

    nome: String(data?.nome ?? ""),
    preco: typeof data?.preco === "number" ? data.preco : undefined,

    itens: Array.isArray(data?.itens) ? data.itens : [],

    fotoUrl: data?.fotoUrl ?? "",
    fotoPublicId: data?.fotoPublicId ?? "",

    descricao: data?.descricao ?? "",
    codigo: data?.codigo ?? "",

    // default TRUE (compatível com Flutter antigo)
    ativo: typeof data?.ativo === "boolean" ? data.ativo : true,

    ordem:
      typeof data?.ordem === "number"
        ? data.ordem
        : undefined,

    createdAt: data?.createdAt ?? null,
  };
}

export class KitAdminService {
  /**
   * Lista TODOS os kits (admin)
   * Compatível com Flutter antigo
   */
  static async listAll(): Promise<Kit[]> {
    const ref = collection(db, "kits");

    const snap = await getDocs(ref);

    const kits = snap.docs.map((d) => normalizeKit(d.id, d.data()));

    // Ordena no código (sem index)
    kits.sort((a, b) => {
      const ao =
        typeof a.ordem === "number"
          ? a.ordem
          : Number.POSITIVE_INFINITY;

      const bo =
        typeof b.ordem === "number"
          ? b.ordem
          : Number.POSITIVE_INFINITY;

      if (ao !== bo) return ao - bo;

      return a.nome.localeCompare(b.nome);
    });

    return kits;
  }

  /**
   * Busca kit por ID (admin)
   */
  static async getById(id: string): Promise<Kit | null> {
    const ref = doc(db, "kits", id);

    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return normalizeKit(snap.id, snap.data());
  }

  /**
   * Cria kit SEM apagar dados do Flutter
   */
  static async create(
    id: string,
    data: KitInput & { codigo: string }
  ) {
    const ref = doc(db, "kits", id);

    await setDoc(
      ref,
      {
        ...data,
        createdAt: serverTimestamp(),
      },
      {
        merge: true, // IMPORTANTE
      }
    );
  }

  /**
   * Atualiza kit (parcial)
   */
  static async update(id: string, data: Partial<KitInput>) {
    const ref = doc(db, "kits", id);

    await updateDoc(ref, data);
  }

  /**
   * Ativa / desativa kit
   */
  static async setAtivo(id: string, ativo: boolean) {
    const ref = doc(db, "kits", id);

    await updateDoc(ref, { ativo });
  }

  /**
   * Define ordem manual
   */
  static async setOrdem(id: string, ordem: number) {
    const ref = doc(db, "kits", id);

    await updateDoc(ref, { ordem });
  }
}