import Link from "next/link";
import { Container } from "./Container";
import { INSTAGRAM_URL } from "@/config/site";

type Props = {
  pathname: string;
};

const NAV = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo/kits", label: "Kits" },
  { href: "/catalogo/produtos", label: "Produtos" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/galeria", label: "Galeria" },
  { href: "/contato", label: "Contato" },
];

function isActive(pathname: string, href: string) {
  if (href === "/catalogo") return pathname === "/catalogo";
  return pathname === href || pathname.startsWith(href + "/");
}

export function PublicHeader({ pathname }: Props) {
  const showBackToCatalog = !pathname.startsWith("/catalogo");

  return (
    <header className="sticky top-0 z-50">
      <div className="relative border-b bg-white/70 backdrop-blur">
        {/* fundo com vida */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-pink-300/30 blur-3xl" />
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute left-1/2 top-0 h-16 w-[70%] -translate-x-1/2 bg-gradient-to-r from-pink-400/20 via-fuchsia-400/20 to-sky-400/20 blur-2xl" />
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-sky-400" />

        <Container>
          <div className="relative flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Viva Encante" className="h-11 w-auto" />
            </Link>

            {/* NAV desktop */}
            <nav className="hidden md:flex items-center gap-1 rounded-2xl border bg-white/60 px-2 py-1 shadow-sm">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "rounded-xl px-3 py-2 text-sm font-semibold transition",
                      active
                        ? "text-white shadow-sm bg-gradient-to-r from-pink-400 to-sky-400"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Ações */}
            <div className="flex items-center gap-2">
              {showBackToCatalog && (
                <Link
                  href="/catalogo"
                  className="hidden md:inline-flex items-center rounded-xl border px-3 py-2 text-sm font-extrabold text-gray-900 hover:bg-gray-50"
                >
                  ← Catálogo
                </Link>
              )}

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 text-sm font-extrabold text-pink-700 hover:bg-pink-100"
              >
                Instagram
              </a>

              {/* Mobile: menu SEM JS */}
              <details className="relative md:hidden">
                <summary className="list-none cursor-pointer select-none rounded-xl bg-gradient-to-r from-pink-400 to-sky-400 px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:opacity-95">
                  Menu
                </summary>

                <div className="absolute right-0 mt-2 w-[78vw] max-w-sm overflow-hidden rounded-2xl border bg-white shadow-xl">
                  <div className="h-1 w-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-sky-400" />

                  <div className="p-3 grid gap-2">
                    {showBackToCatalog && (
                      <Link
                        href="/catalogo"
                        className="rounded-2xl border bg-gray-50 px-4 py-3 text-sm font-extrabold text-gray-900"
                      >
                        ← Voltar ao Catálogo
                      </Link>
                    )}

                    {NAV.map((item) => {
                      const active = isActive(pathname, item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={[
                            "rounded-2xl px-4 py-3 text-sm font-extrabold transition",
                            active
                              ? "text-white bg-gradient-to-r from-pink-400 to-sky-400 shadow-sm"
                              : "border bg-white text-gray-900 hover:bg-gray-50",
                          ].join(" ")}
                        >
                          {item.label}
                        </Link>
                      );
                    })}

                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm font-extrabold text-pink-700"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
