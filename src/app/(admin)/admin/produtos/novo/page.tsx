"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProdutoForm } from "@/components/admin/ProdutoForm";

export default function NovoProdutoPage() {
  const router = useRouter();

  async function createProduto(data: {
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
    const res = await fetch("/admin/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || "Falha ao criar produto");
    }

    router.push("/admin/produtos");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Novo Produto</h1>
            <p className="mt-2 text-gray-600">
              Crie um produto. Você pode deixar como rascunho e publicar depois.
            </p>
          </div>

          <div className="flex gap-2">
            <Button href="/admin/produtos" variant="outline">
              Voltar
            </Button>
          </div>
        </div>

        <Card className="mt-6 p-4 md:p-6">
          <ProdutoForm onSubmit={createProduto} />
        </Card>
      </Container>
    </main>
  );
}