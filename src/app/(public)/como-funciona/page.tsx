import Link from "next/link";
import { SITE_NAME, WHATSAPP_NUMBER } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/utils/whatsapp";

export const metadata = {
  title: "Como funciona | Viva & Encante",
  description: "Entenda como funciona o aluguel e como solicitar orçamento.",
};

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Como funciona</h1>
            <p className="mt-2 text-gray-600">
              Processo simples: escolha, chame no WhatsApp, combine data e retire/receba.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
          >
            Ver catálogo
          </Link>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border p-6">
            <h2 className="text-lg font-bold text-gray-900">1) Escolha o kit ou produto</h2>
            <p className="mt-2 text-gray-600">
              No catálogo você encontra os kits (com vários itens) e produtos avulsos.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="text-lg font-bold text-gray-900">2) Solicite orçamento no WhatsApp</h2>
            <p className="mt-2 text-gray-600">
              Clique em “Orçar no WhatsApp” no item desejado. A mensagem já vai preenchida.
            </p>

            <a
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-400 to-sky-400 px-5 py-3 text-sm font-bold text-white hover:opacity-90"
              href={buildWhatsAppLink({
                nome: SITE_NAME || "Viva & Encante",
                codigo: "CONTATO",
                link: "/como-funciona",
                fotoUrl: "",
              })}
              target="_blank"
              rel="noreferrer"
            >
              Falar no WhatsApp (+{WHATSAPP_NUMBER})
            </a>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="text-lg font-bold text-gray-900">3) Combine data e retirada/entrega</h2>
            <p className="mt-2 text-gray-600">
              Você informa data do evento e local. A empresa confirma disponibilidade e valores.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="text-lg font-bold text-gray-900">4) Devolução</h2>
            <p className="mt-2 text-gray-600">
              Após o evento, devolve os itens conforme combinado.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
