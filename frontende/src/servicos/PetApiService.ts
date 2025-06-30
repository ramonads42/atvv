import Pet from "../modelo/pet"; 
import Cliente from "../modelo/cliente"; 
import CPF from "../modelo/cpf"; 

const API_BASE_URL = 'http://localhost:32831/pet';

class PetApiService {

    async getPets(): Promise<Pet[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/pets`);
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            const data = await response.json();
            
            return data.map((petData: any) => {
                let clienteDono: Cliente | null = null;
                if (petData.cliente_id) {
                    clienteDono = new Cliente(
                        "Nome do Cliente Desconhecido", 
                        "Nome Social Desconhecido",    
                        new CPF("CPF Não Disponível", new Date()),
                        petData.cliente_id 
                    );
                }

                const pet = new Pet(petData.nome, petData.tipo, petData.raca, petData.genero, clienteDono, petData.id);
                return pet;
            });
        } catch (error) {
            console.error("Erro ao buscar pets:", error);
            return []; 
        }
    }

    async cadastrarPet(pet: { nome: string, tipo: string, raca: string, genero: string, clienteId: number | null }): Promise<boolean> {
        try {
            if (!pet.clienteId) {
                console.error("Erro: ID do cliente dono é necessário para cadastrar o pet no backend.");
                return false;
            }
            const payload = {
                nome: pet.nome,
                tipo: pet.tipo,
                raca: pet.raca,
                genero: pet.genero,
                cliente: { id: pet.clienteId } 
            };

            const response = await fetch(`${API_BASE_URL}/cadastrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 200 || response.status === 201) {
                console.log(`Pet ${pet.nome} cadastrado com sucesso no backend para o cliente ID ${pet.clienteId}!`);
                return true;
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao cadastrar pet! Status: ${response.status}, Resposta: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro na requisição de cadastro de pet:", error);
            return false;
        }
    }

    async atualizarPet(pet: { id: number, nome: string, tipo: string, raca: string, genero: string, clienteId: number | null }): Promise<boolean> {
        try {
            if (!pet.id) {
                console.error("Erro: ID do pet é necessário para atualizar.");
                return false;
            }
            const payload = {
                id: pet.id,
                nome: pet.nome,
                tipo: pet.tipo,
                raca: pet.raca,
                genero: pet.genero,
                cliente: pet.clienteId ? { id: pet.clienteId } : null
            };

            const response = await fetch(`${API_BASE_URL}/atualizar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 200) {
                console.log(`Pet ID ${pet.id} atualizado com sucesso no backend!`);
                return true;
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao atualizar pet! Status: ${response.status}, Resposta: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro na requisição de atualização de pet:", error);
            return false;
        }
    }


    async excluirPet(idPet: number): Promise<boolean> {
        try {
            const payload = { id: idPet };

            const response = await fetch(`${API_BASE_URL}/excluir`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 200) {
                console.log(`Pet ID ${idPet} excluído com sucesso do backend!`);
                return true;
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao excluir pet! Status: ${response.status}, Resposta: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro na requisição de exclusão de pet:", error);
            return false;
        }
    }
}

const petApiService = new PetApiService();
export default petApiService;
