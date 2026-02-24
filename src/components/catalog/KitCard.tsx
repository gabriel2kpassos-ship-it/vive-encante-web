import Link from "next/link";
import type { Kit } from "@/types/kit";
import { Badge } from "@/components/ui/Badge";

export function KitCard({ kit }: { kit: Kit }) {
  return (
    <Link
      href={`/catalogo/kits/${kit.id}`}
      className="group block rounded-2xl border bg-white overflow-hidden hover:shadow-sm transition"
    >
      <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
        {kit.fotoUrl ? (
          <img
            src={kit.fotoUrl}
            alt={kit.nome}
            className="h-full w-full object-cover group-hover:scale-[1.02] transition"
          />
        ) : null}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-gray-500">Nome</div>
            <h3 className="font-extrabold text-gray-900 truncate">{kit.nome}</h3>
          </div>

          {typeof kit.preco === "number" && kit.preco > 0 ? (
            <Badge>{`R$ ${kit.preco.toFixed(2)}`}</Badge>
          ) : (
            <Badge>Orçamento</Badge>
          )}
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500">Descrição</div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {kit.descricao?.trim() ? kit.descricao : "—"}
          </p>
        </div>
      </div>
    </Link>
  );
}