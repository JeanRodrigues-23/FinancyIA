import { useState, useCallback, useEffect } from 'react';
import * as api from '../api/transacaoApi';
import type { Transacao, FiltrosTransacao } from '../types';

const FILTROS_INICIAIS: FiltrosTransacao = {
  tipo: '',
  categoriaId: null,
  descricao: '',
  dataInicio: '',
  dataFim: '',
};

/**
 * Hook para gerenciar a lista de transações com filtros e paginação.
 */
export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [filtros, setFiltros] = useState<FiltrosTransacao>(FILTROS_INICIAIS);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const TAMANHO_PAGINA = 10;

  const buscarTransacoes = useCallback(async (filtrosAtivos: FiltrosTransacao, paginaAtual: number) => {
    setCarregando(true);
    setErro(null);
    try {
      const resultado = await api.listarTransacoes(filtrosAtivos, paginaAtual, TAMANHO_PAGINA);
      setTransacoes(resultado?.content || (Array.isArray(resultado) ? resultado : []));
      setTotalPaginas(resultado?.totalPages || 0);
      setTotalElementos(resultado?.totalElements || 0);
    } catch (e) {
      setErro('Erro ao carregar transações.');
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, []);

  const atualizar = useCallback(() => {
    buscarTransacoes(filtros, pagina);
  }, [buscarTransacoes, filtros, pagina]);

  useEffect(() => {
    buscarTransacoes(filtros, pagina);
  }, [buscarTransacoes, filtros, pagina]);

  const aplicarFiltros = useCallback((novosFiltros: FiltrosTransacao) => {
    setFiltros(novosFiltros);
    setPagina(0);
  }, []);

  const limparFiltros = useCallback(() => {
    setFiltros(FILTROS_INICIAIS);
    setPagina(0);
  }, []);

  return {
    transacoes,
    filtros,
    pagina,
    totalPaginas,
    totalElementos,
    carregando,
    erro,
    atualizar,
    aplicarFiltros,
    limparFiltros,
    setPagina,
  };
}
