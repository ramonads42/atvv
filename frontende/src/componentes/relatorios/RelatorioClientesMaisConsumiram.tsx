import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

type Props = {
    tema: string;
    seletorView: (novaTela: string, evento?: React.MouseEvent | React.FormEvent) => void;
    getRelatorio: () => Promise<{ idCliente: number, nomeCliente: string, quantidadeProdutos: number, quantidadeServicos: number, totalConsumido: number, valorTotalGasto: number }[]>;
};

type RelatorioItem = {
    idCliente: number;
    nomeCliente: string;
    quantidadeProdutos: number;
    quantidadeServicos: number;
    totalConsumido: number;
    valorTotalGasto: number;
};

export default function RelatorioClientesMaisConsumiram(props: Props) {
    const [relatorio, setRelatorio] = useState<RelatorioItem[]>([]);

    const carregarRelatorio = async () => { 
        const dadosRelatorio = await props.getRelatorio(); 
        setRelatorio(dadosRelatorio.map(item => ({
            idCliente: item.idCliente,
            nomeCliente: item.nomeCliente,
            quantidadeProdutos: item.quantidadeProdutos,
            quantidadeServicos: item.quantidadeServicos,
            totalConsumido: item.totalConsumido,
            valorTotalGasto: item.valorTotalGasto,
        })));
    };

    useEffect(() => {
        carregarRelatorio();
    }, [props.getRelatorio]); 

    const { tema, seletorView } = props;

    return (
        <div className="container-fluid">
            <h2>Top 10 Clientes que Mais Consumiram (Quantidade)</h2>
            {relatorio.length > 0 && relatorio.some(item => item.totalConsumido > 0) ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Cliente</th>
                            <th>Produtos</th>
                            <th>Serviços</th>
                            <th>Total Consumido</th>
                        </tr>
                    </thead>
                    <tbody>
                        {relatorio.filter(item => item.totalConsumido > 0).map((item, index) => (
                            <tr key={item.idCliente}> 
                                <td>{index + 1}</td> 
                                <td>{item.nomeCliente}</td>
                                <td>{item.quantidadeProdutos}</td>
                                <td>{item.quantidadeServicos}</td>
                                <td>{item.totalConsumido}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="alert alert-info">Nenhum consumo registrado ou clientes com consumo zero.</p>
            )}
            <button type="button" className="btn btn-secondary mt-3" onClick={(e) => seletorView('Relatórios', e)}>
                Voltar aos Relatórios
            </button>
        </div>
    );
}