import "server-only";
import type { Produto } from "@/types/produto";
import { getAdminApp } from "@/lib/firebase/admin";

function toStr(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

function toBool(v: unknown, fallback: boolean) {
  return typeof v === "boolean" ? v : fallback;
}

function toNum(v: unknown, fallback: number) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export class ProdutoService {
  static async getPublicById(id: string) {
    return this.getByIdPublic(id);
  }

  static async listPublicActive(): Promise<Produto[]> {

    const app = getAdminApp();

    const db = app.firestore();


    const snap = await db
      .collection("produtos")
      .where("ativo", "==", true)
      .where("publicado", "==", true)
      .get();


    const produtos = snap.docs.map(doc => {

      const data = doc.data() as any;

      return {

        id: doc.id,

        nome: toStr(data.nome),

        descricao: toStr(data.descricao),

        quantidade: toNum(data.quantidade, 0),

        fotoUrl: toStr(data.fotoUrl),

        fotoPublicId: toStr(data.fotoPublicId),

        codigo: toStr(data.codigo),

        preco: toNum(data.preco, 0),

        ativo: toBool(data.ativo, true),

        publicado: toBool(data.publicado, false),

        ordem: toNum(data.ordem, 0),

      } as Produto;

    });


    produtos.sort((a, b) => {

  const ao = typeof a.ordem === "number" ? a.ordem : 999999;

  const bo = typeof b.ordem === "number" ? b.ordem : 999999;

  if (ao !== bo) return ao - bo;

  return (a.nome || "").localeCompare(b.nome || "");

});


    return produtos;

  }



  static async getByIdPublic(id: string): Promise<Produto | null> {

    const app = getAdminApp();

    const db = app.firestore();


    const doc = await db.collection("produtos").doc(id).get();


    if (!doc.exists) return null;


    const data = doc.data() as any;


    if (!data.ativo || !data.publicado) return null;


    return {

      id: doc.id,

      nome: toStr(data.nome),

      descricao: toStr(data.descricao),

      quantidade: toNum(data.quantidade, 0),

      fotoUrl: toStr(data.fotoUrl),

      fotoPublicId: toStr(data.fotoPublicId),

      codigo: toStr(data.codigo),

      preco: toNum(data.preco, 0),

      ativo: toBool(data.ativo, true),

      publicado: toBool(data.publicado, false),

      ordem: toNum(data.ordem, 0),

    } as Produto;

  }

}