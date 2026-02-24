import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { KitForm } from "@/components/admin/KitForm";
import { DeleteKitButton } from "@/components/admin/DeleteKitButton";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Kit } from "@/types/kit";

async function getRequestContext() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const cookie = h.get("cookie") || "";
  return { baseUrl: `${proto}://${host}`, cookie };
}

export default async function EditarKitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { baseUrl, cookie } = await getRequestContext();

  const res = await fetch(`${baseUrl}/admin/api/kits/${id}`, {
    cache: "no-store",
    headers: { cookie },
  });

  if (res.status === 404) return notFound();
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Falha ao carregar kit (${res.status}): ${txt}`);
  }

  const data = (await res.json()) as { kit: Kit };
  const kit = data.kit;

  async function updateKit(form: {
    nome: string;
    descricao?: string;
    preco?: number;

    ativo: boolean;
    publicado: boolean;
    ordem: number;

    fotoUrl?: string;
    fotoPublicId?: string;
  }) {
    "use server";

    const { baseUrl, cookie } = await getRequestContext();

    const r = await fetch(`${baseUrl}/admin/api/kits/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
      body: JSON.stringify(form),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      throw new Error(`Falha ao atualizar kit (${r.status}): ${txt}`);
    }

    redirect("/admin/kits");
  }

  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Editar Kit
            </h1>
            <p className="mt-2 text-gray-600">
              Ajuste o kit e controle publicação/ordem/foto. Depois salve.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button href="/admin/kits" variant="outline">
              Voltar
            </Button>

            {/* DeleteKitButton normalmente já faz fetch e redireciona */}
            <DeleteKitButton id={id} />
          </div>
        </div>

        {/* FORM */}
        <Card className="mt-6 p-4 md:p-6">
          <KitForm initialData={kit} onSubmit={updateKit} />
        </Card>
      </Container>
    </main>
  );
}