"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Kit } from "@/types/kit";

export function KitTable({ kits }: { kits: Kit[] }) {

  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function toggleAtivo(id: string, ativo: boolean) {

    try {

      setLoadingId(id);

      const res = await fetch(`/admin/api/kits/${id}`, {

        method: "PATCH",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          ativo: !ativo,

        }),

      });

      if (!res.ok) {

        alert("Erro ao atualizar");

      }

      router.refresh();

    }

    finally {

      setLoadingId(null);

    }

  }

  if (!kits.length) {

    return (

      <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">

        Nenhum kit cadastrado

      </div>

    );

  }

  return (

    <div className="bg-white border rounded-2xl overflow-hidden">

      <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 text-xs font-bold text-gray-600">

        <div className="col-span-6">

          Kit

        </div>

        <div className="col-span-2">

          Código

        </div>

        <div className="col-span-2">

          Status

        </div>

        <div className="col-span-2 text-right">

          Ações

        </div>

      </div>


      <div className="divide-y">

        {kits.map((kit) => (

          <div

            key={kit.id}

            className="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50"

          >


            <div className="col-span-6 flex items-center gap-4">

              <img

                src={kit.fotoUrl || "/placeholder.png"}

                className="w-14 h-14 rounded-xl object-cover border"

              />


              <div className="leading-tight">

  <div className="text-xs font-semibold text-gray-500">

    Nome

  </div>

  <div className="font-bold text-gray-900">

    {kit.nome}

  </div>


  <div className="mt-1 text-xs font-semibold text-gray-500">

    Descrição

  </div>

  <div className="text-sm text-gray-700">

    {kit.descricao || "Sem descrição"}

  </div>

</div>

            </div>


            <div className="col-span-2 font-mono text-sm text-gray-800">

              {kit.codigo || "AUTO"}

            </div>


            <div className="col-span-2">

              <button

                onClick={() => toggleAtivo(kit.id, Boolean(kit.ativo))}

                disabled={loadingId === kit.id}

                className={

                  kit.ativo

                    ? "px-3 py-1 text-xs font-bold bg-green-100 text-green-700 border border-green-200 rounded-full"

                    : "px-3 py-1 text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200 rounded-full"

                }

              >

                {loadingId === kit.id

                  ? "..."

                  : kit.ativo

                  ? "ATIVO"

                  : "INATIVO"}

              </button>

            </div>


            <div className="col-span-2 text-right">

              <Link

                href={`/admin/kits/${kit.id}`}

                className="text-sm font-bold text-blue-600 hover:underline"

              >

                Editar

              </Link>

            </div>


          </div>

        ))}

      </div>


    </div>

  );

}