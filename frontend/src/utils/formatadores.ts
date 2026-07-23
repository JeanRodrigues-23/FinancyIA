/**
 * Formata um número como moeda brasileira (R$).
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

/**
 * Formata uma string ISO de data para o padrão brasileiro (dd/mm/aaaa).
 */
export function formatarData(dataISO: string): string {
  if (!dataISO) return '—';
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formata uma string ISO de data incluindo hora (dd/mm/aaaa HH:mm).
 */
export function formatarDataHora(dataISO: string): string {
  if (!dataISO) return '—';
  const data = new Date(dataISO);
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
