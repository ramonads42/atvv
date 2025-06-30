package com.fatec.pl.controle;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.pl.modelo.Produto;
import com.fatec.pl.repositorio.RepositorioProduto;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("/produto") 
public class ControleProduto {

    @Autowired
    private RepositorioProduto repositorio;

    @GetMapping("/{id}")
    public ResponseEntity<Produto> obterProduto(@PathVariable Long id) {
        Optional<Produto> produtoOptional = repositorio.findById(id);
        return produtoOptional.map(produto -> new ResponseEntity<>(produto, HttpStatus.OK))
                              .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/produtos")
    public ResponseEntity<List<Produto>> obterProdutos() {
        List<Produto> produtos = repositorio.findAll();
        return new ResponseEntity<>(produtos, HttpStatus.OK);
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<Produto> cadastrarProduto(@RequestBody Produto novoProduto) {
        if (novoProduto != null && novoProduto.getNome() != null && !novoProduto.getNome().trim().isEmpty() && novoProduto.getValor() != null && novoProduto.getValor() >= 0) {
            Produto produtoSalvo = repositorio.save(novoProduto);
            return new ResponseEntity<>(produtoSalvo, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/atualizar")
    public ResponseEntity<Produto> atualizarProduto(@RequestBody Produto atualizacaoProduto) {
        if (atualizacaoProduto != null && atualizacaoProduto.getId() != null) {
            Optional<Produto> produtoOptional = repositorio.findById(atualizacaoProduto.getId());
            if (produtoOptional.isPresent()) {
                Produto produtoExistente = produtoOptional.get();
                if (atualizacaoProduto.getNome() != null && !atualizacaoProduto.getNome().trim().isEmpty()) {
                    produtoExistente.setNome(atualizacaoProduto.getNome());
                }
                if (atualizacaoProduto.getValor() != null && atualizacaoProduto.getValor() >= 0) {
                    produtoExistente.setValor(atualizacaoProduto.getValor());
                }
                if (atualizacaoProduto.getDescricao() != null) {
                    produtoExistente.setDescricao(atualizacaoProduto.getDescricao());
                }

                Produto produtoAtualizado = repositorio.save(produtoExistente);
                return new ResponseEntity<>(produtoAtualizado, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/excluir")
    public ResponseEntity<Void> excluirProduto(@RequestBody Produto exclusaoProduto) {
        if (exclusaoProduto != null && exclusaoProduto.getId() != null) {
            if (repositorio.existsById(exclusaoProduto.getId())) {
                repositorio.deleteById(exclusaoProduto.getId());
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}