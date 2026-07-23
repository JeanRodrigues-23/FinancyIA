package com.estudo.financyia.controller;

import com.estudo.financyia.model.dto.CategoriaDTO;
import com.estudo.financyia.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    /**
     * GET /api/categorias
     * Lista todas as categorias disponíveis.
     */
    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> listarCategorias() {
        return ResponseEntity.ok(categoriaService.listarCategorias());
    }

    /**
     * GET /api/categorias/{id}
     * Retorna uma categoria pelo ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.buscarPorId(id));
    }

    /**
     * POST /api/categorias
     * Cria uma nova categoria personalizada.
     */
    @PostMapping
    public ResponseEntity<CategoriaDTO> criarCategoria(@RequestBody CategoriaDTO dto) {
        CategoriaDTO criada = categoriaService.criarCategoria(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }
}
