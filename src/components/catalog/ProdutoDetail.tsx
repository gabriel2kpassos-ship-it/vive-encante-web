import type { Produto } from "@/types/produto";
import { buildWhatsAppLink } from "@/lib/utils/whatsapp";
import { Button } from "@/components/ui/Button";

type Props = {
  produto: Produto;
  absoluteLink: string;
};

export function ProdutoDetail({ produto, absoluteLink }: Props) {
  const wa = buildWhatsAppLink({
    nome: produto.nome,
    codigo: produto.codigo,
    link: absoluteLink,
    fotoUrl: produto.fotoUrl,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* FOTO */}
      <div className="rounded-3xl border bg-white p-4">
        {produto.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={produto.fotoUrl}
            alt={produto.nome}
            className="w-full aspect-[4/5] rounded-2xl object-cover"
          />
        ) : (
          <div className="aspect-[4/5] rounded-2xl bg-gray-100" />
        )}
      </div>

      {/* INFO */}
      <div className="space-y-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{produto.nome}</h1>

          {produto.descricao ? (
            <p className="mt-2 text-gray-700 whitespace-pre-line">{produto.descricao}</p>
          ) : (
            <p className="mt-2 text-gray-500">Sem descrição.</p>
          )}

          {produto.codigo ? (
            <p className="mt-3 text-xs font-semibold text-gray-500">
              Código: <span className="text-gray-700">{produto.codigo}</span>
            </p>
          ) : null}
        </div>

        <div className="rounded-3xl border bg-white p-5">
          <h2 className="text-base font-extrabold text-gray-900">Detalhes</h2>
          <div className="mt-3 grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Disponível</span>
              <span className="font-semibold text-gray-900">
                {typeof produto.quantidade === "number" ? produto.quantidade : 0}
              </span>
            </div>
            {typeof produto.preco === "number" && produto.preco > 0 ? (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Preço</span>
                <span className="font-semibold text-gray-900">
                  R$ {produto.preco.toFixed(2).replace(".", ",")}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button href={wa} className="w-full sm:w-auto" variant="primary">
            Pedir orçamento no WhatsApp
          </Button>

          <Button href="/catalogo/produtos" className="w-full sm:w-auto" variant="outline">
            Ver outros produtos
          </Button>
        </div>
      </div>
    </div>
  );
}
