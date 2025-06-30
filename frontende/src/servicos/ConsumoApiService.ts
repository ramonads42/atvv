type RelatorioClienteConsumoData = {
    idCliente: number;
    nomeCliente: string;
    quantidadeProdutos: number;
    quantidadeServicos: number;
    totalConsumido: number;
    valorTotalGasto: number;
};

type RelatorioConsumoItemData = {
    nome: string;
    tipo: 'Produto' | 'Servico'; 
    quantidade: number;
    valorTotal?: number; 
};

type RelatorioConsumoPorTipoRacaData = {
    tipoRaca: string;
    nome: string;
    tipo: 'Produto' | 'Servico'; 
    quantidade: number;
};

type RelatorioConsumoPorTipoData = {
    tipoPet: string;
    nomeItem: string;
    tipoItem: 'Produto' | 'Servico';
    quantidade: number;
};


const API_BASE_URL = 'http://localhost:32831/consumo'; 

class ConsumoApiService {
    async registrarConsumo(clienteId: number, itemId: number, tipoItem: 'produto' | 'servico', quantidade: number = 1): Promise<boolean> {
        try {
            const payload: any = {
                clienteId: clienteId,
                quantidade: quantidade
            };
            if (tipoItem === 'produto') {
                payload.produtoId = itemId;
            } else {
                payload.servicoId = itemId;
            }

            const response = await fetch(`${API_BASE_URL}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.status === 200 || response.status === 201) {
                console.log(`Consumo de ${tipoItem} ID ${itemId} registrado para o cliente ID ${clienteId} no backend!`);
                return true;
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao registrar consumo! Status: ${response.status}, Resposta: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro na requisição de registro de consumo:", error);
            return false;
        }
    }

    async getRelatorioTop10ClientesPorQuantidade(): Promise<RelatorioClienteConsumoData[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/relatorios/clientes-mais-consumiram-quantidade`);
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar relatório Top 10 Clientes por Quantidade:", error);
            return [];
        }
    }

    async getRelatorioTop5ClientesPorValor(): Promise<RelatorioClienteConsumoData[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/relatorios/clientes-mais-gastaram-valor`);
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar relatório Top 5 Clientes por Valor:", error);
            return [];
        }
    }

    async getRelatorioProdutosServicosMaisConsumidos(): Promise<RelatorioConsumoItemData[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/relatorios/produtos-servicos-mais-consumidos`);
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar relatório Produtos/Serviços Mais Consumidos:", error);
            return [];
        }
    }

    async getRelatorioConsumoPorTipoRaca(): Promise<RelatorioConsumoPorTipoRacaData[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/relatorios/consumo-por-tipo-raca`);
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar relatório Consumo por Tipo/Raça:", error);
            return [];
        }
    }

    async getRelatorioConsumoPorTipo(): Promise<RelatorioConsumoPorTipoData[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/relatorios/consumo-por-tipo`);
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar relatório Consumo por Tipo:", error);
            return [];
        }
    }
}

const consumoApiService = new ConsumoApiService();
export default consumoApiService;