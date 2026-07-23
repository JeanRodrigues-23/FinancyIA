import { useState, useCallback } from 'react';
import * as api from '../../api/transacaoApi';
import type { Transacao, FiltrosTransacao } from '../../types';
import { useTransacoes } from '../../hooks/useTransacoes';
import { formatarMoeda, formatarData } from '../../utils/formatadores';
import { ModalEditar } from '../ModalEditar/ModalEditar';
import styles from './HistoricoTransacoes.module.css';

interface FiltrosProps {
  filtros: FiltrosTransacao;
  onAplicar: (f: FiltrosTransacao) => void;
  onLimpar: () => void;
}

function FiltrosPainel({ filtros, onAplicar, onLimpar }: FiltrosProps) {
  const [local, setLocal] = useState<FiltrosTransacao>(filtros);

  return (
    <div className={styles.filtros}>
      <div className={styles.filtrosCampos}>
        <select
          id="filtro-tipo"
          className={styles.filtroInput}
          value={local.tipo}
          onChange={(e) => setLocal({ ...local, tipo: e.target.value as FiltrosTransacao['tipo'] })}
        >
          <option value="">Todos os tipos</option>
          <option value="Ganho">Ganhos</option>
          <option value="Gasto">Gastos</option>
        </select>

        <input
          id="filtro-descricao"
          className={styles.filtroInput}
          type="text"
          placeholder="Buscar descrição..."
          value={local.descricao}
          onChange={(e) => setLocal({ ...local, descricao: e.target.value })}
        />

        <input
          id="filtro-data-inicio"
          className={styles.filtroInput}
          type="date"
          value={local.dataInicio}
          onChange={(e) => setLocal({ ...local, dataInicio: e.target.value })}
        />

        <input
          id="filtro-data-fim"
          className={styles.filtroInput}
          type="date"
          value={local.dataFim}
          onChange={(e) => setLocal({ ...local, dataFim: e.target.value })}
        />
      </div>

      <div className={styles.filtrosBotoes}>
        <button
          id="btn-aplicar-filtro"
          className={`${styles.btnFiltro} ${styles.btnAplicar}`}
          onClick={() => onAplicar(local)}
        >
          🔍 Filtrar
        </button>
        <button
          id="btn-limpar-filtro"
          className={`${styles.btnFiltro} ${styles.btnLimpar}`}
          onClick={() => { setLocal({ tipo: '', categoriaId: null, descricao: '', dataInicio: '', dataFim: '' }); onLimpar(); }}
        >
          ✕ Limpar
        </button>
      </div>
    </div>
  );
}

interface LinhaProps {
  transacao: Transacao;
  onEditar: (t: Transacao) => void;
  onCancelar: (id: number) => void;
}

function LinhaTransacao({ transacao, onEditar, onCancelar }: LinhaProps) {
  const isGanho = transacao.tipoTransacao === 'Ganho';

  return (
    <tr className={`${styles.linha} animate-fade-in`}>
      <td className={styles.celData}>{formatarData(transacao.dataTransacao)}</td>
      <td className={styles.celTipo}>
        <span className={`${styles.badge} ${isGanho ? styles.badgeGanho : styles.badgeGasto}`}>
          {isGanho ? '📈' : '📉'} {transacao.tipoTransacao}
        </span>
      </td>
      <td className={styles.celDescricao}>{transacao.descricao}</td>
      <td className={styles.celCategoria}>
        {transacao.categoriaNome ? (
          <span
            className={styles.categoriaTag}
            style={{ borderColor: transacao.categoriaCor ?? '#6B7280', color: transacao.categoriaCor ?? '#6B7280' }}
          >
            {transacao.categoriaNome}
          </span>
        ) : (
          <span className={styles.semCategoria}>—</span>
        )}
      </td>
      <td className={`${styles.celValor} ${isGanho ? styles.valorGanho : styles.valorGasto}`}>
        {isGanho ? '+' : '-'} {formatarMoeda(transacao.valor)}
      </td>
      <td className={styles.celAcoes}>
        <button
          className={`${styles.btnAcao} ${styles.btnEditar}`}
          onClick={() => onEditar(transacao)}
          title="Editar transação"
          aria-label={`Editar ${transacao.descricao}`}
        >
          ✏️
        </button>
        <button
          className={`${styles.btnAcao} ${styles.btnCancelar}`}
          onClick={() => onCancelar(transacao.id)}
          title="Cancelar transação"
          aria-label={`Cancelar ${transacao.descricao}`}
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}

interface Props {
  onAtualizar: () => void;
}

export function HistoricoTransacoes({ onAtualizar }: Props) {
  const { transacoes, filtros, pagina, totalPaginas, totalElementos, carregando, atualizar, aplicarFiltros, limparFiltros, setPagina } = useTransacoes();
  const [transacaoEditando, setTransacaoEditando] = useState<Transacao | null>(null);

  const handleCancelar = useCallback(async (id: number) => {
    if (!window.confirm('Deseja cancelar esta transação?')) return;
    try {
      await api.cancelarTransacao(id);
      atualizar();
      onAtualizar();
    } catch {
      alert('Erro ao cancelar a transação.');
    }
  }, [atualizar, onAtualizar]);

  const handleSucessoEdicao = useCallback(() => {
    atualizar();
    onAtualizar();
  }, [atualizar, onAtualizar]);

  return (
    <section className={styles.section}>
      <div className={styles.cabecalho}>
        <h2 className={styles.titulo}>
          📋 Histórico de Transações
          {totalElementos > 0 && (
            <span className={styles.totalBadge}>{totalElementos}</span>
          )}
        </h2>
      </div>

      <FiltrosPainel filtros={filtros} onAplicar={aplicarFiltros} onLimpar={limparFiltros} />

      {carregando ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Carregando transações...</p>
        </div>
      ) : (transacoes || []).length === 0 ? (
        <div className={styles.vazio}>
          <span className={styles.vazioIcon}>🔍</span>
          <p>Nenhuma transação encontrada.</p>
          <p className={styles.vazioHint}>Adicione uma transação ou ajuste os filtros.</p>
        </div>
      ) : (
        <>
          <div className={styles.tabelaWrapper}>
            <table className={styles.tabela}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.thData}>Data</th>
                  <th className={styles.thTipo}>Tipo</th>
                  <th className={styles.thDescricao}>Descrição</th>
                  <th className={styles.thCategoria}>Categoria</th>
                  <th className={styles.thValor}>Valor</th>
                  <th className={styles.thAcoes}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {(transacoes || []).map((t) => (
                  <LinhaTransacao
                    key={t.id}
                    transacao={t}
                    onEditar={setTransacaoEditando}
                    onCancelar={handleCancelar}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className={styles.paginacao}>
              <button
                id="btn-pagina-anterior"
                className={styles.btnPagina}
                onClick={() => setPagina(p => p - 1)}
                disabled={pagina === 0}
              >
                ← Anterior
              </button>
              <span className={styles.paginaInfo}>
                Página {pagina + 1} de {totalPaginas}
              </span>
              <button
                id="btn-proxima-pagina"
                className={styles.btnPagina}
                onClick={() => setPagina(p => p + 1)}
                disabled={pagina >= totalPaginas - 1}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}

      <ModalEditar
        transacao={transacaoEditando}
        onFechar={() => setTransacaoEditando(null)}
        onSucesso={handleSucessoEdicao}
      />
    </section>
  );
}
