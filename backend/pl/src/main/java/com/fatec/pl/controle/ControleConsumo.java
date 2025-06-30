package com.fatec.pl.controle;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Optional; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.pl.modelo.Cliente;
import com.fatec.pl.modelo.Consumo;
import com.fatec.pl.modelo.Produto;
import com.fatec.pl.modelo.Servico;
import com.fatec.pl.repositorio.RepositorioCliente;
import com.fatec.pl.repositorio.RepositorioConsumo;
import com.fatec.pl.repositorio.RepositorioProduto;
import com.fatec.pl.repositorio.RepositorioServico;

class RegistroConsumoRequest {
    public Long clienteId;
    public Long produtoId;
    public Long servicoId;
    public Integer quantidade; 

    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    public Long getProdutoId() { return produtoId; }
    public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }
    public Long getServicoId() { return servicoId; }
    public void setServicoId(Long servicoId) { this.servicoId = servicoId; }
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
}

class RelatorioConsumoItem {
    public String nome;
    public String tipo; 
    public Integer quantidade;
    public Double valorTotal; 

    public RelatorioConsumoItem(String nome, String tipo, Integer quantidade, Double valorTotal) {
        this.nome = nome;
        this.tipo = tipo;
        this.quantidade = quantidade;
        this.valorTotal = valorTotal;
    }
}

class RelatorioClienteConsumo {
    public Long idCliente;
    public String nomeCliente;
    public Integer quantidadeProdutos;
    public Integer quantidadeServicos;
    public Integer totalConsumido;
    public Double valorTotalGasto;

    public RelatorioClienteConsumo(Long idCliente, String nomeCliente, Integer quantidadeProdutos, Integer quantidadeServicos, Integer totalConsumido, Double valorTotalGasto) {
        this.idCliente = idCliente;
        this.nomeCliente = nomeCliente;
        this.quantidadeProdutos = quantidadeProdutos;
        this.quantidadeServicos = quantidadeServicos;
        this.totalConsumido = totalConsumido;
        this.valorTotalGasto = valorTotalGasto;
    }
}

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("/consumo") 
public class ControleConsumo {

    @Autowired
    private RepositorioConsumo repositorioConsumo;
    @Autowired
    private RepositorioCliente repositorioCliente;
    @Autowired
    private RepositorioProduto repositorioProduto;
    @Autowired
    private RepositorioServico repositorioServico;

    @PostMapping("/registrar")
    public ResponseEntity<Consumo> registrarConsumo(@RequestBody RegistroConsumoRequest request) {
        if (request.getClienteId() == null || (request.getProdutoId() == null && request.getServicoId() == null)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<Cliente> clienteOpt = repositorioCliente.findById(request.getClienteId());
        if (!clienteOpt.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Cliente cliente = clienteOpt.get();

        Consumo novoConsumo = new Consumo();
        novoConsumo.setCliente(cliente);
        novoConsumo.setQuantidade(request.getQuantidade() != null ? request.getQuantidade() : 1);

        if (request.getProdutoId() != null) {
            Optional<Produto> produtoOpt = repositorioProduto.findById(request.getProdutoId());
            if (!produtoOpt.isPresent()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            novoConsumo.setProduto(produtoOpt.get());
        } else if (request.getServicoId() != null) {
            Optional<Servico> servicoOpt = repositorioServico.findById(request.getServicoId());
            if (!servicoOpt.isPresent()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            novoConsumo.setServico(servicoOpt.get());
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); 
        }

        Consumo consumoSalvo = repositorioConsumo.save(novoConsumo);
        return new ResponseEntity<>(consumoSalvo, HttpStatus.CREATED);
    }

    @GetMapping("/relatorios/clientes-mais-consumiram-quantidade")
    public ResponseEntity<List<RelatorioClienteConsumo>> getRelatorioTop10ClientesPorQuantidade() {
        List<Cliente> clientes = repositorioCliente.findAll();
        List<Consumo> todosConsumos = repositorioConsumo.findAll();

        Map<Long, RelatorioClienteConsumo> resumoPorCliente = new HashMap<>();

        for (Cliente cliente : clientes) {
            resumoPorCliente.put(cliente.getId(), new RelatorioClienteConsumo(
                cliente.getId(), cliente.getNome(), 0, 0, 0, 0.0));
        }

        for (Consumo consumo : todosConsumos) {
            RelatorioClienteConsumo resumo = resumoPorCliente.get(consumo.getCliente().getId());
            if (resumo != null) {
                resumo.totalConsumido += consumo.getQuantidade();
                if (consumo.getProduto() != null) {
                    resumo.quantidadeProdutos += consumo.getQuantidade();
                    resumo.valorTotalGasto += consumo.getQuantidade() * consumo.getProduto().getValor();
                } else if (consumo.getServico() != null) {
                    resumo.quantidadeServicos += consumo.getQuantidade();
                    resumo.valorTotalGasto += consumo.getQuantidade() * consumo.getServico().getValor();
                }
            }
        }

        List<RelatorioClienteConsumo> ranking = resumoPorCliente.values().stream()
            .filter(r -> r.totalConsumido > 0)
            .sorted((c1, c2) -> c2.totalConsumido.compareTo(c1.totalConsumido))
            .limit(10)
            .collect(Collectors.toList());

        return new ResponseEntity<>(ranking, HttpStatus.OK);
    }

    @GetMapping("/relatorios/clientes-mais-gastaram-valor")
    public ResponseEntity<List<RelatorioClienteConsumo>> getRelatorioTop5ClientesPorValor() {
        List<Cliente> clientes = repositorioCliente.findAll();
        List<Consumo> todosConsumos = repositorioConsumo.findAll();

        Map<Long, RelatorioClienteConsumo> resumoPorCliente = new HashMap<>();

        for (Cliente cliente : clientes) {
            resumoPorCliente.put(cliente.getId(), new RelatorioClienteConsumo(
                cliente.getId(), cliente.getNome(), 0, 0, 0, 0.0));
        }
        
        for (Consumo consumo : todosConsumos) {
            RelatorioClienteConsumo resumo = resumoPorCliente.get(consumo.getCliente().getId());
            if (resumo != null) {
                if (consumo.getProduto() != null) {
                    resumo.valorTotalGasto += consumo.getQuantidade() * consumo.getProduto().getValor();
                } else if (consumo.getServico() != null) {
                    resumo.valorTotalGasto += consumo.getQuantidade() * consumo.getServico().getValor();
                }
            }
        }

        List<RelatorioClienteConsumo> ranking = resumoPorCliente.values().stream()
            .filter(r -> r.valorTotalGasto > 0)
            .sorted((c1, c2) -> c2.valorTotalGasto.compareTo(c1.valorTotalGasto))
            .limit(5)
            .collect(Collectors.toList());

        return new ResponseEntity<>(ranking, HttpStatus.OK);
    }

    @GetMapping("/relatorios/produtos-servicos-mais-consumidos")
    public ResponseEntity<List<RelatorioConsumoItem>> getRelatorioProdutosServicosMaisConsumidos() {
        List<Consumo> todosConsumos = repositorioConsumo.findAll();

        Map<String, RelatorioConsumoItem> contagemItens = new HashMap<>();

        for (Consumo consumo : todosConsumos) {
            if (consumo.getProduto() != null) {
                String key = "Produto-" + consumo.getProduto().getNome();
                contagemItens.computeIfAbsent(key, k -> new RelatorioConsumoItem(consumo.getProduto().getNome(), "Produto", 0, 0.0))
                             .quantidade += consumo.getQuantidade();
                contagemItens.get(key).valorTotal += consumo.getQuantidade() * consumo.getProduto().getValor();
            } else if (consumo.getServico() != null) {
                String key = "Servico-" + consumo.getServico().getNome();
                contagemItens.computeIfAbsent(key, k -> new RelatorioConsumoItem(consumo.getServico().getNome(), "Servico", 0, 0.0))
                             .quantidade += consumo.getQuantidade();
                contagemItens.get(key).valorTotal += consumo.getQuantidade() * consumo.getServico().getValor();
            }
        }

        List<RelatorioConsumoItem> ranking = contagemItens.values().stream()
            .filter(item -> item.quantidade > 0)
            .sorted((i1, i2) -> i2.quantidade.compareTo(i1.quantidade))
            .collect(Collectors.toList());

        return new ResponseEntity<>(ranking, HttpStatus.OK);
    }

    @GetMapping("/relatorios/consumo-por-tipo-raca")
    public ResponseEntity<List<Map<String, Object>>> getRelatorioConsumoPorTipoRaca() {
        List<Consumo> todosConsumos = repositorioConsumo.findAll();

        Map<String, Map<String, RelatorioConsumoItem>> agrupamento = new HashMap<>();

        for (Consumo consumo : todosConsumos) {
            if (consumo.getCliente() != null && !consumo.getCliente().getPets().isEmpty()) {

                String petTipo = consumo.getCliente().getPets().get(0).getTipo();
                String petRaca = consumo.getCliente().getPets().get(0).getRaca();

                String tipoRacaKey = petTipo + " - " + petRaca;

                Map<String, RelatorioConsumoItem> itensPorTipoRaca = agrupamento.computeIfAbsent(tipoRacaKey, k -> new HashMap<>());

                if (consumo.getProduto() != null) {
                    String itemKey = "Produto-" + consumo.getProduto().getNome();
                    itensPorTipoRaca.computeIfAbsent(itemKey, k -> new RelatorioConsumoItem(consumo.getProduto().getNome(), "Produto", 0, 0.0))
                                    .quantidade += consumo.getQuantidade();
                    itensPorTipoRaca.get(itemKey).valorTotal += consumo.getQuantidade() * consumo.getProduto().getValor();
                } else if (consumo.getServico() != null) {
                    String itemKey = "Servico-" + consumo.getServico().getNome();
                    itensPorTipoRaca.computeIfAbsent(itemKey, k -> new RelatorioConsumoItem(consumo.getServico().getNome(), "Servico", 0, 0.0))
                                    .quantidade += consumo.getQuantidade();
                    itensPorTipoRaca.get(itemKey).valorTotal += consumo.getQuantidade() * consumo.getServico().getValor();
                }
            }
        }

        List<Map<String, Object>> relatorioFinal = agrupamento.entrySet().stream()
            .sorted(Map.Entry.comparingByKey()) 
            .flatMap(entry -> {
                String tipoRaca = entry.getKey();
                List<RelatorioConsumoItem> itensOrdenados = entry.getValue().values().stream()
                    .sorted((i1, i2) -> i2.quantidade.compareTo(i1.quantidade)) 
                    .collect(Collectors.toList());
                
                return itensOrdenados.stream().map(item -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("tipoRaca", tipoRaca);
                    map.put("nome", item.nome);
                    map.put("tipo", item.tipo);
                    map.put("quantidade", item.quantidade);
                    return map;
                });
            })
            .collect(Collectors.toList());

        return new ResponseEntity<>(relatorioFinal, HttpStatus.OK);
    }
    
    @GetMapping("/relatorios/consumo-por-tipo")
    public ResponseEntity<List<Map<String, Object>>> getRelatorioConsumoPorTipo() {
        List<Consumo> todosConsumos = repositorioConsumo.findAll();

        Map<String, Map<String, RelatorioConsumoItem>> agrupamento = new HashMap<>();

        for (Consumo consumo : todosConsumos) {
            if (consumo.getCliente() != null && !consumo.getCliente().getPets().isEmpty()) {
                String petTipo = consumo.getCliente().getPets().get(0).getTipo();

                Map<String, RelatorioConsumoItem> itensPorTipo = agrupamento.computeIfAbsent(petTipo, k -> new HashMap<>());

                if (consumo.getProduto() != null) {
                    String itemKey = "Produto-" + consumo.getProduto().getNome();
                    itensPorTipo.computeIfAbsent(itemKey, k -> new RelatorioConsumoItem(consumo.getProduto().getNome(), "Produto", 0, 0.0))
                                .quantidade += consumo.getQuantidade();
                } else if (consumo.getServico() != null) {
                    String itemKey = "Servico-" + consumo.getServico().getNome();
                    itensPorTipo.computeIfAbsent(itemKey, k -> new RelatorioConsumoItem(consumo.getServico().getNome(), "Servico", 0, 0.0))
                                .quantidade += consumo.getQuantidade();
                }
            }
        }

        List<Map<String, Object>> relatorioFinal = agrupamento.entrySet().stream()
            .sorted(Map.Entry.comparingByKey()) 
            .flatMap(entry -> {
                String tipoPet = entry.getKey();
                List<RelatorioConsumoItem> itensOrdenados = entry.getValue().values().stream()
                    .sorted((i1, i2) -> i2.quantidade.compareTo(i1.quantidade)) 
                    .collect(Collectors.toList());
                
                return itensOrdenados.stream().map(item -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("tipoPet", tipoPet);
                    map.put("nomeItem", item.nome);
                    map.put("tipoItem", item.tipo);
                    map.put("quantidade", item.quantidade);
                    return map;
                });
            })
            .collect(Collectors.toList());

        return new ResponseEntity<>(relatorioFinal, HttpStatus.OK);
    }
}