import Empresa from "modelo/empresa";
import Cliente from "modelo/cliente";
import Produto from "modelo/produto";
import Servico from "modelo/servico";
import Pet from "modelo/pet";
import CPF from "modelo/cpf"; 

import clienteApiService from "./ClienteApiService";
import petApiService from "./PetApiService";
import produtoApiService from "./ProdutoApiService"; 
import servicoApiService from "./ServicoApiService"; 
import consumoApiService from "./ConsumoApiService"; 

class EmpresaService {
    private empresa: Empresa;

    constructor() {
        this.empresa = new Empresa();

        this.cadastrarClienteComDados = this.cadastrarClienteComDados.bind(this);
        this.atualizarCliente = this.atualizarCliente.bind(this);
        this.excluirCliente = this.excluirCliente.bind(this);
        this.getClientes = this.getClientes.bind(this);
        
        this.getPets = this.getPets.bind(this);
        this.cadastrarPet = this.cadastrarPet.bind(this);
        this.atualizarPet = this.atualizarPet.bind(this);
        this.excluirPet = this.excluirPet.bind(this);

        this.getProdutos = this.getProdutos.bind(this);
        this.cadastrarProduto = this.cadastrarProduto.bind(this);
        this.atualizarProduto = this.atualizarProduto.bind(this);
        this.excluirProduto = this.excluirProduto.bind(this);

        this.getServicos = this.getServicos.bind(this);
        this.cadastrarServico = this.cadastrarServico.bind(this);
        this.atualizarServico = this.atualizarServico.bind(this);
        this.excluirServico = this.excluirServico.bind(this);
        
        this.registrarConsumo = this.registrarConsumo.bind(this);
        this.getRelatorioTop10ClientesPorQuantidade = this.getRelatorioTop10ClientesPorQuantidade.bind(this);
        this.getRelatorioTop5ClientesPorValor = this.getRelatorioTop5ClientesPorValor.bind(this);
        this.getRelatorioProdutosServicosMaisConsumidos = this.getRelatorioProdutosServicosMaisConsumidos.bind(this);
        this.getRelatorioConsumoPorTipoRaca = this.getRelatorioConsumoPorTipoRaca.bind(this);
        this.getRelatorioConsumoPorTipo = this.getRelatorioConsumoPorTipo.bind(this);

    }

    async getClientes(): Promise<Cliente[]> {
        const clientesDoBackend = await clienteApiService.getClientes();
        this.empresa.getClientes.splice(0, this.empresa.getClientes.length, ...clientesDoBackend);
        return this.empresa.getClientes;
    }

    async getPets(): Promise<Pet[]> {
        const petsDoBackend = await petApiService.getPets();
        this.empresa.getPets.splice(0, this.empresa.getPets.length, ...petsDoBackend);
        return this.empresa.getPets;
    }

    async getProdutos(): Promise<Produto[]> {
        const produtosDoBackend = await produtoApiService.getProdutos();
        this.empresa.getProdutos.splice(0, this.empresa.getProdutos.length, ...produtosDoBackend);
        return this.empresa.getProdutos;
    }

    async getServicos(): Promise<Servico[]> {
        const servicosDoBackend = await servicoApiService.getServicos();
        this.empresa.getServicos.splice(0, this.empresa.getServicos.length, ...servicosDoBackend);
        return this.empresa.getServicos;
    }

    async cadastrarClienteComDados(nome: string, nomeSocial: string, cpfValor: string, dataEmissaoString: string): Promise<boolean> {
        const sucesso = await clienteApiService.cadastrarCliente({ nome, nomeSocial, cpf: cpfValor, dataEmissaoCpf: dataEmissaoString });
        if (sucesso) {
            console.log(`Cliente ${nome} cadastrado com sucesso via API!`);
            await this.getClientes(); 
        } else {
            console.warn(`Falha ao cadastrar cliente ${nome} via API.`);
        }
        return sucesso;
    }

    async atualizarCliente(idCliente: number, novoNome: string, novoNomeSocial: string): Promise<boolean> {
        const sucesso = await clienteApiService.atualizarCliente(idCliente, novoNome, novoNomeSocial);
        if (sucesso) {
            console.log(`Cliente ID ${idCliente} atualizado com sucesso via API!`);
            await this.getClientes(); 
        } else {
            console.warn(`Falha ao atualizar cliente ID ${idCliente} via API.`);
        }
        return sucesso;
    }

    async excluirCliente(idCliente: number): Promise<boolean> {
        const sucesso = await clienteApiService.excluirCliente(idCliente);
        if (sucesso) {
            console.log(`Cliente ID ${idCliente} excluído com sucesso via API!`);
            await this.getClientes();
        } else {
            console.warn(`Falha ao excluir cliente ID ${idCliente} via API.`);
        }
        return sucesso;
    }

    async cadastrarPet(cpfCliente: string, nome: string, tipo: string, raca: string, genero: string): Promise<boolean> {
        const clienteDono = this.empresa.getClientes.find(c => c.getCpf.getValor === cpfCliente);
        if (!clienteDono || clienteDono.id === null) {
            console.warn(`Cliente com CPF ${cpfCliente} não encontrado ou sem ID para cadastrar pet no backend.`);
            return false;
        }

        const sucesso = await petApiService.cadastrarPet({
            nome, tipo, raca, genero, clienteId: clienteDono.id
        });

        if (sucesso) {
            console.log(`Pet ${nome} cadastrado com sucesso via API para o cliente ${clienteDono.nome}!`);
            await this.getPets(); 
        } else {
            console.warn(`Falha ao cadastrar pet ${nome} via API.`);
        }
        return sucesso;
    }

    async atualizarPet(idPet: number, novoNome: string, novoTipo: string, novaRaca: string, novoGenero: string, clienteIdDono: number | null): Promise<boolean> {
        if (idPet === null || clienteIdDono === null) {
             console.warn(`ID do pet ou do cliente dono inválido para atualização.`);
             return false;
        }

        const sucesso = await petApiService.atualizarPet({
            id: idPet,
            nome: novoNome,
            tipo: novoTipo,
            raca: novaRaca,
            genero: novoGenero,
            clienteId: clienteIdDono
        });

        if (sucesso) {
            console.log(`Pet ID ${idPet} atualizado com sucesso via API!`);
            await this.getPets();
        } else {
            console.warn(`Falha ao atualizar pet ID ${idPet} via API.`);
        }
        return sucesso;
    }

    async excluirPet(idPet: number): Promise<boolean> {
        if (idPet === null) {
            console.warn(`ID do pet inválido para exclusão.`);
            return false;
        }

        const sucesso = await petApiService.excluirPet(idPet);

        if (sucesso) {
            console.log(`Pet ID ${idPet} excluído com sucesso via API!`);
            await this.getPets();
        } else {
            console.warn(`Falha ao excluir pet ID ${idPet} via API.`);
        }
        return sucesso;
    }

    async cadastrarProduto(nome: string, valor: number, descricao: string): Promise<boolean> {
        const sucesso = await produtoApiService.cadastrarProduto({ nome, valor, descricao });
        if (sucesso) {
            console.log(`Produto ${nome} cadastrado com sucesso via API!`);
            await this.getProdutos(); 
        } else {
            console.warn(`Falha ao cadastrar produto ${nome} via API.`);
        }
        return sucesso;
    }

    async atualizarProduto(idProduto: number, novoNome: string, novoValor: number, novaDescricao: string): Promise<boolean> {
        const sucesso = await produtoApiService.atualizarProduto(idProduto, novoNome, novoValor, novaDescricao);
        if (sucesso) {
            console.log(`Produto ID ${idProduto} atualizado com sucesso via API!`);
            await this.getProdutos();
        } else {
            console.warn(`Falha ao atualizar produto ID ${idProduto} via API.`);
        }
        return sucesso;
    }

    async excluirProduto(idProduto: number): Promise<boolean> {
        const sucesso = await produtoApiService.excluirProduto(idProduto);
        if (sucesso) {
            console.log(`Produto ID ${idProduto} excluído com sucesso via API!`);
            await this.getProdutos();
        } else {
            console.warn(`Falha ao excluir produto ID ${idProduto} via API.`);
        }
        return sucesso;
    }

    async cadastrarServico(nome: string, valor: number, descricao: string): Promise<boolean> {
        const sucesso = await servicoApiService.cadastrarServico({ nome, valor, descricao });
        if (sucesso) {
            console.log(`Serviço ${nome} cadastrado com sucesso via API!`);
            await this.getServicos(); 
        } else {
            console.warn(`Falha ao cadastrar serviço ${nome} via API.`);
        }
        return sucesso;
    }

    async atualizarServico(idServico: number, novoNome: string, novoValor: number, novaDescricao: string): Promise<boolean> {
        const sucesso = await servicoApiService.atualizarServico(idServico, novoNome, novoValor, novaDescricao);
        if (sucesso) {
            console.log(`Serviço ID ${idServico} atualizado com sucesso via API!`);
            await this.getServicos();
        } else {
            console.warn(`Falha ao atualizar serviço ID ${idServico} via API.`);
        }
        return sucesso;
    }

    async excluirServico(idServico: number): Promise<boolean> {
        const sucesso = await servicoApiService.excluirServico(idServico);
        if (sucesso) {
            console.log(`Serviço ID ${idServico} excluído com sucesso via API!`);
            await this.getServicos();
        } else {
            console.warn(`Falha ao excluir serviço ID ${idServico} via API.`);
        }
        return sucesso;
    }

    async registrarConsumo(clienteId: number, itemId: number, tipoItem: 'produto' | 'servico'): Promise<boolean> {
        const sucesso = await consumoApiService.registrarConsumo(clienteId, itemId, tipoItem);
        if (sucesso) {
            console.log(`Consumo registrado para Cliente ID ${clienteId}, Item ID ${itemId} (${tipoItem}) (API).`);
        } else {
            console.warn(`Falha ao registrar consumo para Cliente ID ${clienteId}, Item ID ${itemId} (${tipoItem}) (API).`);
        }
        return sucesso;
    }

    async getRelatorioTop10ClientesPorQuantidade(): Promise<any[]> {
        return await consumoApiService.getRelatorioTop10ClientesPorQuantidade();
    }

    async getRelatorioTop5ClientesPorValor(): Promise<any[]> {
        return await consumoApiService.getRelatorioTop5ClientesPorValor();
    }

    async getRelatorioProdutosServicosMaisConsumidos(): Promise<any[]> {
        return await consumoApiService.getRelatorioProdutosServicosMaisConsumidos();
    }

    async getRelatorioConsumoPorTipoRaca(): Promise<any[]> {
        return await consumoApiService.getRelatorioConsumoPorTipoRaca();
    }

    async getRelatorioConsumoPorTipo(): Promise<any[]> {
        return await consumoApiService.getRelatorioConsumoPorTipo();
    }
}

const empresaService = new EmpresaService();
export default empresaService;