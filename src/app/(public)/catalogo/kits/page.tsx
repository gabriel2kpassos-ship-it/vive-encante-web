import { Container } from "@/components/layout/Container";
import { KitCard } from "@/components/catalog/KitCard";
import { KitPublicService } from "@/lib/services/kit.public.service";

export default async function CatalogoKitsPage() {
  const kits = await KitPublicService.getAll();

  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Kits</h1>
          <p className="mt-2 text-gray-600">
            Clique em um kit para ver detalhes e pedir no WhatsApp.
          </p>
        </div>

        {kits.length === 0 ? (
          <div className="mt-6 rounded-2xl border bg-gray-50 p-6 text-sm text-gray-600">
            Nenhum kit publicado no momento.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {kits.map((k) => (
              <KitCard key={k.id} kit={k} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
