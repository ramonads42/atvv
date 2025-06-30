package com.fatec.pl.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatec.pl.modelo.Consumo;

@Repository
public interface RepositorioConsumo extends JpaRepository<Consumo, Long> {

}