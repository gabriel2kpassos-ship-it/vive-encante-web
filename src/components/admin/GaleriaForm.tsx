"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "./ImageUploader";

type Payload = {
  titulo: string;
  descricao?: string;
  ativo: boolean;
  fotoUrl: string;
  fotoPublicId: string;
};

type InitialData =
  | {
      id?: string;
      titulo?: string;
      descricao?: string;
      ativo?: boolean;
      fotoUrl?: string;
      fotoPublicId?: string;
    }
  | null;

type Props = {
  onSubmit: (d: Payload) => Promise<void>;
  initialData?: InitialData;
};

export function GaleriaForm({ onSubmit, initialData }: Props) {
  const isEdit = Boolean(initialData?.id);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(true);

  const [fotoUrl, setFotoUrl] = useState("");
  const [fotoPublicId, setFotoPublicId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync confiável quando initialData chega/atualiza
  useEffect(() => {
    setTitulo(initialData?.titulo ?? "");
    setDescricao(initialData?.descricao ?? "");
    setAtivo(initialData?.ativo ?? true);
    setFotoUrl(initialData?.fotoUrl ?? "");
    setFotoPublicId(initialData?.fotoPublicId ?? "");
  }, [initialData]);

  const fotoValue = fotoUrl && fotoPublicId ? { url: fotoUrl, publicId: fotoPublicId } : null;

  const fieldClass =
    "mt-1 w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const t = titulo.trim();
    const d = descricao.trim();

    if (t.length < 3) return setError("Título muito curto.");
    if (!fotoUrl || !fotoPublicId) return setError("Envie uma imagem.");

    setLoading(true);
    try {
      await onSubmit({
        titulo: t,
        descricao: d ? d : undefined,
        ativo,
        fotoUrl,
        fotoPublicId,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        {/* ESQUERDA */}
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-900">Título</label>
            <input
              className={fieldClass}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Festa de 15 anos - decoração"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-900">
              Descrição <span className="text-xs text-gray-500">(opcional)</span>
            </label>
            <textarea
              className={fieldClass}
              rows={5}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhes da foto, contexto, etc."
            />
          </div>
        </div>

        {/* DIREITA */}
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-900">Foto</label>
            <div className="mt-2">
              <ImageUploader
                folder="vive-encante/galeria"
                value={fotoValue}
                label={fotoValue ? "Trocar foto" : "Enviar foto"}
                onUploaded={(r) => {
                  if (!r) {
                    setFotoUrl("");
                    setFotoPublicId("");
                    return;
                  }
                  setFotoUrl(r.url);
                  setFotoPublicId(r.publicId);
                }}
              />
            </div>

            {!fotoValue ? (
              <p className="mt-2 text-xs text-gray-600">
                {isEdit
                  ? "Este item está sem foto (corrija enviando uma imagem)."
                  : "Envie uma foto para cadastrar na galeria."}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border bg-gray-50 p-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
              />
              <span className="text-sm font-extrabold text-gray-900">Ativo</span>
            </label>

            <p className="mt-2 text-xs text-gray-600">
              Se estiver inativo, não aparece para o público.
            </p>
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        disabled={loading}
        className="rounded-xl bg-gradient-to-r from-pink-400 to-sky-400 px-6 py-3 font-bold text-white disabled:opacity-60"
      >
        {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Salvar"}
      </button>
    </form>
  );
}