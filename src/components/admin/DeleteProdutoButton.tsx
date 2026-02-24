"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProdutoButton({ id }: { id: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const ok = confirm(
      "Tem certeza que deseja excluir este produto? Essa ação não tem volta."
    );

    if (!ok) return;

    setLoading(true);

    try {
      const r = await fetch(`/admin/api/produtos/${id}`, {
        method: "DELETE",
      });

      if (!r.ok) {
        const txt = await r.text().catch(() => "");
        throw new Error(txt || "Falha ao excluir");
      }

      router.push("/admin/produtos");
      router.refresh();
    } catch (e: any) {
      alert(e?.message || "Erro ao excluir");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="
        text-sm
        font-semibold
        text-red-600

        no-underline
        hover:underline
        underline-offset-2

        disabled:opacity-60
        disabled:hover:no-underline
      "
    >
      {loading ? "Excluindo..." : "Excluir produto"}
    </button>
  );
}