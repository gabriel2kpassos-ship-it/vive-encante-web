import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { GaleriaForm } from "@/components/admin/GaleriaForm";
import { DeleteGaleriaButton } from "@/components/admin/DeleteGaleriaButton";

import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type GaleriaItem = {
  id: string;
  titulo: string;
  descricao?: string;
  ativo: boolean;
  fotoUrl: string;
  fotoPublicId: string;
};


/* ================= CONTEXT ================= */

async function getRequestContext() {
  const h = await headers();

  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const cookie = h.get("cookie") || "";

  return {
    baseUrl: `${proto}://${host}`,
    cookie,
  };
}


/* ================= PAGE ================= */

export default async function EditarGaleriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const { baseUrl, cookie } = await getRequestContext();


  /* ================= LOAD ================= */

  const res = await fetch(
    `${baseUrl}/admin/api/galeria/${id}`,
    {
      cache: "no-store",
      headers: { cookie },
    }
  );


  if (res.status === 404)
    return notFound();


  if (!res.ok) {

    const txt = await res.text().catch(() => "");

    throw new Error(
      `Falha ao carregar foto (${res.status}): ${txt}`
    );

  }


  const data =
    (await res.json()) as { item: GaleriaItem };


  const item = data.item;


  /* ================= UPDATE ================= */

  async function update(form: {
    titulo: string;
    descricao?: string;
    ativo: boolean;
    fotoUrl: string;
    fotoPublicId: string;
  }) {

    "use server";

    const { baseUrl, cookie } =
      await getRequestContext();


    const r = await fetch(
      `${baseUrl}/admin/api/galeria/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          cookie,
        },
        body: JSON.stringify(form),
      }
    );


    if (!r.ok) {

      const txt =
        await r.text().catch(() => "");

      throw new Error(
        `Falha ao atualizar foto (${r.status}): ${txt}`
      );

    }


    redirect("/admin/galeria");

  }


  /* ================= UI ================= */

  return (

    <main className="min-h-screen bg-white py-10">

      <Container>


        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">


          <div>

            <h1 className="text-3xl font-extrabold text-gray-900">

              Editar Foto

            </h1>


            <p className="mt-2 text-gray-600">

              Ajuste título, status e imagem.

            </p>

          </div>



          {/* BOTÕES PADRÃO KITS */}

          <div className="flex items-center gap-3">

            <Button
              href="/admin/galeria"
              variant="outline"
            >
              Voltar
            </Button>


            <DeleteGaleriaButton
              id={id}
            />

          </div>


        </div>



        {/* FORM */}

        <Card className="mt-6 p-4 md:p-6">

          <GaleriaForm
            initialData={item}
            onSubmit={update}
          />

        </Card>



      </Container>

    </main>

  );

}