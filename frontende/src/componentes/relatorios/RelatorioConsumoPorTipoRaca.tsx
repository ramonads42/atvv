import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

type Props = {
    tema: string;
    seletorView: (novaTela: string, evento?: React.MouseEvent | React.FormEvent) => void;
    getRelatorio: () => Promise<{ tipoRaca: string, nome: string, tipo: 'Produto' | 'Servico', quantidade: number }[]>;
};

type RelatorioItem = {
    tipoRaca: string;
    nome: string;
    tipo: 'Produto' | 'Servico'; 
    quantidade: number;
};

export default function RelatorioConsumoPorTipoRaca(props: Props) {
    const [relatorio, setRelatorio] = useState<RelatorioItem[]>([]);

    const carregarRelatorio = async () => { 
        const dadosRelatorio = await props.getRelatorio(); 
        setRelatorio(dadosRelatorio);
    };

    useEffect(() => {
        carregarRelatorio();
    }, [props.getRelatorio]); 

    const { tema, seletorView } = props;

    const groupedReports: { [key: string]: RelatorioItem[] } = {};
    relatorio.forEach(item => {
        const groupKey = item.tipoRaca && item.tipoRaca.trim() !== '' ? item.tipoRaca : "NÃO ESPECIFICADO";
        if (!groupedReports[groupKey]) {
            groupedReports[groupKey] = [];
        }
        groupedReports[groupKey].push(item);
    });

    const sortedKeys = Object.keys(groupedReports).sort();

    return (
        <div className="container-fluid">
            <h2>Serviços e Produtos Mais Consumidos por Raça</h2>
            {Object.keys(groupedReports).length > 0 ? (
                sortedKeys.map(tipoRacaKey => (
                    <div key={tipoRacaKey} className="mb-4">
                        <h3>--- {tipoRacaKey.toUpperCase()} ---</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Tipo Item</th>
                                    <th>Nome Item</th>
                                    <th>Quantidade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedReports[tipoRacaKey].map((item) => (
                                    <tr key={`${tipoRacaKey}-${item.nome}-${item.tipo}`}>
                                        <td>{item.tipo}</td>
                                        <td>{item.nome}</td>
                                        <td>{item.quantidade}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p className="alert alert-info">Nenhum consumo registrado por tipo e raça de pets.</p>
            )}
            <button type="button" className="btn btn-secondary mt-3" onClick={(e) => seletorView('Relatórios', e)}>
                Voltar aos Relatórios
            </button>
        </div>
    );
}