import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Pet from 'modelo/pet';
type Props = {
    tema: string;
    seletorView: (novaTela: string, evento?: React.MouseEvent | React.FormEvent) => void;
    pet: Pet;
    excluirPet: (idPet: number) => Promise<boolean>;
    atualizarDados: () => void;
};

export default function ConfirmacaoExclusaoPet(props: Props) {
    const handleExcluir = async (event: React.MouseEvent) => {
        event.preventDefault();
        if (!props.pet || props.pet.id === null) {
            console.warn("Nenhum pet selecionado ou ID inválido para exclusão.");
            alert("Erro: ID do pet inválido para exclusão.");
            return;
        }
        const idPet = props.pet.id;
        const nomePet = props.pet.getNome;
        const sucesso = await props.excluirPet(idPet);
        if (sucesso) {
            console.log(`Pet "${nomePet}" (ID: ${idPet}) excluído com sucesso via API!`);
            props.atualizarDados();
            props.seletorView('Pets', event);
        } else {
            console.error(`Falha ao excluir pet "${nomePet}" (ID: ${idPet}) via API.`);
            alert("Erro ao excluir pet. Verifique o console.");
        }
    };
    const { tema, seletorView, pet } = props;
    if (!pet) {
        return (
            <div className="container-fluid">
                <h2>Excluir Pet</h2>
                <p className="alert alert-warning">Nenhum pet selecionado para exclusão. Por favor, volte para a lista de pets e selecione um.</p>
                <button type="button" className="btn btn-secondary" onClick={(e) => seletorView('Pets', e)}>Voltar</button>
            </div>
        );
    }
    return (
        <div className="container-fluid">
            <h2>Confirmar Exclusão de Pet</h2>
            <div className="alert alert-warning" role="alert">
                Você tem certeza que deseja excluir o pet: <strong>{pet.getNome}</strong> (Tipo: {pet.getTipo}, Raça: {pet.getRaca}) do cliente com CPF: {pet.cliente?.getCpf?.getValor || 'N/A'} (ID do Pet: {pet.id})?
            </div>
            <button
                type="button"
                className="btn btn-danger me-2"
                onClick={handleExcluir}
            >
                Sim, Excluir
            </button>
            <button
                type="button"
                className="btn btn-secondary"
                onClick={(e) => seletorView('Pets', e)}
            >
                Cancelar
            </button>
        </div>
    );
}