import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Cliente from '../../modelo/cliente';
import Produto from '../../modelo/produto';
import Servico from '../../modelo/servico';

type ClienteData = Cliente;
type ProdutoData = Produto;
type ServicoData = Servico;

type Props = {
    tema: string;
    seletorView: (novaTela: string, evento?: React.MouseEvent | React.FormEvent) => void;
    clientes: ClienteData[];
    produtos: ProdutoData[];
    servicos: ServicoData[];
    registrarConsumo: (clienteId: number, itemId: number, tipoItem: 'produto' | 'servico') => Promise<boolean>; 
    atualizarDados: () => void;
};

export default function RegistroConsumo(props: Props) {
    const [clienteSelecionadoId, setClienteSelecionadoId] = useState<number | null>(null); 
    const [itemTipo, setItemTipo] = useState<'produto' | 'servico' | ''>('');
    const [itemId, setItemId] = useState<number | null>(null); 
    const [feedback, setFeedback] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name === "clienteSelecionadoId") { 
            setClienteSelecionadoId(value ? parseInt(value) : null);
            setItemTipo(''); 
            setItemId(null); 
        } else if (name === "itemTipo") {
            setItemTipo(value as 'produto' | 'servico' | '');
            setItemId(null); 
        } else if (name === "itemId") {
            setItemId(value ? parseInt(value) : null);
        }
    };

    const handleSelectCliente = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClienteSelecionadoId(event.target.value ? parseInt(event.target.value) : null);
        setItemTipo(''); 
        setItemId(null); 
        setFeedback(''); 
    };

    const handleSelectTipoItem = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemTipo(event.target.value as 'produto' | 'servico' | '');
        setItemId(null); 
        setFeedback(''); 
    };

    const handleSelectItem = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemId(event.target.value ? parseInt(event.target.value) : null);
        setFeedback(''); 
    };

    const handleSubmit = async (event: React.FormEvent) => { 
        event.preventDefault();
        setFeedback(''); 

        if (clienteSelecionadoId === null || !itemTipo || itemId === null) {
            setFeedback('Por favor, selecione um cliente, tipo de item e o item.');
            return;
        }

        const sucesso = await props.registrarConsumo(clienteSelecionadoId, itemId, itemTipo); 
        if (sucesso) {
            setFeedback(`Consumo registrado com sucesso!`);
            props.atualizarDados(); 
            setClienteSelecionadoId(null);
            setItemTipo('');
            setItemId(null);
        } else {
            setFeedback('Erro ao registrar consumo. Verifique o console.'); 
        }
    };

    const { tema, seletorView, clientes, produtos, servicos } = props;

    const itensDisponiveis = itemTipo === 'produto' ? produtos : itemTipo === 'servico' ? servicos : [];

    return (
        <div className="container-fluid">
            <h2>Registro de Consumo</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="clienteSelecionadoId" className="form-label">Cliente</label> 
                    <select
                        className="form-select"
                        id="clienteSelecionadoId"
                        name="clienteSelecionadoId"
                        value={clienteSelecionadoId !== null ? clienteSelecionadoId : ''} 
                        onChange={handleSelectCliente}
                        required
                    >
                        <option value="">Selecione um cliente...</option>
                        {clientes.map(cliente => {
                            const clienteId = cliente.id;
                            const keyValue = clienteId != null ? String(clienteId) : cliente.getCpf.getValor;
                            const optionValue = clienteId != null ? String(clienteId) : '';
                            
                            return (
                                <option 
                                    key={keyValue} 
                                    value={optionValue}
                                > 
                                    {cliente.nome} (ID: {clienteId || 'N/A'})
                                </option>
                            );
                        })}
                    </select>
                </div>

                
                {clienteSelecionadoId !== null && ( 
                    <>
                        <div className="mb-3">
                            <label htmlFor="itemTipo" className="form-label">Tipo de Item</label>
                            <select
                                className="form-select"
                                id="itemTipo"
                                name="itemTipo"
                                value={itemTipo}
                                onChange={handleSelectTipoItem}
                                required
                            >
                                <option value="">Selecione o tipo...</option>
                                <option value="produto">Produto</option>
                                <option value="servico">Serviço</option>
                            </select>
                        </div>

                        {itemTipo && (
                            <div className="mb-3">
                                <label htmlFor="itemId" className="form-label">Item</label>
                                <select
                                    className="form-select"
                                    id="itemId"
                                    name="itemId"
                                    value={itemId !== null ? itemId : ''} 
                                    onChange={handleSelectItem}
                                    required
                                >
                                    <option value="">Selecione o item...</option>
                                    {itensDisponiveis.map(item => {
                                        const itemId = item.id;
                                        const keyValue = itemId != null ? String(itemId) : item.getNome;
                                        const optionValue = itemId != null ? String(itemId) : '';
                                        
                                        return (
                                            <option 
                                                key={keyValue} 
                                                value={optionValue}
                                            > 
                                                {item.getNome} (R$ {item.getValor.toFixed(2)})
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        )}
                    </>
                )}

                {feedback && (
                    <div className={`alert ${feedback.includes('sucesso') ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
                        {feedback}
                    </div>
                )}

                <button type="submit" className="btn btn-success me-2" disabled={clienteSelecionadoId === null || !itemTipo || itemId === null}>Registrar Consumo</button>
                <button type="button" className="btn btn-secondary" onClick={(e) => seletorView('Clientes', e)}>Voltar ao Menu</button>
            </form>
        </div>
    );
}