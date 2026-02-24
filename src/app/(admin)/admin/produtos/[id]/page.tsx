import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { ProdutoForm } from "@/components/admin/ProdutoForm";
import { DeleteProdutoButton } from "@/components/admin/DeleteProdutoButton";

import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Produto } from "@/types/produto";

async function getRequestContext() {
  const h = await headers();

  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const cookie = h.get("cookie") || "";

  return { baseUrl: `${proto}://${host}`, cookie };
}

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { baseUrl, cookie } = await getRequestContext();

  const res = await fetch(`${baseUrl}/admin/api/produtos/${id}`, {
    cache: "no-store",
    headers: { cookie },
  });

  if (res.status === 404) return notFound();

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Falha ao carregar produto (${res.status}): ${txt}`);
  }

  const data = (await res.json()) as { produto: Produto };
  const produto = data.produto;

  async function updateProduto(form: {
    nome: string;
    descricao?: string;
    quantidade?: number;

    ativo: boolean;
    publicado: boolean;
    ordem: number;

    fotoUrl?: string;
    fotoPublicId?: string;

    codigo?: string;
    preco?: number;
  }) {
    "use server";

    const { baseUrl, cookie } = await getRequestContext();

    const r = await fetch(`${baseUrl}/admin/api/produtos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
      body: JSON.stringify(form),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      throw new Error(`Falha ao atualizar produto (${r.status}): ${txt}`);
    }

    redirect("/admin/produtos");
  }

  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Editar Produto
            </h1>
            <p className="mt-2 text-gray-600">
              Ajuste dados, estoque, ordem e publicação. Depois salve.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button href="/admin/produtos" variant="outline">
              Voltar
            </Button>

            <DeleteProdutoButton id={id} />
          </div>
        </div>

        {/* FORM */}
        <Card className="mt-6 p-4 md:p-6">
          <ProdutoForm initialData={produto} onSubmit={updateProduto} />
        </Card>
      </Container>
    </main>
  );
}