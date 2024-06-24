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
import CriarLancamentoModal from '@/componentes/lancamento/CriarLancamentoModal.js';
import EditarLancamentoModal from "@/componentes/lancamento/EditarLancamentoModal.js";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Page() {
  const [lancamentos, setLancamentos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEditAberto, setModalEditAberto] = useState(false);
  const [lancamentoSelecionada, setLancamentoSelecionada] = useState(null);

  useEffect(() => {
    handleLancamentoGet();
  }, []);

  const handleLancamentoGet = async () => {
    try {
      const resposta = await api.get('lancamentos');

      if (resposta.status === 200) {
        setLancamentos(resposta.data);
      } else {
        console.error('Erro ao buscar lançamentos');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }
  };

  const handleAdicionarLancamento = () => {
    setModalAberto(true);
  };

  const handleEditarLancamento = (lancamento) => {
    setLancamentoSelecionada(lancamento);
    setModalEditAberto(true);
  };

  const handleDeletarLancamento = async (lancamento) => {
    try {
      if (window.confirm(`Tem certeza que deseja excluir o lançamento "${lancamento.description}"?`)) {
        const response = await api.delete(`lancamentos/${lancamento._id}`);

        if (response.status === 200) {
          console.log('Lançamento deletado com sucesso:', response.data);
          handleLancamentoGet();
        } else {
          console.error('Erro ao deletar lançamento');
        }
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      <NavBar />
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Tipo</Th>
              <Th>Categoria</Th>
              <Th>Descrição</Th>
              <Th>Valor</Th>
              <Th>Vencimento</Th>
              <Th>Pagamento</Th>
              <Th>Conta</Th>
              <Th>Status</Th>
              <Th>Comentários</Th>
            </Tr>
          </Thead>
          <Tbody>
            {lancamentos.map((lancamento) => (
              <Tr key={lancamento._id}>
                <Td>{lancamento.type}</Td>
                <Td>{lancamento.categories}</Td>
                <Td>{lancamento.description}</Td>
                <Td>{formatCurrency(lancamento.value)}</Td>
                <Td>{formatDate(lancamento.due_date)}</Td>
                <Td>{lancamento.payment_date ? formatDate(lancamento.payment_date) : ''}</Td>
                <Td>{lancamento.account}</Td>
                <Td>{lancamento.status}</Td>
                <Td>{lancamento.comments}</Td>
                <Td>
                  <Button colorScheme="blue" size="sm" mr={2} onClick={() => handleEditarLancamento(lancamento)}>
                    Editar
                  </Button>
                  <Button colorScheme="red" size="sm" mr={2} onClick={() => handleDeletarLancamento(lancamento)}>
                    Deletar
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Grid templateColumns="1fr auto" gap={4} alignItems="end" my={4} mx={4}>
        <Button colorScheme="blue" onClick={handleAdicionarLancamento}>
          Adicionar
        </Button>
      </Grid>
      <CriarLancamentoModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onLancamentoCriado={handleLancamentoGet}
      />
      <EditarLancamentoModal
        isOpen={modalEditAberto}
        onClose={() => setModalEditAberto(false)}
        lancamentoSelecionado={lancamentoSelecionada}
        onLancamentoEditado={handleLancamentoGet}
      />
    </>
  );
}
