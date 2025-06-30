package com.fatec.pl.modelo;

import org.springframework.hateoas.RepresentationModel;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty; 

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Pet extends RepresentationModel<Pet> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column
    private String tipo;

    @Column
    private String raca;

    @Column
    private String genero;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @JsonProperty("cliente_id") 
    public Long getClienteId() {
        return (cliente != null) ? cliente.getId() : null;
    }

    public Pet() {}

    public Pet(String nome, String tipo, String raca, String genero, Cliente cliente) {
        this.nome = nome;
        this.tipo = tipo;
        this.raca = raca;
        this.genero = genero;
        this.cliente = cliente;
    }
}
