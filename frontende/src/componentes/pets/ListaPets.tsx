import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Pet from "modelo/pet"; 
import Cliente from "modelo/cliente"; 

type Props = {
    tema: string;
    seletorView: (novaTela: string, evento?: React.MouseEvent | React.FormEvent) => void;
    selecionarViewComItem: (novaTela: string, item: Pet, evento?: React.MouseEvent | React.FormEvent) => void; 
    pets: Pet[]; 
    atualizarDados: () => void;
};

export default function ListaPets(props: Props) {
    const { tema, seletorView, selecionarViewComItem, pets } = props;

    return (
        <div className="container-fluid">
            <h2>Lista de Pets</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th> {}
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Raça</th>
                        <th>Gênero</th>
                        <th>CPF do Dono</th> {}
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pets.length > 0 ? (
                        pets.map((pet, index) => (

                            <tr key={pet.id !== null ? pet.id : `${pet.getNome}-${pet.cliente?.id}-${index}`}> 
                                <td>{pet.id !== null ? pet.id : 'N/A'}</td> {}
                                <td>{pet.getNome}</td>
                                <td>{pet.getTipo}</td>
                                <td>{pet.getRaca}</td>
                                <td>{pet.getGenero}</td>
                                {}
                                <td>{pet.cliente?.getCpf?.getValor || 'N/A'}</td> 
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={(e) => selecionarViewComItem('Atualizar Pet', pet, e)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={(e) => selecionarViewComItem('Excluir Pet', pet, e)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7}>Nenhum pet cadastrado.</td> {}
                        </tr>
                    )}
                </tbody>
            </table>
            <button
                className="btn btn-success mt-3"
                onClick={(e) => seletorView('Cadastrar Pet', e)}
            >
                Cadastrar Novo Pet
            </button>
        </div>
    );
}
