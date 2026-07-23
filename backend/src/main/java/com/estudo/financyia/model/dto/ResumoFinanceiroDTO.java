package com.estudo.financyia.model.dto;

import java.math.BigDecimal;

/**
 * DTO de resumo financeiro retornado pelo endpoint GET /api/resumo.
 * Contém totais de ganhos, gastos e saldo calculado.
 */
public record ResumoFinanceiroDTO(
        BigDecimal saldo,
        BigDecimal totalGanhos,
        BigDecimal totalGastos,
        long quantidadeTransacoes,
        long quantidadeGanhos,
        long quantidadeGastos
) {
}
