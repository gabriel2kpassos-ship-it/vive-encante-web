import { headers } from "next/headers";

import type { GaleriaItem } from "@/types/galeria";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const dynamic = "force-dynamic";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

async function getGaleria(): Promise<GaleriaItem[]> {
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/public/galeria`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = (await res.json()) as { itens?: GaleriaItem[] };
  return Array.isArray(data.itens) ? data.itens : [];
}

export default async function GaleriaPage() {
  const itens = await getGaleria();

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Galeria</h1>
          <p className="mt-2 text-gray-600">
            Alguns dos nossos eventos e montagens.
          </p>
        </div>

        {itens.length ? (
          <GalleryGrid items={itens} />
        ) : (
          <div className="mt-10 rounded-xl border bg-gray-50 p-6 text-gray-600">
            Nenhuma foto publicada ainda.
          </div>
        )}
      </section>
    </main>
  );
}