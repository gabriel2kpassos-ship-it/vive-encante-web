import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";

import { getClientApp } from "@/lib/firebase/client";

import type { GaleriaItem } from "@/types/galeria";

export class GaleriaPublicService {

  private static db() {
    return getFirestore(getClientApp());
  }

  /* ================= */
  /* LISTAR TODAS     */
  /* ================= */

  static async getAll(): Promise<GaleriaItem[]> {

    const q = query(
      collection(this.db(), "galeria"),
      where("ativo", "==", true),
      orderBy("ordem", "asc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => {

      const data = docSnap.data() as Omit<GaleriaItem, "id">;

      return {
        ...data,
        id: docSnap.id,
      };

    });
  }


  /* ================= */
  /* BUSCAR POR ID    */
  /* ================= */

  static async getById(id: string): Promise<GaleriaItem | null> {

    const ref = doc(this.db(), "galeria", id);

    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data() as Omit<GaleriaItem, "id">;

    if (!data.ativo) return null;

    return {
      ...data,
      id: snap.id,
    };
  }

}