import Produto from "modelo/produto";

const API_BASE_URL = 'http://localhost:32831/produto'; 

class ProdutoApiService {
    async getProdutos(): Promise<Produto[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/produtos`);
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            const data = await response.json();
            return data.map((prodData: any) => new Produto(prodData.nome, prodData.valor, prodData.descricao, prodData.id)); 
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            return [];
        }
    }

    async cadastrarProduto(produto: { nome: string, valor: number, descricao: string }): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/cadastrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto),
            });
            if (response.status === 200 || response.status === 201) {
                console.log(`Produto ${produto.nome} cadastrado com sucesso no backend!`);
                return true;
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao cadastrar produto! Status: ${response.status}, Resposta: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro na requisição de cadastro de produto:", error);
            return false;
        }
    }

    async atualizarProduto(id: number, nome: string, valor: number, descricao: string): Promise<boolean> {
        try {
            const payload = { id, nome, valor, descricao };
            const response = await fetch(`${API_BASE_URL}/atualizar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.status === 200) {
                console.log(`Produto ID ${id} atualizado com sucesso no backend!`);
                return true;
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao atualizar produto! Status: ${response.status}, Resposta: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro na requisição de atualização de produto:", error);
            return false;
        }
    }

    async excluirProduto(id: number): Promise<boolean> {
        try {
            const payload = { id };
            const response = await fetch(`${API_BASE_URL}/excluir`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.status === 200) {
                console.log(`Produto ID ${id} excluído com sucesso do backend!`);
                return true;
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao excluir produto! Status: ${response.status}, Resposta: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro na requisição de exclusão de produto:", error);
            return false;
        }
    }
}

const produtoApiService = new ProdutoApiService();
export default produtoApiService;