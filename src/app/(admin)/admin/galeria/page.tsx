import { headers } from "next/headers";
import type { GaleriaItem } from "@/types/galeria";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GaleriaTable } from "@/components/admin/GaleriaTable";

async function getRequestContext() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const cookie = h.get("cookie") || "";
  return { baseUrl: `${proto}://${host}`, cookie };
}

export default async function AdminGaleriaPage() {
  const { baseUrl, cookie } = await getRequestContext();

  const res = await fetch(`${baseUrl}/admin/api/galeria`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Falha ao carregar galeria (${res.status}): ${txt}`);
  }

  const data = (await res.json()) as { items: GaleriaItem[] };
  const items = data.items ?? [];

  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Galeria</h1>
            <p className="mt-2 text-gray-600">
              Gerencie as fotos públicas exibidas no site.
            </p>
          </div>

          <div className="flex gap-2">
            <Button href="/admin" variant="outline">
              Voltar
            </Button>
            <Button href="/admin/galeria/novo">+ Nova foto</Button>
          </div>
        </div>

        <Card className="mt-6 p-4 md:p-6">
          <GaleriaTable items={items} />
        </Card>
      </Container>
    </main>
  );
}