import axios from 'axios';
import type {
  Transacao,
  TransacaoPayload,
  ResumoFinanceiro,
  Categoria,
  GastoPorCategoria,
  FiltrosTransacao,
  PaginaResponse,
} from '../types';

// Axios instance apontando para o backend (proxy via Vite)
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ========================
// TRANSAÇÕES
// ========================

export async function criarTransacao(payload: TransacaoPayload): Promise<Transacao> {
  const { data } = await api.post<Transacao>('/transacoes', payload);
  return data;
}

export async function listarTransacoes(
  filtros: Partial<FiltrosTransacao>,
  pagina: number = 0,
  tamanho: number = 10
): Promise<PaginaResponse<Transacao>> {
  const params: Record<string, string | number> = { pagina, tamanho };

  if (filtros.tipo) params.tipo = filtros.tipo;
  if (filtros.categoriaId) params.categoriaId = filtros.categoriaId;
  if (filtros.descricao) params.descricao = filtros.descricao;
  if (filtros.dataInicio) params.dataInicio = filtros.dataInicio;
  if (filtros.dataFim) params.dataFim = filtros.dataFim;

  const { data } = await api.get<PaginaResponse<Transacao>>('/transacoes', { params });
  return data;
}

export async function editarTransacao(id: number, payload: TransacaoPayload): Promise<Transacao> {
  const { data } = await api.put<Transacao>(`/transacoes/${id}`, payload);
  return data;
}

export async function cancelarTransacao(id: number): Promise<void> {
  await api.patch(`/transacoes/${id}/cancelar`);
}

// ========================
// RESUMO / DASHBOARD
// ========================

export async function obterResumo(): Promise<ResumoFinanceiro> {
  const { data } = await api.get<ResumoFinanceiro>('/resumo');
  return data;
}

export async function obterGastosPorCategoria(): Promise<GastoPorCategoria[]> {
  const { data } = await api.get<GastoPorCategoria[]>('/gastos-por-categoria');
  return data;
}

// ========================
// CATEGORIAS
// ========================

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>('/categorias');
  return data;
}

export async function criarCategoria(nome: string, cor: string): Promise<Categoria> {
  const { data } = await api.post<Categoria>('/categorias', { nome, cor });
  return data;
}
