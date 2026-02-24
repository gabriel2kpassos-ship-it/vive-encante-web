export type Produto = {
  id: string;

  // Flutter (já existe no banco)
  nome: string;
  quantidade?: number;
  fotoUrl?: string;
  fotoPublicId?: string;

  // Campos novos (Flutter + Site)
  descricao?: string;

  // Controle de vitrine
  ativo?: boolean;        // se estiver false, some de tudo
  publicado?: boolean;    // se estiver true, aparece no catálogo público

  // Extras do site
  codigo?: string;        // ex: PRO-001
  preco?: number;
  ordem?: number;
  createdAt?: any;
};