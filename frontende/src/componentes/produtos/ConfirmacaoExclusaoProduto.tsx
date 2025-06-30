import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Produto from '../../modelo/produto';

type Props = {
    tema: string;
    seletorView: (novaTela: string, evento?: React.MouseEvent | React.FormEvent) => void;
    produto: Produto;
    excluirProduto: (idProduto: number) => Promise<boolean>; 
    atualizarDados: () => void;
};

export default function ConfirmacaoExclusaoProduto(props: Props) {
    const handleExcluir = async (event: React.MouseEvent) => { 
        event.preventDefault();
        if (!props.produto || props.produto.id === null) { 
            console.warn("Nenhum produto selecionado ou ID inválido para exclusão.");
            alert("Erro: Produto inválido para exclusão.");
            return;
        }

        const nomeProduto = props.produto.getNome;
        const idProduto = props.produto.id; 

        const sucesso = await props.excluirProduto(idProduto);
        
        if (sucesso) { 
            console.log(`Produto "${nomeProduto}" (ID: ${idProduto}) excluído com sucesso via API!`);
            props.atualizarDados(); 
            props.seletorView('Produtos', event); 
        } else {
            console.error(`Falha ao excluir produto "${nomeProduto}" (ID: ${idProduto}) via API.`);
            alert("Erro ao excluir produto. Verifique o console para mais detalhes."); 
        }
    };

    const { tema, seletorView, produto } = props;

    if (!produto) {
        return (
            <div className="container-fluid">
                <h2>Excluir Produto</h2>
                <p className="alert alert-warning">Nenhum produto selecionado para exclusão. Por favor, volte para a lista de produtos e selecione um.</p>
                <button type="button" className="btn btn-secondary" onClick={(e) => seletorView('Produtos', e)}>Voltar</button>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h2>Confirmar Exclusão de Produto</h2>
            <div className="alert alert-warning" role="alert">
                Você tem certeza que deseja excluir o produto: <strong>{produto.getNome}</strong> (Valor: R$ {produto.getValor.toFixed(2)}, Descrição: {produto.getDescricao}) (ID: {produto.id})?
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
                onClick={(e) => seletorView('Produtos', e)}
            >
                Cancelar
            </button>
        </div>
    );
}