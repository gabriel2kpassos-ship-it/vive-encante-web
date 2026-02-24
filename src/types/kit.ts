export type KitItem = {
  produtoId: string;
  produtoNome: string;
  quantidade: number;
};

export type Kit = {
  // Firestore
  id: string;

  // Flutter (já existe no banco)
  nome: string;
  preco?: number;
  itens?: KitItem[];
  fotoUrl?: string;
  fotoPublicId?: string;

  // Campos novos (Flutter + Site)
  descricao?: string;

  // Controle de vitrine
  ativo?: boolean;        // se estiver false, some de tudo (sistema e/ou vitrine)
  publicado?: boolean;    // se estiver true, aparece no catálogo público

  // Extras do site
  codigo?: string;        // ex: KIT-001
  ordem?: number;         // ordenação manual
  createdAt?: any;
};