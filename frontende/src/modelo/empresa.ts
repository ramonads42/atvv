import Cliente from "./cliente"
import Produto from "./produto"
import Servico from "./servico"
import Pet from "./pet" 

export default class Empresa{
    private clientes: Array<Cliente>
    private produtos: Array<Produto>
    private servicos: Array<Servico>
    private pets: Array<Pet> 

    constructor(){
        this.clientes = []
        this.produtos = []
        this.servicos = []
        this.pets = [] 
    }

    public get getClientes(): Array<Cliente> { 
        return this.clientes
    }
    public get getProdutos(): Array<Produto> { 
        return this.produtos
    }
    public get getServicos(): Array<Servico> { 
        return this.servicos
    }
    public get getPets(): Array<Pet> { 
        return this.pets
    }
}
