import Link from "next/link";

export const metadata = {
  title: "Catálogo | Viva & Encante",
  description: "Escolha Kits ou Produtos e peça orçamento rápido no WhatsApp.",
};

function GradientCard({
  title,
  desc,
  href,
  cta,
}: {
  title: string;
  desc: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* linha premium */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-sky-400" />

      {/* glow discreto */}
      <div className="pointer-events-none absolute -inset-6 opacity-0 blur-3xl transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/15 via-fuchsia-400/15 to-sky-400/15" />
      </div>

      <div className="relative p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-900">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{desc}</p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-white shadow-sm text-gray-900">
            <span className="text-lg">→</span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href={href}
            className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:opacity-95 bg-gradient-to-r from-pink-400 to-sky-400"
          >
            {cta}
          </Link>

          <p className="mt-3 text-xs text-gray-500">
            Clique para abrir o catálogo de {title.toLowerCase()}.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/70 via-white to-sky-100/70" />
        <div className="absolute -top-40 left-[-120px] h-[420px] w-[420px] rounded-full bg-pink-300/30 blur-3xl" />
        <div className="absolute -top-40 right-[-120px] h-[420px] w-[420px] rounded-full bg-sky-300/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
              Catálogo público • Orçamento rápido
            </p>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
              Catálogo
              <span className="block text-2xl sm:text-3xl font-extrabold text-gray-700">
                Viva &amp; Encante • Pegue &amp; Monte
              </span>
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-gray-700">
              Selecione <b>Kits</b> (com lista de itens incluídos) ou{" "}
              <b>Produtos</b> (itens individuais). Em poucos cliques você já
              solicita orçamento.
            </p>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-5 md:grid-cols-2">
          <GradientCard
            title="Kits"
            desc="Kits prontos com lista de produtos incluídos. Ideal para escolher rápido e já solicitar o orçamento."
            href="/catalogo/kits"
            cta="Ver kits"
          />
          <GradientCard
            title="Produtos"
            desc="Itens individuais (catálogo separado dos kits). Perfeito para montar algo sob medida."
            href="/catalogo/produtos"
            cta="Ver produtos"
          />
        </div>
      </section>
    </main>
  );
}
