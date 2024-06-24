import NavBar from "@/componentes/navBar";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Grid,
} from '@chakra-ui/react';
import { useEffect, useState } from "react";
import { api } from '@/conexao/axios';
import CriarContaModal from '@/componentes/contas/CriarContaModal.js';
import EditarContaModal from "@/componentes/contas/EditarContaModal.js";
export default function Page() {
  const [contas, setContas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEditAberto, setModalEditAberto] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);

  useEffect(() => {
    handleContasGet();
  }, []);

  const handleContasGet = async () => {
    try {
      const resposta = await api.get('contas');

      if (resposta.status === 200) {
        setContas(resposta.data);
      } else {
        console.error('Erro ao buscar contas');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }
  };

  const handleAdicionarconta = () => {
    setModalAberto(true);
  };
  const handleEditarconta = (conta) => {
    setContaSelecionada(conta);
    setModalEditAberto(true);
  };

  const handleDeletarConta = async (conta) => {
    try {
      if (window.confirm(`Tem certeza que deseja excluir a conta "${conta.description}"?`)) {
        const response = await api.delete(`contas/${conta._id}`);

        if (response.status === 200) {
          console.log('conta deletada com sucesso:', response.data);
          handleContasGet()
        } else {
          console.error('Erro ao deletar conta');
        }
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error.message);
    }
  };
  return (
    <>
      <NavBar />
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Descrição</Th>
              <Th>Comentário</Th>
            </Tr>
          </Thead>
          <Tbody>
            {contas.map((conta) => (
              <Tr key={conta._id}>
                <Td>{conta._id}</Td>
                <Td>{conta.description}</Td>
                <Td>{conta.comments}</Td>
                <Td>
                  <Button colorScheme="blue" size="sm" mr={2} onClick={() => handleEditarconta(conta)}>
                    Editar
                  </Button>
                  <Button colorScheme="red" size="sm" mr={2} onClick={() => handleDeletarConta(conta)}>
                    Deletar
                  </Button> </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Grid templateColumns="1fr auto" gap={4} alignItems="end" my={4} mx={4}>
        <Button colorScheme="blue" onClick={handleAdicionarconta}>
          Adicionar
        </Button>
      </Grid>
      <CriarContaModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onContaCriada={handleContasGet}
      />
      <EditarContaModal
        isOpen={modalEditAberto}
        onClose={() => setModalEditAberto(false)}
        contaSelecionada={contaSelecionada}
        onContaEditada={handleContasGet}
      />
    </>
  );
}
