package com.fatec.pl;

import java.time.LocalDateTime; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean; 
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.fatec.pl.modelo.Cliente;
import com.fatec.pl.modelo.Consumo; 
import com.fatec.pl.modelo.Endereco;
import com.fatec.pl.modelo.Pet; 
import com.fatec.pl.modelo.Produto; 
import com.fatec.pl.modelo.Servico; 
import com.fatec.pl.modelo.Telefone;
import com.fatec.pl.repositorio.RepositorioCliente;
import com.fatec.pl.repositorio.RepositorioConsumo; 
import com.fatec.pl.repositorio.RepositorioPet; 
import com.fatec.pl.repositorio.RepositorioProduto; 
import com.fatec.pl.repositorio.RepositorioServico; 

@SpringBootApplication
public class PlApplication implements CommandLineRunner {

	@Autowired
	private RepositorioCliente repositorioCliente; 
    @Autowired
    private RepositorioPet repositorioPet; 
    @Autowired 
    private RepositorioProduto repositorioProduto;
    @Autowired 
    private RepositorioServico repositorioServico;
    @Autowired 
    private RepositorioConsumo repositorioConsumo;

	public static void main(String[] args) {
		SpringApplication.run(PlApplication.class, args);
	}

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") 
                        .allowedOrigins("http://localhost:3000") 
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") 
                        .allowedHeaders("*") 
                        .allowCredentials(true); 
            }
        };
    }

	@Override
	public void run(String... args) throws Exception {

		Cliente cliente = new Cliente();
		cliente.setNome("Pedro Alcântara de Bragança e Bourbon");
		cliente.setNomeSocial("Dom Pedro");
        
		Endereco endereco = new Endereco();
		endereco.setCidade("Rio de Janeiro");
		endereco.setEstado("Rio de Janeiro");
		endereco.setBairro("Centro");
		endereco.setRua("Praça Quinze de Novembro");
		endereco.setNumero("48");
		endereco.setCodigoPostal("20010-010");
		endereco.setInformacoesAdicionais("O Paço Imperial é " + "um edifício histórico localizado na "
				+ "atual Praça XV de Novembro, no centro " + "da cidade do Rio de Janeiro, Brasil.");
		cliente.setEndereco(endereco);

		Telefone telefone = new Telefone();
		telefone.setDdd("21");
		telefone.setNumero("22152622");
        telefone.setCliente(cliente); 
		cliente.getTelefones().add(telefone);
		
		Pet petDomPedro = new Pet("Apolo", "Cachorro", "Pastor Alemão", "Macho", cliente); 
		cliente.getPets().add(petDomPedro); 
		repositorioCliente.save(cliente); 

		Cliente cliente2 = new Cliente();
		cliente2.setNome("Teresa Cristina de Bourbon-Duas Sicílias");
		cliente2.setNomeSocial("Mãe dos Brasileiros");
		endereco = new Endereco();
		endereco.setCidade("Rio de Janeiro");
		endereco.setEstado("Rio de Janeiro");
		endereco.setBairro("Centro");
		endereco.setRua("Praça Quinze de Novembro");
		endereco.setNumero("48");
		endereco.setCodigoPostal("20010-010");
		endereco.setInformacoesAdicionais("O Paço Imperial é " + "um edifício histórico localizado na "
				+ "atual Praça XV de Novembro, no centro " + "da cidade do Rio de Janeiro, Brasil.");

		cliente2.setEndereco(endereco);
		telefone = new Telefone();
		telefone.setDdd("21");
		telefone.setNumero("22152622");
        telefone.setCliente(cliente2); 
		cliente2.getTelefones().add(telefone);
        
        Pet petTeresa = new Pet("Luna", "Gato", "Persa", "Fêmea", cliente2);
        cliente2.getPets().add(petTeresa);
		repositorioCliente.save(cliente2);

		Cliente cliente3 = new Cliente();
		cliente3.setNome("Isabel Cristina Leopoldina Augusta Gonzaga de Bourbon e Bragança");
		cliente3.setNomeSocial("Pricesa Isabel");

		endereco = new Endereco();
		endereco.setCidade("Rio de Janeiro");
		endereco.setEstado("Rio de Janeiro");
		endereco.setBairro("Centro");
		endereco.setRua("Praça Quinze de Novembro");
		endereco.setNumero("48");
		endereco.setCodigoPostal("20010-010");
		endereco.setInformacoesAdicionais("O Paço Imperial é " + "um edifício histórico localizado na "
				+ "atual Praça XV de Novembro, no centro " + "da cidade do Rio de Janeiro, Brasil.");

		cliente3.setEndereco(endereco);
		telefone = new Telefone();
		telefone.setDdd("21");
		telefone.setNumero("22152622");
        telefone.setCliente(cliente3); 
		cliente3.getTelefones().add(telefone);
        
        Pet petIsabel = new Pet("Pipoca", "Pássaro", "Calopsita", "Fêmea", cliente3);
        cliente3.getPets().add(petIsabel);
		repositorioCliente.save(cliente3);

		Cliente cliente4 = new Cliente();
		cliente4.setNome("Leopoldina Teresa Gonzaga de Bragança e Bourbon-Duas Sicílias");
		cliente4.setNomeSocial("Pricesa Leopoldina");

		endereco = new Endereco();
		endereco.setCidade("Rio de Janeiro");
		endereco.setEstado("Rio de Janeiro");
		endereco.setBairro("Centro");
		endereco.setRua("Praça Quinze de Novembro");
		endereco.setNumero("48");
		endereco.setCodigoPostal("20010-010");
		endereco.setInformacoesAdicionais("O Paço Imperial é " + "um edifício histórico localizado na "
				+ "atual Praça XV de Novembro, no centro " + "da cidade do Rio de Janeiro, Brasil.");

		cliente4.setEndereco(endereco);
		telefone = new Telefone();
		telefone.setDdd("21");
		telefone.setNumero("22152622");
        telefone.setCliente(cliente4); 
		cliente4.getTelefones().add(telefone);
		repositorioCliente.save(cliente4);

        Produto produto1 = new Produto("Ração Super Premium 15kg", 180.00, "Ração de alta qualidade para cães adultos.");
        Produto produto2 = new Produto("Brinquedo para Gatos", 25.50, "Bolinha com guizo para entreter gatos.");
        Produto produto3 = new Produto("Shampoo para Cães", 45.00, "Shampoo hipoalergênico para cães.");
        repositorioProduto.save(produto1);
        repositorioProduto.save(produto2);
        repositorioProduto.save(produto3);

        Servico servico1 = new Servico("Banho e Tosa Completa", 120.00, "Serviço de banho, tosa higiênica e corte de unhas.");
        Servico servico2 = new Servico("Consulta Veterinária", 200.00, "Consulta de rotina com veterinário.");
        Servico servico3 = new Servico("Hospedagem por Dia", 80.00, "Diária de hospedagem para pets.");
        repositorioServico.save(servico1);
        repositorioServico.save(servico2);
        repositorioServico.save(servico3);


        Consumo consumo1 = new Consumo(cliente, produto1);
        consumo1.setQuantidade(2);
        repositorioConsumo.save(consumo1);

        Consumo consumo2 = new Consumo(cliente2, servico1);
        repositorioConsumo.save(consumo2);

        Consumo consumo3 = new Consumo(cliente3, produto2);
        repositorioConsumo.save(consumo3);
        Consumo consumo4 = new Consumo(cliente3, servico2);
        repositorioConsumo.save(consumo4);

        Consumo consumo5 = new Consumo(cliente, servico2);
        repositorioConsumo.save(consumo5);
	}
}