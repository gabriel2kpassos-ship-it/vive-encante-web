"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminHome() {
  const router = useRouter();
  const [loadingLogout, setLoadingLogout] = useState(false);

  async function handleLogout() {
    if (loadingLogout) return;
    setLoadingLogout(true);

    try {
      const res = await fetch("/admin/api/logout", { method: "POST" });
      if (!res.ok) throw new Error("Falha ao sair");

      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      // se der ruim, pelo menos volta pro login
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoadingLogout(false);
    }
  }

  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Painel Admin</h1>
          <p className="mt-2 text-gray-600">Gerencie kits, produtos e galeria do site.</p>
        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* KITS */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-gray-900">Kits</h2>
              <Badge>KITS</Badge>
            </div>

            <p className="mt-2 text-sm text-gray-600">Criar, editar e publicar kits.</p>

            <div className="mt-5 flex gap-2">
              <Button href="/admin/kits">Ver todos</Button>
              <Button href="/admin/kits/novo" variant="outline">Novo</Button>
            </div>
          </Card>

          {/* PRODUTOS */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-gray-900">Produtos</h2>
              <Badge>PROD</Badge>
            </div>

            <p className="mt-2 text-sm text-gray-600">Gerenciar produtos individuais.</p>

            <div className="mt-5 flex gap-2">
              <Button href="/admin/produtos">Ver todos</Button>
              <Button href="/admin/produtos/novo" variant="outline">Novo</Button>
            </div>
          </Card>

          {/* GALERIA */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-gray-900">Galeria</h2>
              <Badge>FOTOS</Badge>
            </div>

            <p className="mt-2 text-sm text-gray-600">Fotos públicas do site.</p>

            <div className="mt-5 flex gap-2">
              <Button href="/admin/galeria">Ver todas</Button>
              <Button href="/admin/galeria/novo" variant="outline">Nova</Button>
            </div>
          </Card>
        </div>

        {/* LOGOUT */}
        <div className="mt-10">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loadingLogout}
            className="rounded-xl border px-4 py-2 text-sm font-extrabold text-gray-900 hover:bg-gray-50 disabled:opacity-60"
          >
            {loadingLogout ? "Saindo..." : "Sair"}
          </button>
        </div>
      </Container>
    </main>
  );
}