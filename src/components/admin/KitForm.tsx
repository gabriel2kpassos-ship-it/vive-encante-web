"use client";

import { useEffect, useMemo, useState } from "react";
import type { Kit } from "@/types/kit";
import { ImageUploader } from "./ImageUploader";

type Props = {
  initialData?: Kit | null;

  onSubmit: (data: {
    nome: string;
    descricao?: string;

    ativo: boolean;
    publicado: boolean;
    ordem: number;

    fotoUrl?: string;
    fotoPublicId?: string;

    codigo?: string;
    preco?: number;
    itens?: unknown[];
  }) => Promise<void>;
};

function normalizeNumberInput(raw: string) {
  return raw.trim().replace(",", ".");
}

function parseNonNegativeNumber(raw: string, fallback = 0) {
  const v = normalizeNumberInput(raw);
  if (v === "") return fallback;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return NaN;
  return n;
}

function parseOptionalNonNegativeNumber(raw: string) {
  const v = normalizeNumberInput(raw);
  if (v === "") return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return NaN as any;
  return n;
}

export function KitForm({ initialData, onSubmit }: Props) {
  const isEdit = Boolean(initialData?.id);

  const [nome, setNome] = useState(initialData?.nome || "");
  const [descricao, setDescricao] = useState(initialData?.descricao || "");

  const [codigo, setCodigo] = useState((initialData as any)?.codigo || "");

  // ✅ preço como string (opcional: novo começa vazio)
  const [preco, setPreco] = useState<string>(() => {
    const p = (initialData as any)?.preco;
    return typeof p === "number" && Number.isFinite(p) && p >= 0 ? String(p) : "";
  });

  const [ativo, setAtivo] = useState(initialData?.ativo ?? true);
  const [publicado, setPublicado] = useState(initialData?.publicado ?? false);

  // ✅ ordem como string
  const [ordem, setOrdem] = useState<string>(() => {
    const o = (initialData as any)?.ordem;
    return typeof o === "number" && Number.isFinite(o) && o >= 0 ? String(o) : "0";
  });

  const [fotoUrl, setFotoUrl] = useState((initialData as any)?.fotoUrl || "");
  const [fotoPublicId, setFotoPublicId] = useState((initialData as any)?.fotoPublicId || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // sincroniza quando initialData mudar (nav/refresh)
  useEffect(() => {
    setNome(initialData?.nome || "");
    setDescricao((initialData as any)?.descricao || "");

    setCodigo((initialData as any)?.codigo || "");

    const p = (initialData as any)?.preco;
    setPreco(typeof p === "number" && Number.isFinite(p) && p >= 0 ? String(p) : "");

    setAtivo((initialData as any)?.ativo ?? true);
    setPublicado((initialData as any)?.publicado ?? false);

    const o = (initialData as any)?.ordem;
    setOrdem(typeof o === "number" && Number.isFinite(o) && o >= 0 ? String(o) : "0");

    setFotoUrl((initialData as any)?.fotoUrl || "");
    setFotoPublicId((initialData as any)?.fotoPublicId || "");
  }, [
    initialData?.nome,
    (initialData as any)?.descricao,
    (initialData as any)?.codigo,
    (initialData as any)?.preco,
    (initialData as any)?.ativo,
    (initialData as any)?.publicado,
    (initialData as any)?.ordem,
    (initialData as any)?.fotoUrl,
    (initialData as any)?.fotoPublicId,
  ]);

  const imageValue = useMemo(() => {
    return fotoUrl && fotoPublicId ? { url: fotoUrl, publicId: fotoPublicId } : null;
  }, [fotoUrl, fotoPublicId]);

  const fieldClass =
    "mt-1 w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const nomeTrim = nome.trim();
    const descTrim = descricao.trim();
    const codTrim = (codigo || "").trim();

    if (nomeTrim.length < 3) return setError("Nome muito curto (mínimo 3).");

    const ord = parseNonNegativeNumber(ordem, 0);
    if (!Number.isFinite(ord)) return setError("Ordem inválida.");

    const pr = parseOptionalNonNegativeNumber(preco);
    if (typeof pr === "number" && !Number.isFinite(pr)) return setError("Preço inválido.");

    // regra: não deixa PUBLICAR sem imagem
    if (publicado && (!fotoUrl || !fotoPublicId)) {
      return setError("Para publicar, envie uma imagem.");
    }

    setLoading(true);
    try {
      await onSubmit({
        nome: nomeTrim,
        descricao: descTrim || undefined,

        ativo,
        publicado,
        ordem: ord,

        fotoUrl: fotoUrl || undefined,
        fotoPublicId: fotoPublicId || undefined,

        codigo: codTrim || undefined,
        preco: typeof pr === "number" && Number.isFinite(pr) ? pr : undefined,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* COLUNA ESQUERDA */}
        <div className="space-y-5">
          <section className="rounded-2xl border bg-white p-5">
            <h2 className="text-base font-extrabold text-gray-900">Dados do kit</h2>
            <p className="mt-1 text-sm text-gray-600">Nome e descrição são o que mais converte.</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-900">Nome do kit</label>
                <input
                  className={fieldClass}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Descrição <span className="text-xs text-gray-500">(opcional)</span>
                </label>
                <textarea
                  className={fieldClass}
                  rows={6}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-5">
            <h2 className="text-base font-extrabold text-gray-900">Ordem</h2>
            <p className="mt-1 text-sm text-gray-600">Ordem define quem aparece primeiro.</p>

            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-900">Ordem no catálogo</label>
              <input
                type="number"
                className={fieldClass}
                value={ordem}
                onChange={(e) => setOrdem(e.target.value)}
                min={0}
              />
              <p className="mt-2 text-xs text-gray-500">Menor número aparece primeiro.</p>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-5">
            <h2 className="text-base font-extrabold text-gray-900">Código e preço</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Código <span className="text-xs text-gray-500">(opcional)</span>
                </label>
                <input
                  className={fieldClass}
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ex: KIT-001"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Preço <span className="text-xs text-gray-500">(opcional)</span>
                </label>
                <input
                  type="number"
                  className={fieldClass}
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  min={0}
                  step="0.01"
                  placeholder="Ex: 29,90"
                />
              </div>
            </div>
          </section>
        </div>

        {/* COLUNA DIREITA */}
        <div className="space-y-5">
          <section className="rounded-2xl border bg-white p-5">
            <h2 className="text-base font-extrabold text-gray-900">Foto</h2>
            <p className="mt-1 text-sm text-gray-600">Publicado exige imagem.</p>

            <div className="mt-4">
              <ImageUploader
                folder="vive-encante/kits"
                value={imageValue}
                onUploaded={(r) => {
                  if (!r) {
                    setFotoUrl("");
                    setFotoPublicId("");
                    return;
                  }
                  setFotoUrl(r.url);
                  setFotoPublicId(r.publicId);
                }}
                label={imageValue ? "Trocar foto" : "Enviar foto"}
              />
            </div>

            {!imageValue ? (
              <p className="mt-3 text-xs text-gray-600">
                Dica: salve como rascunho (não publicado) sem foto.
              </p>
            ) : (
              <p className="mt-3 text-xs text-gray-500">Recomendado: 1:1 ou 4:5.</p>
            )}
          </section>

          <section className="rounded-2xl border bg-white p-5">
            <h2 className="text-base font-extrabold text-gray-900">Status</h2>

            <div className="mt-4 space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">Ativo no sistema</span>
                  <span className="block text-xs text-gray-600">
                    Se desativar, não deve aparecer.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={publicado}
                  onChange={(e) => setPublicado(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    Publicado na vitrine
                  </span>
                  <span className="block text-xs text-gray-600">
                    Só publicado aparece no catálogo público.
                  </span>
                </span>
              </label>
            </div>

            {!ativo && publicado ? (
              <p className="mt-3 text-xs text-red-600">
                Inconsistência: publicado e desativado. Marque “Ativo” ou desmarque “Publicado”.
              </p>
            ) : null}
          </section>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-400 to-sky-400 px-6 py-3 font-extrabold text-white disabled:opacity-60"
          >
            {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Salvar"}
          </button>

          <p className="text-center text-xs text-gray-500">
            Checklist: nome ok • foto ok • status ok • ordem ok
          </p>
        </div>
      </div>
    </form>
  );
}