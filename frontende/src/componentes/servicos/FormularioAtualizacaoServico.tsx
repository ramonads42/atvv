import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Servico from '../../modelo/servico';

type Props = {
    tema: string;
    seletorView: (novaTela: string, evento?: React.MouseEvent | React.FormEvent) => void;
    servico: Servico;
    // Tipo de retorno corrigido de 'void' para 'Promise<boolean>' e espera ID
    atualizarServico: (idServico: number, novoNome: string, novoValor: number, novaDescricao: string) => Promise<boolean>;
    atualizarDados: () => void;
};

export default function FormularioAtualizacaoServico(props: Props) {
    // Usar useState para os campos do formulário
    const [nome, setNome] = useState<string>(props.servico ? props.servico.getNome : '');
    const [valor, setValor] = useState<string>(props.servico ? props.servico.getValor.toFixed(2) : '');
    const [descricao, setDescricao] = useState<string>(props.servico ? props.servico.getDescricao : '');

    // useEffect para atualizar o estado local se o 'servico' prop mudar
    useEffect(() => {
        if (props.servico) {
            setNome(props.servico.getNome);
            setValor(props.servico.getValor.toFixed(2));
            setDescricao(props.servico.getDescricao);
        }
    }, [props.servico]); // Dependência: só roda se props.servico mudar

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        if (name === "nome") setNome(value);
        else if (name === "valor") setValor(value);
        else if (name === "descricao") setDescricao(value);
    };

    const handleSubmit = async (event: React.FormEvent) => { // Tornar a função assíncrona
        event.preventDefault();
        // Adiciona verificação de ID do serviço
        if (!props.servico || props.servico.id === null) {
            console.warn("Nenhum serviço selecionado ou ID inválido para atualização.");
            alert("Erro: Serviço inválido para atualização.");
            return;
        }

        const valorNumerico = parseFloat(valor);

        // Validações
        if (!nome || nome.trim() === '' || isNaN(valorNumerico) || valorNumerico < 0) {
            alert("Por favor, preencha o nome e um valor numérico válido para o serviço.");
            return;
        }

        // CHAMA COM O ID DO SERVIÇO
        const sucesso = await props.atualizarServico(props.servico.id, nome, valorNumerico, descricao);
        
        if (sucesso) { // AGORA PODE SER TESTADO PARA VERACIDADE
            console.log("Serviço atualizado com sucesso!");
            props.atualizarDados(); // Recarrega os dados do roteador (que chamará getServicos da API)
            props.seletorView('Serviços', event); // Voltar para a tela de lista de serviços
        } else {
            console.error("Falha ao atualizar serviço.");
            alert("Erro ao atualizar serviço. Verifique o console para mais detalhes."); // Feedback de erro
        }
    };

    const { tema, seletorView, servico } = props;

    // Caso o serviço não esteja selecionado, exibe mensagem de alerta
    if (!servico) {
        return (
            <div className="container-fluid">
                <h2>Atualizar Serviço</h2>
                <p className="alert alert-warning">Nenhum serviço selecionado para atualização. Por favor, volte para a lista de serviços e selecione um.</p>
                <button type="button" className="btn btn-secondary" onClick={(e) => seletorView('Serviços', e)}>Voltar</button>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h2>Atualizar Serviço: {servico.getNome}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome do Serviço</label>
                    <input type="text" className="form-control" id="nome" name="nome" value={nome} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="valor" className="form-label">Valor (R$)</label>
                    <input type="number" step="0.01" className="form-control" id="valor" name="valor" value={valor} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="descricao" className="form-label">Descrição</label>
                    <textarea className="form-control" id="descricao" name="descricao" value={descricao} onChange={handleChange} rows={3}></textarea>
                </div>
                <div className="mb-3"> {/* EXIBIR ID DO SERVIÇO (NÃO EDITÁVEL) */}
                    <label htmlFor="idServico" className="form-label">ID do Serviço (Não Editável)</label>
                    <input type="text" className="form-control" id="idServico" name="idServico" value={servico.id !== null ? servico.id.toString() : 'N/A'} readOnly disabled />
                </div>
                <button type="submit" className="btn btn-primary me-2">Atualizar</button>
                <button type="button" className="btn btn-secondary" onClick={(e) => seletorView('Serviços', e)}>Cancelar</button>
            </form>
        </div>
    );
}