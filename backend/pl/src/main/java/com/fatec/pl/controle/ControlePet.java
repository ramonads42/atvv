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
import org.springframework.web.bind.annotation.RestController;

import com.fatec.pl.modelo.Pet;
import com.fatec.pl.repositorio.RepositorioPet;

@CrossOrigin // Permite requisições de diferentes origens (para o frontend React)
@RestController // Marca esta classe como um controlador REST que lida com requisições HTTP
public class ControlePet {
    @Autowired // Injeta uma instância do RepositorioPet
    private RepositorioPet repositorio;

    // Endpoint para obter um Pet por ID
    // GET http://localhost:32831/pet/{id}
    @GetMapping("/pet/{id}")
    public ResponseEntity<Pet> obterPet(@PathVariable Long id) {
        Optional<Pet> petOptional = repositorio.findById(id);
        if (petOptional.isPresent()) {
            Pet pet = petOptional.get();
            // Implementar HATEOAS aqui se necessário, similar ao ControleCliente
            return new ResponseEntity<>(pet, HttpStatus.OK); // Retorna 200 OK com o Pet
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Retorna 404 Not Found
        }
    }

    // Endpoint para listar todos os Pets
    // GET http://localhost:32831/pet/pets
    @GetMapping("/pet/pets")
    public ResponseEntity<List<Pet>> obterPets() {
        List<Pet> pets = repositorio.findAll();
        // Implementar HATEOAS aqui se necessário, similar ao ControleCliente
        return new ResponseEntity<>(pets, HttpStatus.OK); // Retorna 200 OK com a lista de Pets
    }

    // Endpoint para cadastrar um novo Pet
    // POST http://localhost:32831/pet/cadastrar
    @PostMapping("/pet/cadastrar")
    public ResponseEntity<Pet> cadastrarPet(@RequestBody Pet novo) {
        if (novo != null && novo.getNome() != null && !novo.getNome().trim().isEmpty()) {
            // Pode adicionar mais validações aqui
            Pet petSalvo = repositorio.save(novo); // Salva o novo Pet no banco de dados
            return new ResponseEntity<>(petSalvo, HttpStatus.CREATED); // Retorna 201 Created com o Pet salvo
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Retorna 400 Bad Request se os dados forem inválidos
        }
    }

    // Endpoint para atualizar um Pet existente
    // PUT http://localhost:32831/pet/atualizar
    @PutMapping("/pet/atualizar")
    public ResponseEntity<Pet> atualizarPet(@RequestBody Pet atualizacao) {
        if (atualizacao != null && atualizacao.getId() != null) {
            Optional<Pet> petOptional = repositorio.findById(atualizacao.getId());
            if (petOptional.isPresent()) {
                Pet petExistente = petOptional.get();
                // Atualiza apenas os campos que podem ser modificados via este endpoint
                if (atualizacao.getNome() != null && !atualizacao.getNome().trim().isEmpty()) {
                    petExistente.setNome(atualizacao.getNome());
                }
                if (atualizacao.getTipo() != null && !atualizacao.getTipo().trim().isEmpty()) {
                    petExistente.setTipo(atualizacao.getTipo());
                }
                if (atualizacao.getRaca() != null && !atualizacao.getRaca().trim().isEmpty()) {
                    petExistente.setRaca(atualizacao.getRaca());
                }
                if (atualizacao.getGenero() != null && !atualizacao.getGenero().trim().isEmpty()) {
                    petExistente.setGenero(atualizacao.getGenero());
                }
                // Salva as alterações no banco de dados
                Pet petAtualizado = repositorio.save(petExistente);
                return new ResponseEntity<>(petAtualizado, HttpStatus.OK); // Retorna 200 OK com o Pet atualizado
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Retorna 404 Not Found se o Pet não for encontrado
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Retorna 400 Bad Request se os dados forem inválidos
        }
    }

    // Endpoint para excluir um Pet
    // DELETE http://localhost:32831/pet/excluir
    @DeleteMapping("/pet/excluir")
    public ResponseEntity<Void> excluirPet(@RequestBody Pet exclusao) {
        if (exclusao != null && exclusao.getId() != null) {
            if (repositorio.existsById(exclusao.getId())) {
                repositorio.deleteById(exclusao.getId()); // Exclui o Pet pelo ID
                return new ResponseEntity<>(HttpStatus.OK); // Retorna 200 OK
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Retorna 404 Not Found se o Pet não for encontrado
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Retorna 400 Bad Request se o ID não for fornecido
        }
    }
}
