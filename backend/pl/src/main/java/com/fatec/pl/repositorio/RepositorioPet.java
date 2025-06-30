package com.fatec.pl.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fatec.pl.modelo.Pet;

@Repository
public interface RepositorioPet extends JpaRepository<Pet, Long> {
}
