package com.estudo.financyia.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidade principal do sistema financeiro.
 * Mapeia a tabela 'transacao' existente no banco de dados original.
 * A coluna 'fkcategoria' é nova e nullable para compatibilidade retroativa.
 * A coluna 'cancelada' é mapeada diretamente (antes era gerenciada via statustransacao).
 */
@Entity
@Table(name = "transacao")
@Getter
@Setter
@NoArgsConstructor
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "datatransacao")
    private LocalDateTime dataTransacao = LocalDateTime.now();

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valor;

    @Column(length = 255)
    private String descricao;

    /**
     * Tipo da transação: 1 = Ganho, 2 = Gasto
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fktipotransacao", referencedColumnName = "id", nullable = false)
    private TipoTransacao tipoTransacao;

    /**
     * Status da transação: 1 = Ativo
     * Mantido por compatibilidade com o schema original.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fkstatustransacao", referencedColumnName = "id")
    private StatusTransacao statusTransacao;

    /**
     * Coluna de cancelamento do schema original.
     * false = ativa, true = cancelada
     */
    @Column(nullable = false)
    private Boolean cancelada = false;

    /**
     * Categoria da transação — nova funcionalidade do FinancyIA.
     * Nullable para manter compatibilidade com registros já existentes.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fkcategoria", referencedColumnName = "id", nullable = true)
    private Categoria categoria;
}
