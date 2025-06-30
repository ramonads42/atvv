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

import com.fatec.pl.modelo.Servico;
import com.fatec.pl.repositorio.RepositorioServico;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("/servico") 
public class ControleServico {

    @Autowired
    private RepositorioServico repositorio;

    @GetMapping("/{id}")
    public ResponseEntity<Servico> obterServico(@PathVariable Long id) {
        Optional<Servico> servicoOptional = repositorio.findById(id);
        return servicoOptional.map(servico -> new ResponseEntity<>(servico, HttpStatus.OK))
                              .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/servicos")
    public ResponseEntity<List<Servico>> obterServicos() {
        List<Servico> servicos = repositorio.findAll();
        return new ResponseEntity<>(servicos, HttpStatus.OK);
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<Servico> cadastrarServico(@RequestBody Servico novoServico) {
        if (novoServico != null && novoServico.getNome() != null && !novoServico.getNome().trim().isEmpty() && novoServico.getValor() != null && novoServico.getValor() >= 0) {
            Servico servicoSalvo = repositorio.save(novoServico);
            return new ResponseEntity<>(servicoSalvo, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/atualizar")
    public ResponseEntity<Servico> atualizarServico(@RequestBody Servico atualizacaoServico) {
        if (atualizacaoServico != null && atualizacaoServico.getId() != null) {
            Optional<Servico> servicoOptional = repositorio.findById(atualizacaoServico.getId());
            if (servicoOptional.isPresent()) {
                Servico servicoExistente = servicoOptional.get();
                if (atualizacaoServico.getNome() != null && !atualizacaoServico.getNome().trim().isEmpty()) {
                    servicoExistente.setNome(atualizacaoServico.getNome());
                }
                if (atualizacaoServico.getValor() != null && atualizacaoServico.getValor() >= 0) {
                    servicoExistente.setValor(atualizacaoServico.getValor());
                }
                if (atualizacaoServico.getDescricao() != null) {
                    servicoExistente.setDescricao(atualizacaoServico.getDescricao());
                }

                Servico servicoAtualizado = repositorio.save(servicoExistente);
                return new ResponseEntity<>(servicoAtualizado, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/excluir")
    public ResponseEntity<Void> excluirServico(@RequestBody Servico exclusaoServico) {
        if (exclusaoServico != null && exclusaoServico.getId() != null) {
            if (repositorio.existsById(exclusaoServico.getId())) {
                repositorio.deleteById(exclusaoServico.getId());
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}