export type GaleriaItem = {
  id: string;
  titulo: string;
  descricao?: string;
  fotoUrl: string;
  fotoPublicId: string;
  ativo: boolean;
  ordem: number;
  createdAt?: any;
};