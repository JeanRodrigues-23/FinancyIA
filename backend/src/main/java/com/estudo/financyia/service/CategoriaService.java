package com.estudo.financyia.service;

import com.estudo.financyia.model.Categoria;
import com.estudo.financyia.model.dto.CategoriaDTO;
import com.estudo.financyia.repository.CategoriaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Transactional(readOnly = true)
    public List<CategoriaDTO> listarCategorias() {
        return categoriaRepository.findAllByOrderByNomeAsc()
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoriaDTO buscarPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada com id: " + id));
        return converterParaDTO(categoria);
    }

    public CategoriaDTO criarCategoria(CategoriaDTO dto) {
        if (categoriaRepository.existsByNomeIgnoreCase(dto.nome())) {
            throw new IllegalArgumentException("Já existe uma categoria com o nome: " + dto.nome());
        }
        Categoria categoria = new Categoria();
        categoria.setNome(dto.nome());
        categoria.setCor(dto.cor() != null ? dto.cor() : "#6B7280");
        Categoria salva = categoriaRepository.save(categoria);
        return converterParaDTO(salva);
    }

    private CategoriaDTO converterParaDTO(Categoria categoria) {
        return new CategoriaDTO(categoria.getId(), categoria.getNome(), categoria.getCor());
    }
}
