package com.estudo.financyia.controller;

import com.estudo.financyia.model.dto.GastoPorCategoriaDTO;
import com.estudo.financyia.model.dto.ResumoFinanceiroDTO;
import com.estudo.financyia.model.dto.TransacaoDTO;
import com.estudo.financyia.service.TransacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TransacaoController {

    private final TransacaoService transacaoService;

    /**
     * POST /api/transacoes
     * Registra uma nova transação (ganho ou gasto).
     */
    @PostMapping("/transacoes")
    public ResponseEntity<TransacaoDTO> registrarTransacao(@Valid @RequestBody TransacaoDTO dto) {
        TransacaoDTO criada = transacaoService.registrarNovaTransacao(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    /**
     * GET /api/transacoes
     * Lista transações com filtros opcionais e paginação.
     *
     * @param tipo        "Ganho" ou "Gasto" (opcional)
     * @param categoriaId ID da categoria (opcional)
     * @param descricao   Busca parcial na descrição (opcional)
     * @param dataInicio  Data/hora de início do filtro (opcional)
     * @param dataFim     Data/hora de fim do filtro (opcional)
     * @param pagina      Número da página (default: 0)
     * @param tamanho     Tamanho da página (default: 10)
     */
    @GetMapping("/transacoes")
    public ResponseEntity<Page<TransacaoDTO>> listarTransacoes(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) String descricao,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanho
    ) {
        Page<TransacaoDTO> transacoes = transacaoService.listarTransacoes(
                tipo, categoriaId, descricao, dataInicio, dataFim, pagina, tamanho);
        return ResponseEntity.ok(transacoes);
    }

    /**
     * PUT /api/transacoes/{id}
     * Edita uma transação existente.
     */
    @PutMapping("/transacoes/{id}")
    public ResponseEntity<TransacaoDTO> editarTransacao(
            @PathVariable Long id,
            @Valid @RequestBody TransacaoDTO dto) {
        TransacaoDTO atualizada = transacaoService.editarTransacao(id, dto);
        return ResponseEntity.ok(atualizada);
    }

    /**
     * PATCH /api/transacoes/{id}/cancelar
     * Cancela logicamente uma transação.
     */
    @PatchMapping("/transacoes/{id}/cancelar")
    public ResponseEntity<Void> cancelarTransacao(@PathVariable Long id) {
        transacaoService.cancelarTransacao(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/resumo
     * Retorna o resumo financeiro (saldo, total ganhos, total gastos).
     */
    @GetMapping("/resumo")
    public ResponseEntity<ResumoFinanceiroDTO> obterResumo() {
        ResumoFinanceiroDTO resumo = transacaoService.obterResumoFinanceiro();
        return ResponseEntity.ok(resumo);
    }

    /**
     * GET /api/gastos-por-categoria
     * Retorna gastos agrupados por categoria para o gráfico de pizza.
     */
    @GetMapping("/gastos-por-categoria")
    public ResponseEntity<List<GastoPorCategoriaDTO>> obterGastosPorCategoria() {
        List<GastoPorCategoriaDTO> dados = transacaoService.obterGastosPorCategoria();
        return ResponseEntity.ok(dados);
    }
}
