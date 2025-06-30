package com.fatec.pl.modelo;

import org.springframework.hateoas.RepresentationModel;

import com.fasterxml.jackson.annotation.JsonBackReference; 

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
public class Telefone extends RepresentationModel<Telefone> {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String numero;
	@Column(nullable = false)
	private String ddd;

    @JsonBackReference 
    @ManyToOne
    @JoinColumn(name = "cliente_id") 
    private Cliente cliente; 

    public Telefone() {}

    public Telefone(String ddd, String numero) {
        this.ddd = ddd;
        this.numero = numero;
    }

    public Telefone(String ddd, String numero, Cliente cliente) {
        this.ddd = ddd;
        this.numero = numero;
        this.cliente = cliente;
    }
}
