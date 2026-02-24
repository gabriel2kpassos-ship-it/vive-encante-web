import { headers } from "next/headers";
import type { Produto } from "@/types/produto";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProdutoTable } from "@/components/admin/ProdutoTable";

async function getRequestContext() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const cookie = h.get("cookie") || "";
  return { baseUrl: `${proto}://${host}`, cookie };
}

export default async function AdminProdutosPage() {
  const { baseUrl, cookie } = await getRequestContext();

  const res = await fetch(`${baseUrl}/admin/api/produtos`, {
    cache: "no-store",
    headers: { cookie },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Falha ao carregar produtos (${res.status}): ${txt}`);
  }

  const data = (await res.json()) as { produtos: Produto[] };
  const produtos = data.produtos ?? [];

  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Produtos</h1>
            <p className="mt-2 text-gray-600">
              Gerencie os produtos individuais exibidos no catálogo.
            </p>
          </div>

          <div className="flex gap-2">
            <Button href="/admin" variant="outline">
              Voltar
            </Button>
            <Button href="/admin/produtos/novo">+ Novo produto</Button>
          </div>
        </div>

        <Card className="mt-6 p-4 md:p-6">
          <ProdutoTable produtos={produtos} />
        </Card>
      </Container>
    </main>
  );
}