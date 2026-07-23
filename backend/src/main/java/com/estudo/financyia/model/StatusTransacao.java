package com.estudo.financyia.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidade que representa os status de transação.
 * Referencia a tabela existente no banco de dados original.
 * IDs padrão: 1 = Ativo, 2 = Cancelado
 */
@Entity
@Table(name = "statustransacao")
@Getter
@Setter
@NoArgsConstructor
public class StatusTransacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "descricao")
    private String descricao;

    public StatusTransacao(Long id) {
        this.id = id;
    }
}
