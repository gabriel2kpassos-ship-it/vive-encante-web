import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { getClientFirestore } from "@/lib/firebase/client";
import type { Produto } from "@/types/produto";

export class ProdutoPublicService {
  static async getAll(): Promise<Produto[]> {
    const db = getClientFirestore();

    const q = query(
      collection(db, "produtos"),
      where("ativo", "==", true),
      where("publicado", "==", true),
      orderBy("ordem", "asc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data() as Omit<Produto, "id">;
      return { ...data, id: d.id };
    });
  }

  static async getById(id: string): Promise<Produto | null> {
    const db = getClientFirestore();

    const ref = doc(db, "produtos", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data() as Omit<Produto, "id">;

    if (!data.ativo || !data.publicado) return null;

    return { ...data, id: snap.id };
  }
}