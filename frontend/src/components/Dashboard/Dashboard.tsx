import type { ResumoFinanceiro } from '../../types';
import { formatarMoeda } from '../../utils/formatadores';
import styles from './Dashboard.module.css';

interface Props {
  resumo: ResumoFinanceiro | null;
  carregando: boolean;
}

function Card({
  titulo,
  valor,
  quantidade,
  tipo,
  carregando,
}: {
  titulo: string;
  valor: number;
  quantidade: number;
  tipo: 'saldo' | 'ganho' | 'gasto';
  carregando: boolean;
}) {
  const icons = { saldo: '💳', ganho: '📈', gasto: '📉' };

  return (
    <div className={`${styles.card} ${styles[`card--${tipo}`]}`}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>{icons[tipo]}</span>
        <span className={styles.cardTitulo}>{titulo}</span>
      </div>
      <div className={styles.cardValor}>
        {carregando ? (
          <div className={styles.skeleton} />
        ) : (
          <span className={`${styles.valor} ${styles[`valor--${tipo}`]}`}>
            {formatarMoeda(valor)}
          </span>
        )}
      </div>
      {!carregando && (
        <p className={styles.cardQuantidade}>
          {quantidade} {quantidade === 1 ? 'transação' : 'transações'}
        </p>
      )}
    </div>
  );
}

export function Dashboard({ resumo, carregando }: Props) {
  return (
    <section className={styles.dashboard}>
      <Card
        titulo="Saldo Total"
        valor={resumo?.saldo ?? 0}
        quantidade={resumo?.quantidadeTransacoes ?? 0}
        tipo="saldo"
        carregando={carregando}
      />
      <Card
        titulo="Total de Ganhos"
        valor={resumo?.totalGanhos ?? 0}
        quantidade={resumo?.quantidadeGanhos ?? 0}
        tipo="ganho"
        carregando={carregando}
      />
      <Card
        titulo="Total de Gastos"
        valor={resumo?.totalGastos ?? 0}
        quantidade={resumo?.quantidadeGastos ?? 0}
        tipo="gasto"
        carregando={carregando}
      />
    </section>
  );
}
