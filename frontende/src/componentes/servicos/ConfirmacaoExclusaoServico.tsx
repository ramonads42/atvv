import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Servico from '../../modelo/servico';

type Props = {
    tema: string;
    seletorView: (novaTela: string, evento?: React.MouseEvent | React.FormEvent) => void;
    servico: Servico;
    // Tipo de retorno corrigido de 'void' para 'Promise<boolean>' e espera ID
    excluirServico: (idServico: number) => Promise<boolean>; 
    atualizarDados: () => void;
};

export default function ConfirmacaoExclusaoServico(props: Props) {
    const handleExcluir = async (event: React.MouseEvent) => { // Tornar a função assíncrona
        event.preventDefault();
        // Adiciona verificação de ID do serviço
        if (!props.servico || props.servico.id === null) {
            console.warn("Nenhum serviço selecionado ou ID inválido para exclusão.");
            alert("Erro: Serviço inválido para exclusão.");
            return;
        }

        const nomeServico = props.servico.getNome;
        const idServico = props.servico.id; // Obtenha o ID

        // CHAMA COM O ID DO SERVIÇO
        const sucesso = await props.excluirServico(idServico); 
        
        if (sucesso) { // AGORA PODE SER TESTADO PARA VERACIDADE
            console.log(`Serviço "${nomeServico}" (ID: ${idServico}) excluído com sucesso via API!`);
            props.atualizarDados(); // Recarrega os dados do roteador (que chamará getServicos da API)
            props.seletorView('Serviços', event); // Volta para a tela de lista de serviços
        } else {
            console.error(`Falha ao excluir serviço "${nomeServico}" (ID: ${idServico}) via API.`);
            alert("Erro ao excluir serviço. Verifique o console para mais detalhes."); // Feedback de erro
        }
    };

    const { tema, seletorView, servico } = props;

    // Caso o serviço não esteja selecionado, exibe mensagem de alerta
    if (!servico) {
        return (
            <div className="container-fluid">
                <h2>Excluir Serviço</h2>
                <p className="alert alert-warning">Nenhum serviço selecionado para exclusão. Por favor, volte para a lista de serviços e selecione um.</p>
                <button type="button" className="btn btn-secondary" onClick={(e) => seletorView('Serviços', e)}>Voltar</button>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h2>Confirmar Exclusão de Serviço</h2>
            <div className="alert alert-warning" role="alert">
                Você tem certeza que deseja excluir o serviço: <strong>{servico.getNome}</strong> (Valor: R$ {servico.getValor.toFixed(2)}, Descrição: {servico.getDescricao}) (ID: {servico.id})?
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
                onClick={(e) => seletorView('Serviços', e)}
            >
                Cancelar
            </button>
        </div>
    );
}