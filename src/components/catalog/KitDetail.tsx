import type { Kit } from "@/types/kit";
import { buildWhatsAppLink } from "@/lib/utils/whatsapp";
import { Button } from "@/components/ui/Button";

type Props = {
  kit: Kit;
  absoluteLink: string;
};

export function KitDetail({ kit, absoluteLink }: Props) {
  const wa = buildWhatsAppLink({
    nome: kit.nome,
    codigo: kit.codigo,
    link: absoluteLink,
    fotoUrl: kit.fotoUrl,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* FOTO */}
      <div className="rounded-3xl border bg-white p-4">
        {kit.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={kit.fotoUrl}
            alt={kit.nome}
            className="w-full aspect-[4/5] rounded-2xl object-cover"
          />
        ) : (
          <div className="aspect-[4/5] rounded-2xl bg-gray-100" />
        )}
      </div>

      {/* INFO */}
      <div className="space-y-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{kit.nome}</h1>
          {kit.descricao ? (
            <p className="mt-2 text-gray-700 whitespace-pre-line">{kit.descricao}</p>
          ) : (
            <p className="mt-2 text-gray-500">Sem descrição.</p>
          )}

          {kit.codigo ? (
            <p className="mt-3 text-xs font-semibold text-gray-500">
              Código: <span className="text-gray-700">{kit.codigo}</span>
            </p>
          ) : null}
        </div>

        <div className="rounded-3xl border bg-white p-5">
          <h2 className="text-base font-extrabold text-gray-900">O que vem no kit</h2>

          {Array.isArray(kit.itens) && kit.itens.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {kit.itens.map((it: any, idx: number) => (
                <li key={idx} className="flex items-center justify-between gap-4">
                  <span className="min-w-0 truncate">{String(it?.nome ?? it?.titulo ?? "Item")}</span>
                  <span className="text-gray-500">
                    {typeof it?.quantidade === "number" ? it.quantidade : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">Lista de itens não informada.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button href={wa} className="w-full sm:w-auto" variant="primary">
            Pedir orçamento no WhatsApp
          </Button>

          <Button href="/catalogo/kits" className="w-full sm:w-auto" variant="outline">
            Ver outros kits
          </Button>
        </div>
      </div>
    </div>
  );
}
