import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { BackToCatalog } from "@/components/ui/BackToCatalog";
import { Card } from "@/components/ui/Card";
import { ProdutoDetail } from "@/components/catalog/ProdutoDetail";

import { ProdutoService } from "@/lib/services/produto.service";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export default async function CatalogoProdutoIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const produto = await ProdutoService.getPublicById(id);
  if (!produto) return notFound();

  const baseUrl = await getBaseUrl();
  const absoluteLink = `${baseUrl}/catalogo/produtos/${produto.id}`;

  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        <BackToCatalog href="/catalogo/produtos" label="← Voltar para produtos" />
        <Card className="p-4 md:p-6">
          <ProdutoDetail produto={produto} absoluteLink={absoluteLink} />
        </Card>
      </Container>
    </main>
  );
}
