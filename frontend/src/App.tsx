import { useCallback } from 'react';
import { Header } from './components/Header/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { GraficoGastos } from './components/GraficoGastos/GraficoGastos';
import { FormTransacao } from './components/FormTransacao/FormTransacao';
import { HistoricoTransacoes } from './components/HistoricoTransacoes/HistoricoTransacoes';
import { useDashboard } from './hooks/useDashboard';
import styles from './App.module.css';

function App() {
  const { resumo, gastosPorCategoria, carregando: carregandoDashboard, erro, atualizar: atualizarDashboard } = useDashboard();

  const handleNovaTransacao = useCallback(() => {
    atualizarDashboard();
  }, [atualizarDashboard]);

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>

          {erro && (
            <div className={styles.erroConexao}>
              ⚠️ {erro}
            </div>
          )}

          {/* Dashboard — Cards de resumo */}
          <Dashboard resumo={resumo} carregando={carregandoDashboard} />

          {/* Layout de dois painéis: formulário + gráfico */}
          <div className={styles.layoutPaineis}>
            <div className={styles.painel}>
              <h2 className={styles.painelTitulo}>💸 Nova Transação</h2>
              <FormTransacao onSucesso={handleNovaTransacao} />
            </div>

            <div className={styles.painel}>
              <h2 className={styles.painelTitulo}>📊 Gastos por Categoria</h2>
              <div className={styles.graficoCard}>
                <GraficoGastos dados={gastosPorCategoria} />
              </div>
            </div>
          </div>

          {/* Histórico completo */}
          <div className={styles.historicoWrapper}>
            <HistoricoTransacoes onAtualizar={handleNovaTransacao} />
          </div>

        </div>
      </main>

      <footer className={styles.footer}>
        <p>FinancyIA &copy; {new Date().getFullYear()} — Controle financeiro inteligente</p>
      </footer>
    </div>
  );
}

export default App;
