import Link from "next/link";
import { INSTAGRAM_URL, WHATSAPP_NUMBER, SITE_NAME } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/utils/whatsapp";

export const metadata = {
  title: "Contato | Viva & Encante",
  description: "Fale com a Viva & Encante e solicite orçamento.",
};

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Contato</h1>
            <p className="mt-2 text-gray-600">
              Chame no WhatsApp para orçamento e disponibilidade.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
          >
            Voltar ao catálogo
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border p-6">
            <h2 className="text-lg font-bold text-gray-900">WhatsApp</h2>
            <p className="mt-2 text-gray-600">
              Clique abaixo e a mensagem já vai preenchida.
            </p>

            <a
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-pink-400 to-sky-400 px-5 py-3 text-sm font-bold text-white hover:opacity-90"
              href={buildWhatsAppLink({
                nome: SITE_NAME || "Viva & Encante",
                codigo: "CONTATO",
                link: "/contato",
                fotoUrl: "",
              })}
              target="_blank"
              rel="noreferrer"
            >
              Falar no WhatsApp (+{WHATSAPP_NUMBER})
            </a>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="text-lg font-bold text-gray-900">Instagram</h2>
            <p className="mt-2 text-gray-600">
              Veja fotos, novidades e inspirações.
            </p>

            <a
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-pink-400 to-sky-400 px-5 py-3 text-sm font-bold text-white hover:opacity-90"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
            >
              Abrir Instagram
            </a>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border bg-gray-50 p-6 text-sm text-gray-700">
          <b>Dica:</b> Quando você clicar em “Orçar no WhatsApp” no catálogo, a mensagem vai
          levar o nome/código do item. Aqui no contato é só a entrada direta.
        </div>
      </section>
    </main>
  );
}
