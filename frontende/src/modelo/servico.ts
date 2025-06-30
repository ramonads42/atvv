export default class Servico {
    public id: number | null; 
    private nome: string
    private valor: number
    private descricao: string
    
    constructor(nome: string, valor: number, descricao: string, id: number | null = null) {
        this.nome = nome
        this.valor = valor
        this.descricao = descricao
        this.id = id; 
    }
    
    public get getNome(): string {
        return this.nome
    }
    
    public get getValor(): number {
        return this.valor
    }
    
    public get getDescricao(): string {
        return this.descricao
    }
    
    public setNome(nome: string): void {
        this.nome = nome
    }
    
    public setValor(valor: number): void {
        this.valor = valor
    }
    
    public setDescricao(descricao: string): void {
        this.descricao = descricao
    }

    public setId(id: number): void { 
        this.id = id;
    }
}