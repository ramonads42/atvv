import Servico from "modelo/servico";

const API_BASE_URL = 'http://localhost:32831/servico'; 

class ServicoApiService {
    async getServicos(): Promise<Servico[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/servicos`);
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            const data = await response.json();
            return data.map((servData: any) => new Servico(servData.nome, servData.valor, servData.descricao, servData.id)); 
        } catch (error) {
            console.error("Erro ao buscar serviços:", error);
            return [];
        }
    }

    async cadastrarServico(servico: { nome: string, valor: number, descricao: string }): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/cadastrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(servico),
            });
            if (response.status === 200 || response.status === 201) {
                console.log(`Serviço ${servico.nome} cadastrado com sucesso no backend!`);
                return true;
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao cadastrar serviço! Status: ${response.status}, Resposta: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro na requisição de cadastro de serviço:", error);
            return false;
        }
    }

    async atualizarServico(id: number, nome: string, valor: number, descricao: string): Promise<boolean> {
        try {
            const payload = { id, nome, valor, descricao };
            const response = await fetch(`${API_BASE_URL}/atualizar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.status === 200) {
                console.log(`Serviço ID ${id} atualizado com sucesso no backend!`);
                return true;
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao atualizar serviço! Status: ${response.status}, Resposta: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro na requisição de atualização de serviço:", error);
            return false;
        }
    }

    async excluirServico(id: number): Promise<boolean> {
        try {
            const payload = { id };
            const response = await fetch(`${API_BASE_URL}/excluir`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.status === 200) {
                console.log(`Serviço ID ${id} excluído com sucesso do backend!`);
                return true;
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao excluir serviço! Status: ${response.status}, Resposta: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro na requisição de exclusão de serviço:", error);
            return false;
        }
    }
}

const servicoApiService = new ServicoApiService();
export default servicoApiService;