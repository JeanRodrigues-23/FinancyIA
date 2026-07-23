package com.estudo.financyia.model.dto;

/**
 * DTO de categoria para listagem e seleção no frontend.
 */
public record CategoriaDTO(
        Long id,
        String nome,
        String cor
) {
}
