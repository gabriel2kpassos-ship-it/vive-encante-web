"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GaleriaItem } from "@/types/galeria";
import { DeleteGaleriaButton } from "./DeleteGaleriaButton";

export function GaleriaTable({ items }: { items: GaleriaItem[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function toggleAtivo(id: string, ativoAtual: boolean) {
    setLoadingId(id);
    try {
      const r = await fetch(`/admin/api/galeria/${id}`, {
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
        <div className="col-span-6">Foto</div>
        <div className="col-span-3">Status</div>
        <div className="col-span-3 text-right">Ações</div>
      </div>

      <div className="divide-y">
        {items.map((it) => (
          <div key={it.id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
            <div className="col-span-6 flex items-center gap-3">
              {it.fotoUrl ? (
                <img
                  src={it.fotoUrl}
                  alt={it.titulo || "Foto"}
                  className="h-12 w-12 rounded-xl object-cover border"
                />
              ) : (
                <div className="h-12 w-12 rounded-xl border bg-gray-50" />
              )}

              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-500">Título</div>
                <div className="font-semibold text-gray-900 truncate">{it.titulo || "—"}</div>

                <div className="mt-1 text-xs font-semibold text-gray-500">Descrição</div>
                <div className="text-xs text-gray-600 truncate">
                  {it.descricao?.trim() ? it.descricao : "—"}
                </div>
              </div>
            </div>

            <div className="col-span-3">
              <button
                type="button"
                disabled={loadingId === it.id}
                onClick={() => toggleAtivo(it.id, Boolean(it.ativo))}
                className={[
                  "rounded-xl px-3 py-1.5 text-xs font-bold border transition disabled:opacity-60",
                  it.ativo
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
                ].join(" ")}
              >
                {loadingId === it.id ? "Salvando..." : it.ativo ? "ATIVO" : "INATIVO"}
              </button>
            </div>

            <div className="col-span-3 flex justify-end gap-6">
              <Link
                href={`/admin/galeria/${it.id}`}
                className="text-sm font-semibold text-sky-700 hover:underline underline-offset-2"
              >
                Editar
              </Link>

              <DeleteGaleriaButton id={it.id} />
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="p-6 text-sm text-gray-500">Nenhuma foto cadastrada.</div>
      ) : null}
    </div>
  );
}