import { NextResponse } from "next/server";
import { getAdminApp } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const app = getAdminApp();
    const db = app.firestore();

    const snap = await db
      .collection("galeria")
      .where("ativo", "==", true)
      .orderBy("ordem", "asc")
      .get();

    const itens = snap.docs.map((d) => {
      const data = d.data();

      return {
        id: d.id,
        titulo: data.titulo || "",
        descricao: data.descricao || "",
        fotoUrl: data.fotoUrl || "",
        fotoPublicId: data.fotoPublicId || "",
        ativo: Boolean(data.ativo),
        ordem: typeof data.ordem === "number" ? data.ordem : 0,
        createdAt: data.createdAt ?? null,
      };
    });

    return NextResponse.json({ itens });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Erro" },
      { status: 500 }
    );
  }
}