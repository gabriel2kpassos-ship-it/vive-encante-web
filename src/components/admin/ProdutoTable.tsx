"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Produto } from "@/types/produto";

export function ProdutoTable({ produtos }: { produtos: Produto[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function toggleAtivo(id: string, ativoAtual: boolean) {
    setLoadingId(id);
    try {
      const r = await fetch(`/admin/api/produtos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !ativoAtual }),
      });

      if (!r.ok) {
        const txt = await r.text().catch(() => "");
        throw new Error(txt || "Falha ao atualizar");
      }

      router.refresh();
    } catch (e: any) {
      alert(e?.message || "Erro ao atualizar");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <div className="grid grid-cols-12 gap-3 px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50">
        <div className="col-span-6">Produto</div>
        <div className="col-span-3">Código</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1 text-right">Ações</div>
      </div>

      <div className="divide-y">
        {produtos.map((p) => (
          <div key={p.id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
            <div className="col-span-6 flex items-center gap-3">
              {p.fotoUrl ? (
                <img
                  src={p.fotoUrl}
                  alt={p.nome}
                  className="h-12 w-12 rounded-xl object-cover border"
                />
              ) : (
                <div className="h-12 w-12 rounded-xl border bg-gray-50" />
              )}

              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-500">Nome</div>
                <div className="font-semibold text-gray-900 truncate">{p.nome}</div>

                <div className="mt-1 text-xs font-semibold text-gray-500">Descrição</div>
                <div className="text-xs text-gray-600 truncate">
                  {p.descricao?.trim() ? p.descricao : "—"}
                </div>
              </div>
            </div>

            <div className="col-span-3 text-sm text-gray-800">
              {p.codigo?.trim() ? p.codigo : "—"}
            </div>

            <div className="col-span-2">
              <button
                type="button"
                disabled={loadingId === p.id}
                onClick={() => toggleAtivo(p.id, Boolean(p.ativo))}
                className={[
                  "rounded-xl px-3 py-1.5 text-xs font-bold border transition disabled:opacity-60",
                  p.ativo
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
                ].join(" ")}
              >
                {loadingId === p.id ? "Salvando..." : p.ativo ? "ATIVO" : "INATIVO"}
              </button>
            </div>

            <div className="col-span-1 text-right">
              <Link href={`/admin/produtos/${p.id}`} className="text-sm font-semibold text-sky-700 hover:underline underline-offset-2">
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>

      {produtos.length === 0 ? (
        <div className="p-6 text-sm text-gray-500">Nenhum produto cadastrado.</div>
      ) : null}
    </div>
  );
}