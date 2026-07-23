import { useState, useCallback, useEffect } from 'react';
import * as api from '../api/transacaoApi';
import type { ResumoFinanceiro, GastoPorCategoria } from '../types';

/**
 * Hook para gerenciar os dados do dashboard (resumo financeiro + gráfico).
 */
export function useDashboard() {
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [gastosPorCategoria, setGastosPorCategoria] = useState<GastoPorCategoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const atualizar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [resumoData, gastosData] = await Promise.all([
        api.obterResumo(),
        api.obterGastosPorCategoria(),
      ]);
      setResumo(resumoData);
      setGastosPorCategoria(gastosData);
    } catch (e) {
      setErro('Erro ao carregar dados do dashboard. Verifique se o servidor está rodando.');
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    atualizar();
  }, [atualizar]);

  return { resumo, gastosPorCategoria, carregando, erro, atualizar };
}
