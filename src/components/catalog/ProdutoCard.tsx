import Link from "next/link";
import type { Produto } from "@/types/produto";
import { Badge } from "@/components/ui/Badge";

export function ProdutoCard({ produto }: { produto: Produto }) {
  return (
    <Link
      href={`/catalogo/produtos/${produto.id}`}
      className="group block rounded-2xl border bg-white overflow-hidden hover:shadow-sm transition"
    >
      <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
        {produto.fotoUrl ? (
          <img
            src={produto.fotoUrl}
            alt={produto.nome}
            className="h-full w-full object-cover group-hover:scale-[1.02] transition"
          />
        ) : null}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-gray-500">Nome</div>
            <h3 className="font-extrabold text-gray-900 truncate">{produto.nome}</h3>
          </div>

          {typeof (produto as any)?.preco === "number" && (produto as any).preco > 0 ? (
            <Badge>{`R$ ${(produto as any).preco.toFixed(2)}`}</Badge>
          ) : (
            <Badge>Orçamento</Badge>
          )}
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500">Descrição</div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {produto.descricao?.trim() ? produto.descricao : "—"}
          </p>
        </div>
      </div>
    </Link>
  );
}