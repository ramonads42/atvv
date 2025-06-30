import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Pet from 'modelo/pet';    
import Cliente from 'modelo/cliente'; 


type Props = {
    tema: string;
    seletorView: (novaTela: string, evento?: React.MouseEvent | React.FormEvent) => void;
    pet: Pet; 
    atualizarPet: (idPet: number, nome: string, tipo: string, raca: string, genero: string, clienteId: number | null) => Promise<boolean>;
    atualizarDados: () => void;
};

export default function FormularioAtualizacaoPet(props: Props) {
    const [nome, setNome] = useState<string>(props.pet ? props.pet.getNome : '');
    const [tipo, setTipo] = useState<string>(props.pet ? props.pet.getTipo : '');
    const [raca, setRaca] = useState<string>(props.pet ? props.pet.getRaca : '');
    const [genero, setGenero] = useState<string>(props.pet ? props.pet.getGenero : '');

    const [cpfClienteDono, setCpfClienteDono] = useState<string>(
        props.pet && props.pet.cliente && props.pet.cliente.getCpf ? props.pet.cliente.getCpf.getValor : 'N/A'
    );
    const [clienteIdDono, setClienteIdDono] = useState<number | null>(
        props.pet && props.pet.cliente ? props.pet.cliente.id : null
    );

    useEffect(() => {
        if (props.pet) {
            setNome(props.pet.getNome);
            setTipo(props.pet.getTipo);
            setRaca(props.pet.getRaca);
            setGenero(props.pet.getGenero);
            setCpfClienteDono(props.pet.cliente && props.pet.cliente.getCpf ? props.pet.cliente.getCpf.getValor : 'N/A');
            setClienteIdDono(props.pet.cliente ? props.pet.cliente.id : null);
        }
    }, [props.pet]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name === "nome") setNome(value);
        else if (name === "tipo") setTipo(value);
        else if (name === "raca") setRaca(value);
        else if (name === "genero") setGenero(value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!props.pet || props.pet.id === null) {
            console.warn("Nenhum pet selecionado ou ID do pet inválido para atualização. (Validação no handleSubmit)");
            alert("Erro: ID do pet inválido para atualização."); 
            return;
        }

        if (!nome || nome.trim() === '' || !tipo || tipo.trim() === '' || !raca || raca.trim() === '' || !genero || genero.trim() === '') {
            alert("Por favor, preencha todos os campos obrigatórios do pet.");
            return;
        }

        const sucesso = await props.atualizarPet(
            props.pet.id,
            nome,
            tipo,
            raca,
            genero,
            clienteIdDono
        );

        if (sucesso) {
            console.log(`Pet ${nome} (ID: ${props.pet.id}) atualizado com sucesso!`);
            props.atualizarDados();
            props.seletorView('Pets', event);
        } else {
            console.error(`Falha ao atualizar pet ${nome} (ID: ${props.pet.id}).`);
            alert("Erro ao atualizar pet. Verifique o console."); 
        }
    };

    const { tema, seletorView, pet } = props;

    if (!pet) {
        return (
            <div className="container-fluid">
                <h2>Atualizar Pet</h2>
                <p className="alert alert-warning">Nenhum pet selecionado para atualização. Por favor, volte para a lista de pets e selecione um.</p>
                <button type="button" className="btn btn-secondary" onClick={(e) => seletorView('Pets', e)}>Voltar</button>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h2>Atualizar Pet: {pet.getNome}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome do Pet</label>
                    <input type="text" className="form-control" id="nome" name="nome" value={nome} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="tipo" className="form-label">Tipo</label>
                    <input type="text" className="form-control" id="tipo" name="tipo" value={tipo} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="raca" className="form-label">Raça</label>
                    <input type="text" className="form-control" id="raca" name="raca" value={raca} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="genero" className="form-label">Gênero</label>
                    <select className="form-select" id="genero" name="genero" value={genero} onChange={handleChange} required>
                        <option value="">Selecione...</option>
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="idPet" className="form-label">ID do Pet (Não Editável)</label>
                    <input type="text" className="form-control" id="idPet" name="idPet" value={pet.id !== null ? pet.id.toString() : 'N/A'} readOnly disabled />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpfCliente" className="form-label">CPF do Cliente Dono (Não Editável)</label>
                    <input type="text" className="form-control" id="cpfCliente" name="cpfCliente" value={cpfClienteDono} readOnly disabled />
                </div>
                <button type="submit" className="btn btn-primary me-2">Atualizar</button>
                <button type="button" className="btn btn-secondary" onClick={(e) => seletorView('Pets', e)}>Cancelar</button>
            </form>
        </div>
    );
}
