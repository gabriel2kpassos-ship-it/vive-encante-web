import { Container } from "./Container";
import { INSTAGRAM_URL, SITE_NAME } from "@/config/site";

export function PublicFooter() {
  return (
    <footer className="mt-16 border-t bg-white">
      <Container>
        <div className="py-10 grid gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Viva Encante" className="h-10 w-auto" />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Decoração infantil com carinho, organização e visual incrível.
            </p>
          </div>

          <div className="text-sm text-gray-700">
            <p className="font-semibold text-gray-900">Navegação</p>
            <ul className="mt-3 space-y-2">
              <li><a className="hover:underline" href="/catalogo">Catálogo</a></li>
              <li><a className="hover:underline" href="/como-funciona">Como funciona</a></li>
              <li><a className="hover:underline" href="/contato">Contato</a></li>
            </ul>
          </div>

          <div className="text-sm text-gray-700">
            <p className="font-semibold text-gray-900">Redes</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a className="hover:underline" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t py-6 text-xs text-gray-500">
          © {new Date().getFullYear()} {SITE_NAME}. Todos os direitos reservados.
        </div>
      </Container>
    </footer>
  );
}
