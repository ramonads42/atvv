package com.fatec.pl.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatec.pl.modelo.Servico;

@Repository
public interface RepositorioServico extends JpaRepository<Servico, Long> {
    Servico findByNome(String nome);
}