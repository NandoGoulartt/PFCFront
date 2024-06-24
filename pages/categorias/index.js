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
import CriarCategoriaModal from '@/componentes/categoria/CriarCategoriaModal.js';
import EditarCategoriaModal from "@/componentes/categoria/EditarCategoriaModal.js";
export default function Page() {
  const [categorias, setCategorias] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEditAberto, setModalEditAberto] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  useEffect(() => {
    handleCategoriasGet();
  }, []);

  const handleCategoriasGet = async () => {
    try {
      const resposta = await api.get('categorias');

      if (resposta.status === 200) {
        setCategorias(resposta.data);
      } else {
        console.error('Erro ao buscar Categorias');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }
  };

  const handleAdicionarCategoria = () => {
    setModalAberto(true);
  };
  const handleEditarCategoria = (categoria) => {
    setCategoriaSelecionada(categoria);
    setModalEditAberto(true);
  };

  const handleDeletarCategoria = async (categoria) => {
    try {
      if (window.confirm(`Tem certeza que deseja excluir a categoria "${categoria.description}"?`)) {
        const response = await api.delete(`categorias/${categoria._id}`);

        if (response.status === 200) {
          console.log('Categoria deletada com sucesso:', response.data);
          handleCategoriasGet()
        } else {
          console.error('Erro ao deletar categoria');
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
              <Th>Tipo</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categorias.map((categoria) => (
              <Tr key={categoria._id}>
                <Td>{categoria._id}</Td>
                <Td>{categoria.description}</Td>
                <Td>{categoria.type}</Td>
                <Td>
                  <Button colorScheme="blue" size="sm" mr={2} onClick={() => handleEditarCategoria(categoria)}>
                    Editar
                  </Button>
                  <Button colorScheme="red" size="sm" mr={2} onClick={() => handleDeletarCategoria(categoria)}>
                    Deletar
                  </Button> </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Grid templateColumns="1fr auto" gap={4} alignItems="end" my={4} mx={4}>
        <Button colorScheme="blue" onClick={handleAdicionarCategoria}>
          Adicionar
        </Button>
      </Grid>
      <CriarCategoriaModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onCategoriaCriada={handleCategoriasGet}
      />
      <EditarCategoriaModal
        isOpen={modalEditAberto}
        onClose={() => setModalEditAberto(false)}
        categoriaSelecionada={categoriaSelecionada}
        onCategoriaEditada={handleCategoriasGet}
      />
    </>
  );
}
