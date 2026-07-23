// =====================================
// Tipos compartilhados do FinancyIA
// =====================================

export interface Transacao {
  id: number;
  valor: number;
  descricao: string;
  tipoTransacao: 'Ganho' | 'Gasto';
  categoriaId: number | null;
  categoriaNome: string | null;
  categoriaCor: string | null;
  dataTransacao: string; // ISO string
}

export interface TransacaoPayload {
  valor: number;
  descricao: string;
  tipoTransacao: 'Ganho' | 'Gasto';
  categoriaId: number | null;
}

export interface ResumoFinanceiro {
  saldo: number;
  totalGanhos: number;
  totalGastos: number;
  quantidadeTransacoes: number;
  quantidadeGanhos: number;
  quantidadeGastos: number;
}

export interface Categoria {
  id: number;
  nome: string;
  cor: string;
}

export interface GastoPorCategoria {
  categoria: string;
  cor: string;
  total: number;
}

export interface FiltrosTransacao {
  tipo: '' | 'Ganho' | 'Gasto';
  categoriaId: number | null;
  descricao: string;
  dataInicio: string;
  dataFim: string;
}

export interface PaginaResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
