package com.fatec.pl.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatec.pl.modelo.Produto;

@Repository
public interface RepositorioProduto extends JpaRepository<Produto, Long> {
    Produto findByNome(String nome);
}