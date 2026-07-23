package com.estudo.financyia.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO de transação usado tanto para entrada (POST/PUT) quanto para saída (GET).
 * O id e dataTransacao são ignorados na entrada (gerados automaticamente).
 */
public record TransacaoDTO(
        Long id,

        @NotNull(message = "O valor é obrigatório")
        @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero")
        BigDecimal valor,

        @NotBlank(message = "A descrição é obrigatória")
        String descricao,

        @NotBlank(message = "O tipo de transação é obrigatório")
        @Pattern(regexp = "Ganho|Gasto", message = "Tipo deve ser 'Ganho' ou 'Gasto'")
        String tipoTransacao,

        Long categoriaId,
        String categoriaNome,
        String categoriaCor,

        LocalDateTime dataTransacao
) {
}
