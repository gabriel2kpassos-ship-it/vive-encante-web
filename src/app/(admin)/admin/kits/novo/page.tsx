"use client";

import { useRouter } from "next/navigation";
import { KitForm } from "@/components/admin/KitForm";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function NovoKitPage() {
  const router = useRouter();

  async function createKit(data: {
    nome: string;
    descricao?: string;
    preco?: number;

    ativo: boolean;
    publicado: boolean;
    ordem: number;

    fotoUrl?: string;
    fotoPublicId?: string;
  }) {
    const res = await fetch("/admin/api/kits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || "Falha ao criar kit");
    }

    router.push("/admin/kits");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Novo Kit</h1>
            <p className="mt-2 text-gray-600">
              Preencha os dados, envie a foto e escolha se vai publicar na vitrine.
            </p>
          </div>

          <div className="flex gap-2">
            <Button href="/admin/kits" variant="outline">
              Voltar
            </Button>
          </div>
        </div>

        {/* FORM */}
        <Card className="mt-6 p-5 md:p-6">
          <KitForm onSubmit={createKit} />
        </Card>
      </Container>
    </main>
  );
}