import Link from "next/link";
import { headers } from "next/headers";
import type { Kit } from "@/types/kit";

import { KitTable } from "@/components/admin/KitTable";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

async function getRequestContext() {

const h = await headers();

  const host = h.get("host") ?? "localhost:3000";

  const proto = h.get("x-forwarded-proto") ?? "http";

  const cookie = h.get("cookie") ?? "";

  const baseUrl = `${proto}://${host}`;

  return { baseUrl, cookie };

}

export default async function AdminKitsPage() {

  const { baseUrl, cookie } = await getRequestContext();

  const res = await fetch(`${baseUrl}/admin/api/kits`, {

    cache: "no-store",

    headers: {
      cookie,
    },

  });

  if (!res.ok) {

    throw new Error("Falha ao carregar kits");

  }

  const data = await res.json();

  const kits: Kit[] = data.kits ?? [];

  return (

    <main className="min-h-screen bg-white py-10">

      <Container>

        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div>

            <h1 className="text-3xl font-extrabold text-gray-900">
              Kits
            </h1>

            <p className="mt-2 text-gray-600">
              Crie, edite e publique os kits do catálogo.
            </p>

          </div>

          <div className="flex gap-2">

            <Button href="/admin" variant="outline">
              Voltar
            </Button>

            <Button href="/admin/kits/novo">
              + Novo kit
            </Button>

          </div>

        </div>


        {/* TABELA */}

        <Card className="mt-6 p-4 md:p-6">

          <KitTable kits={kits} />

        </Card>


      </Container>

    </main>

  );
}