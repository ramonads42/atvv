import Cliente from "./cliente"; 

export default class Pet {
    public id: number | null; 
    private nome: string;
    private tipo: string;   
    private raca: string;   
    private genero: string; 
    public cliente: Cliente | null; 

    constructor(nome: string, tipo: string, raca: string, genero: string, cliente: Cliente | null = null, id: number | null = null) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;   
        this.raca = raca;   
        this.genero = genero; 
        this.cliente = cliente; 
    }

    public get getNome(): string { return this.nome; }
    public get getRaca(): string { return this.raca; }
    public get getGenero(): string { return this.genero; }
    public get getTipo(): string { return this.tipo; }
    public get getCliente(): Cliente | null { return this.cliente; }

    public setNome(nome: string): void { this.nome = nome; }
    public setRaca(raca: string): void { this.raca = raca; }
    public setGenero(genero: string): void { this.genero = genero; }
    public setTipo(tipo: string): void { this.tipo = tipo; }
    public setId(id: number): void { this.id = id; }
    public setCliente(cliente: Cliente | null): void { this.cliente = cliente; }
}
