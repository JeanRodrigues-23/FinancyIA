package com.estudo.financyia.service;

import com.estudo.financyia.model.Categoria;
import com.estudo.financyia.model.StatusTransacao;
import com.estudo.financyia.model.TipoTransacao;
import com.estudo.financyia.model.Transacao;
import com.estudo.financyia.model.dto.GastoPorCategoriaDTO;
import com.estudo.financyia.model.dto.ResumoFinanceiroDTO;
import com.estudo.financyia.model.dto.TransacaoDTO;
import com.estudo.financyia.repository.TransacaoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;

    // ========================
    // CRIAR NOVA TRANSAÇÃO
    // ========================

    public TransacaoDTO registrarNovaTransacao(TransacaoDTO dto) {
        Transacao transacao = converterDTOParaEntidade(dto);
        Transacao salva = transacaoRepository.save(transacao);
        return converterEntidadeParaDTO(salva);
    }

    // ========================
    // LISTAR COM FILTROS + PAGINAÇÃO
    // ========================

    @Transactional(readOnly = true)
    public Page<TransacaoDTO> listarTransacoes(
            String tipo,
            Long categoriaId,
            String descricao,
            LocalDateTime dataInicio,
            LocalDateTime dataFim,
            int pagina,
            int tamanhoPagina
    ) {
        Long tipoId = null;
        if (tipo != null && !tipo.isBlank()) {
            tipoId = tipo.equalsIgnoreCase("Ganho") ? 1L : 2L;
        }

        String descricaoFiltro = (descricao != null && !descricao.isBlank()) ? descricao : null;
        Long categoriaFiltro = (categoriaId != null && categoriaId > 0) ? categoriaId : null;

        Pageable pageable = PageRequest.of(pagina, tamanhoPagina);

        return transacaoRepository
                .findComFiltros(tipoId, categoriaFiltro, descricaoFiltro, dataInicio, dataFim, pageable)
                .map(this::converterEntidadeParaDTO);
    }

    // ========================
    // EDITAR TRANSAÇÃO
    // ========================

    public TransacaoDTO editarTransacao(Long id, TransacaoDTO dto) {
        Transacao existente = transacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transação não encontrada com id: " + id));

        existente.setValor(dto.valor());
        existente.setDescricao(dto.descricao());
        existente.setTipoTransacao(new TipoTransacao(resolverTipoId(dto.tipoTransacao())));

        if (dto.categoriaId() != null) {
            existente.setCategoria(new Categoria(dto.categoriaId()));
        } else {
            existente.setCategoria(null);
        }

        Transacao atualizada = transacaoRepository.save(existente);
        return converterEntidadeParaDTO(atualizada);
    }

    // ========================
    // CANCELAR TRANSAÇÃO
    // ========================

    public void cancelarTransacao(Long id) {
        if (!transacaoRepository.existsById(id)) {
            throw new EntityNotFoundException("Transação não encontrada com id: " + id);
        }
        transacaoRepository.cancelarTransacao(id);
    }

    // ========================
    // RESUMO FINANCEIRO (DASHBOARD)
    // ========================

    @Transactional(readOnly = true)
    public ResumoFinanceiroDTO obterResumoFinanceiro() {
        BigDecimal saldo = transacaoRepository.calcularSaldo();
        BigDecimal totalGanhos = transacaoRepository.calcularTotalGanhos();
        BigDecimal totalGastos = transacaoRepository.calcularTotalGastos();
        long qtdGanhos = transacaoRepository.contarPorTipo(1L);
        long qtdGastos = transacaoRepository.contarPorTipo(2L);

        return new ResumoFinanceiroDTO(
                saldo,
                totalGanhos,
                totalGastos,
                qtdGanhos + qtdGastos,
                qtdGanhos,
                qtdGastos
        );
    }

    // ========================
    // GASTOS POR CATEGORIA (GRÁFICO)
    // ========================

    @Transactional(readOnly = true)
    public List<GastoPorCategoriaDTO> obterGastosPorCategoria() {
        List<Object[]> resultados = transacaoRepository.calcularGastosPorCategoria();

        return resultados.stream().map(row -> new GastoPorCategoriaDTO(
                (String) row[0],
                (String) row[1],
                (BigDecimal) row[2]
        )).collect(Collectors.toList());
    }

    // ========================
    // CONVERSORES PRIVADOS
    // ========================

    private Transacao converterDTOParaEntidade(TransacaoDTO dto) {
        Transacao transacao = new Transacao();

        transacao.setValor(dto.valor());
        transacao.setDescricao(dto.descricao());
        transacao.setTipoTransacao(new TipoTransacao(resolverTipoId(dto.tipoTransacao())));
        transacao.setStatusTransacao(new StatusTransacao(1L)); // 1 = Ativo
        transacao.setCancelada(false);

        if (dto.categoriaId() != null) {
            transacao.setCategoria(new Categoria(dto.categoriaId()));
        }

        return transacao;
    }

    private TransacaoDTO converterEntidadeParaDTO(Transacao transacao) {
        String tipoNome = (transacao.getTipoTransacao() != null)
                ? (transacao.getTipoTransacao().getId() == 1 ? "Ganho" : "Gasto")
                : "Desconhecido";

        Long categoriaId = null;
        String categoriaNome = null;
        String categoriaCor = null;

        if (transacao.getCategoria() != null) {
            categoriaId = transacao.getCategoria().getId();
            categoriaNome = transacao.getCategoria().getNome();
            categoriaCor = transacao.getCategoria().getCor();
        }

        return new TransacaoDTO(
                transacao.getId(),
                transacao.getValor(),
                transacao.getDescricao(),
                tipoNome,
                categoriaId,
                categoriaNome,
                categoriaCor,
                transacao.getDataTransacao()
        );
    }

    private Long resolverTipoId(String tipoTransacao) {
        return switch (tipoTransacao.toLowerCase()) {
            case "ganho" -> 1L;
            case "gasto" -> 2L;
            default -> throw new IllegalArgumentException("Tipo de transação inválido: " + tipoTransacao);
        };
    }
}
