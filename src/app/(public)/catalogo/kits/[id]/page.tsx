import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { BackToCatalog } from "@/components/ui/BackToCatalog";
import { Card } from "@/components/ui/Card";
import { KitDetail } from "@/components/catalog/KitDetail";
import { KitPublicService } from "@/lib/services/kit.public.service";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export default async function CatalogoKitIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const kit = await KitPublicService.getById(id);
  if (!kit) return notFound();

  const baseUrl = await getBaseUrl();
  const absoluteLink = `${baseUrl}/catalogo/kits/${kit.id}`;

  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        <BackToCatalog href="/catalogo/kits" label="← Voltar para kits" />
        <Card className="p-4 md:p-6">
          <KitDetail kit={kit} absoluteLink={absoluteLink} />
        </Card>
      </Container>
    </main>
  );
}
