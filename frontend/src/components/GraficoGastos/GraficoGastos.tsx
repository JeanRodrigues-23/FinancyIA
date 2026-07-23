import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { GastoPorCategoria } from '../../types';
import { formatarMoeda } from '../../utils/formatadores';
import styles from './GraficoGastos.module.css';

interface Props {
  dados: GastoPorCategoria[];
}

const CORES_PADRAO = [
  '#6366F1', '#EF4444', '#F97316', '#22C55E',
  '#3B82F6', '#8B5CF6', '#EAB308', '#10B981',
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TooltipCustomizado = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipNome}>{item.name}</p>
        <p className={styles.tooltipValor}>{formatarMoeda(item.value)}</p>
        <p className={styles.tooltipPercent}>{(item.payload.percent * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export function GraficoGastos({ dados }: Props) {
  if (dados.length === 0) {
    return (
      <div className={styles.vazio}>
        <span className={styles.vazioIcon}>📊</span>
        <p>Nenhum gasto com categoria registrado.</p>
        <p className={styles.vazioHint}>Categorize suas transações para ver o gráfico!</p>
      </div>
    );
  }

  const dadosFormatados = dados.map((item, idx) => ({
    name: item.categoria,
    value: item.total,
    cor: item.cor || CORES_PADRAO[idx % CORES_PADRAO.length],
  }));

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={dadosFormatados}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {dadosFormatados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.cor} />
            ))}
          </Pie>
          <Tooltip content={<TooltipCustomizado />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
