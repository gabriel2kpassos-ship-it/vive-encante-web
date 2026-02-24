import Image from "next/image";
import type { GaleriaItem } from "@/types/galeria";

export function GalleryGrid({ items }: { items: GaleriaItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((g) => (
        <div key={g.id} className="overflow-hidden rounded-xl border bg-gray-50">
          <div className="relative aspect-square">
            <Image
              src={g.fotoUrl}
              alt={g.titulo || "Foto"}
              fill
              className="object-cover"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          </div>

          <div className="p-3">
            <div className="text-sm font-semibold text-gray-800 truncate">
              {g.titulo || "—"}
            </div>

            {g.descricao?.trim() ? (
              <div className="mt-1 text-xs text-gray-600 truncate">
                {g.descricao}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}