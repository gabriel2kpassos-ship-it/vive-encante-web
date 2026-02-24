import { headers } from "next/headers";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

function getPathnameFromHeaders(h: Headers) {
  // Next dev/proxy pode variar. Tentamos os mais comuns:
  const url =
    h.get("x-url") ||
    h.get("x-original-url") ||
    h.get("x-rewrite-url") ||
    h.get("next-url") ||
    "";

  if (url.startsWith("/")) return url;

  // fallback: se não vier, assume home
  return "/";
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = getPathnameFromHeaders(h);

  return (
    <>
      <PublicHeader pathname={pathname} />
      {children}
      <PublicFooter />
    </>
  );
}
