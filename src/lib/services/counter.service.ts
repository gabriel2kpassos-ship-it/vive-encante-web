import { db } from "@/lib/firebase/client";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";

type CounterKey = "kits" | "produtos";

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

export class CounterService {
  /**
   * Gera próximo código no formato:
   * kits -> KIT-001
   * produtos -> PRO-001
   *
   * Usa transaction para evitar duplicação.
   */
  static async nextCode(key: CounterKey): Promise<string> {
    const prefix = key === "kits" ? "KIT" : "PRO";
    const ref = doc(db, "counters", key);

    const next = await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);

      if (!snap.exists()) {
        tx.set(ref, { value: 1, createdAt: serverTimestamp() }, { merge: true });
        return 1;
      }

      const data = snap.data() as { value?: number };
      const current = typeof data.value === "number" ? data.value : 0;
      const value = current + 1;

      tx.set(ref, { value }, { merge: true });
      return value;
    });

    return `${prefix}-${pad3(next)}`;
  }
}
