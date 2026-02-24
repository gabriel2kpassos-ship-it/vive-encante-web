import { ProdutoService } from "@/lib/services/produto.service";
import { Container } from "@/components/layout/Container";
import { ProdutoCard } from "@/components/catalog/ProdutoCard";

export default async function CatalogoProdutosPage() {
  const produtos = await ProdutoService.listPublicActive();

  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Produtos</h1>
          <p className="mt-2 text-gray-600">
            Clique em um produto para ver detalhes e pedir no WhatsApp.
          </p>
        </div>

        {produtos.length === 0 ? (
          <div className="mt-6 rounded-2xl border bg-gray-50 p-6 text-sm text-gray-600">
            Nenhum produto publicado no momento.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((p) => (
              <ProdutoCard key={p.id} produto={p} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}