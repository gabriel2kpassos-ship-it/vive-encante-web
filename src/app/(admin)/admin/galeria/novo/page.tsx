import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GaleriaForm } from "@/components/admin/GaleriaForm";

async function getRequestContext() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const cookie = h.get("cookie") || "";
  return { baseUrl: `${proto}://${host}`, cookie };
}

export default function NovaFotoPage() {
  async function create(data: unknown) {
    "use server";
    const { baseUrl, cookie } = await getRequestContext();

    const r = await fetch(`${baseUrl}/admin/api/galeria`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie },
      body: JSON.stringify(data),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      throw new Error(`Falha ao criar (${r.status}): ${txt}`);
    }

    redirect("/admin/galeria");
  }

  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Nova Foto</h1>
            <p className="mt-2 text-gray-600">
              Envie a imagem e controle se ela aparece no site.
            </p>
          </div>

          <div className="flex gap-2">
            <Button href="/admin/galeria" variant="outline">
              Voltar
            </Button>
          </div>
        </div>

        <Card className="mt-6 p-4 md:p-6">
          <GaleriaForm onSubmit={create} />
        </Card>
      </Container>
    </main>
  );
}