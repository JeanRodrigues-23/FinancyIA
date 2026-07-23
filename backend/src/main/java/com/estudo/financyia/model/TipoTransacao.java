package com.estudo.financyia.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidade que representa os tipos de transação.
 * Referencia a tabela existente no banco de dados original.
 * IDs padrão: 1 = Ganho, 2 = Gasto
 */
@Entity
@Table(name = "tipotransacao")
@Getter
@Setter
@NoArgsConstructor
public class TipoTransacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;

    public TipoTransacao(Long id) {
        this.id = id;
    }
}
