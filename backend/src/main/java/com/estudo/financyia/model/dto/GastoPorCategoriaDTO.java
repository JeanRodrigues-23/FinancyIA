package com.estudo.financyia.model.dto;

import java.math.BigDecimal;

/**
 * DTO para agrupamento de gastos por categoria (usado no gráfico de pizza).
 */
public record GastoPorCategoriaDTO(
        String categoria,
        String cor,
        BigDecimal total
) {
}
