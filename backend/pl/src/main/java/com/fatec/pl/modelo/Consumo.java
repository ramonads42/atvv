package com.fatec.pl.modelo;

import java.time.LocalDateTime;

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
public class Consumo extends RepresentationModel<Consumo> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference("cliente-consumos") 
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "produto_id") 
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "servico_id") 
    private Servico servico;

    @Column(nullable = false)
    private Integer quantidade; 

    @Column(nullable = false)
    private LocalDateTime dataHoraConsumo; 

    public Consumo() {
        this.dataHoraConsumo = LocalDateTime.now(); 
        this.quantidade = 1; 
    }

    public Consumo(Cliente cliente, Produto produto) {
        this(); 
        this.cliente = cliente;
        this.produto = produto;
        this.servico = null;
    }


    public Consumo(Cliente cliente, Servico servico) {
        this(); 
        this.cliente = cliente;
        this.servico = servico;
        this.produto = null;
    }

    @JsonProperty("produto_id")
    public Long getProdutoId() {
        return (produto != null) ? produto.getId() : null;
    }

    @JsonProperty("servico_id")
    public Long getServicoId() {
        return (servico != null) ? servico.getId() : null;
    }
}