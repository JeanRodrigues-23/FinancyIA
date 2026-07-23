package com.estudo.financyia.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidade que representa as categorias de transação.
 * Nova funcionalidade do FinancyIA — tabela criada automaticamente pelo Hibernate (ddl-auto=update).
 *
 * Categorias pré-cadastradas via data.sql:
 * 1 - Alimentação, 2 - Moradia, 3 - Transporte, 4 - Saúde,
 * 5 - Lazer, 6 - Educação, 7 - Salário, 8 - Investimento, 9 - Outros
 */
@Entity
@Table(name = "categoria")
@Getter
@Setter
@NoArgsConstructor
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String nome;

    @Column(length = 7)
    private String cor; // ex: "#4CAF50"

    public Categoria(Long id) {
        this.id = id;
    }
}
