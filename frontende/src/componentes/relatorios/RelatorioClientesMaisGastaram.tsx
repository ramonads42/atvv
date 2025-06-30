import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

type Props = {
    tema: string;
    seletorView: (novaTela: string, evento?: React.MouseEvent | React.FormEvent) => void;
    getRelatorio: () => Promise<{ idCliente: number, nomeCliente: string, valorTotalGasto: number }[]>;
};

type RelatorioItem = {
    idCliente: number;
    nomeCliente: string;
    valorTotalGasto: number;
};

export default function RelatorioClientesMaisGastaram(props: Props) {
    const [relatorio, setRelatorio] = useState<RelatorioItem[]>([]);

    const carregarRelatorio = async () => { 
        const dadosRelatorio = await props.getRelatorio(); 
        setRelatorio(dadosRelatorio.map(item => ({
            idCliente: item.idCliente,
            nomeCliente: item.nomeCliente,
            valorTotalGasto: item.valorTotalGasto,
        })));
    };

    useEffect(() => {
        carregarRelatorio();
    }, [props.getRelatorio]); 

    const { tema, seletorView } = props;

    return (
        <div className="container-fluid">
            <h2>Top 5 Clientes que Mais Gastaram (Valor)</h2>
            {relatorio.length > 0 && relatorio.some(item => item.valorTotalGasto > 0) ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Cliente</th>
                            <th>Valor Total Gasto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {relatorio.filter(item => item.valorTotalGasto > 0).map((item, index) => (
                            <tr key={item.idCliente}> 
                                <td>{index + 1}</td> 
                                <td>{item.nomeCliente}</td>
                                <td>R$ {item.valorTotalGasto.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="alert alert-info">Nenhum consumo registrado ou clientes com gasto zero.</p>
            )}
            <button type="button" className="btn btn-secondary mt-3" onClick={(e) => seletorView('Relatórios', e)}>
                Voltar aos Relatórios
            </button>
        </div>
    );
}