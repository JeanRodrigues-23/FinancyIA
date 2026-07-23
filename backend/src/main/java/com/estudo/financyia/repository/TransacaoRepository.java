package com.estudo.financyia.repository;

import com.estudo.financyia.model.Transacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    /**
     * Retorna todas as transações ativas (não canceladas), ordenadas por data decrescente.
     * Suporta filtros opcionais por tipo, categoria e período.
     */
    @Query("""
        SELECT t FROM Transacao t
        WHERE t.cancelada = false
          AND (:tipoId IS NULL OR t.tipoTransacao.id = :tipoId)
          AND (:categoriaId IS NULL OR t.categoria.id = :categoriaId)
          AND (CAST(:descricao AS String) IS NULL OR LOWER(t.descricao) LIKE LOWER(CONCAT('%', CAST(:descricao AS String), '%')))
          AND (CAST(:dataInicio AS LocalDateTime) IS NULL OR t.dataTransacao >= :dataInicio)
          AND (CAST(:dataFim AS LocalDateTime) IS NULL OR t.dataTransacao <= :dataFim)
        ORDER BY t.dataTransacao DESC
    """)
    Page<Transacao> findComFiltros(
            @Param("tipoId") Long tipoId,
            @Param("categoriaId") Long categoriaId,
            @Param("descricao") String descricao,
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim,
            Pageable pageable
    );

    /**
     * Calcula o saldo total (ganhos - gastos) das transações ativas.
     */
    @Query(value = """
        SELECT COALESCE(SUM(
            CASE
                WHEN fktipotransacao = 1 THEN valor
                WHEN fktipotransacao = 2 THEN -valor
                ELSE 0
            END
        ), 0)
        FROM transacao
        WHERE cancelada = false
    """, nativeQuery = true)
    BigDecimal calcularSaldo();

    /**
     * Calcula o total de ganhos das transações ativas.
     */
    @Query(value = "SELECT COALESCE(SUM(valor), 0) FROM transacao WHERE fktipotransacao = 1 AND cancelada = false", nativeQuery = true)
    BigDecimal calcularTotalGanhos();

    /**
     * Calcula o total de gastos das transações ativas.
     */
    @Query(value = "SELECT COALESCE(SUM(valor), 0) FROM transacao WHERE fktipotransacao = 2 AND cancelada = false", nativeQuery = true)
    BigDecimal calcularTotalGastos();

    /**
     * Contagem de transações ativas por tipo.
     */
    @Query("SELECT COUNT(t) FROM Transacao t WHERE t.cancelada = false AND t.tipoTransacao.id = :tipoId")
    long contarPorTipo(@Param("tipoId") Long tipoId);

    /**
     * Cancela logicamente uma transação pelo ID.
     */
    @Modifying
    @Query("UPDATE Transacao t SET t.cancelada = true WHERE t.id = :id")
    void cancelarTransacao(@Param("id") Long id);

    /**
     * Retorna gastos agrupados por categoria para o gráfico.
     */
    @Query(value = """
        SELECT c.nome, c.cor, COALESCE(SUM(t.valor), 0) as total
        FROM transacao t
        INNER JOIN categoria c ON t.fkcategoria = c.id
        WHERE t.cancelada = false AND t.fktipotransacao = 2
        GROUP BY c.id, c.nome, c.cor
        ORDER BY total DESC
    """, nativeQuery = true)
    List<Object[]> calcularGastosPorCategoria();
}
