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
import CriarUsuarioModal from '@/componentes/usuario/CriarUsuarioModal';
import EditarUsuarioModal from "@/componentes/usuario/EditarUsuarioModal";
export default function Page() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEditAberto, setModalEditAberto] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  useEffect(() => {
    handleUsuariosGet();
  }, []);

  const handleUsuariosGet = async () => {
    try {
      const resposta = await api.get('usuarios');

      if (resposta.status === 200) {
        setUsuarios(resposta.data);
      } else {
        console.error('Erro ao buscar Usuarios');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }
  };

  const handleAdicionarUsuario = () => {
    setModalAberto(true);
  };
  const handleEditarUsuarios = (usuario) => {
    setUsuarioSelecionado(usuario);
    setModalEditAberto(true);
  };

  const handleDeletarUsuario = async (usuario) => {
    try {
      if (window.confirm(`Tem certeza que deseja excluir esse usuario "${usuario.name}"?`)) {
        const response = await api.delete(`usuarios/${usuario._id}`);

        if (response.status === 200) {
          console.log('Usuario deletado com sucesso:', response.data);
          handleUsuariosGet()
        } else {
          console.error('Erro ao deletar usuario');
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
              <Th>Email</Th>
              <Th>Usuario</Th>
              <Th>Status</Th>
              <Th>Cargo</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usuarios.map((usuario) => (
              <Tr key={usuario._id}>
                <Td>{usuario._id}</Td>
                <Td>{usuario.email}</Td>
                <Td>{usuario.user}</Td>
                <Td>{usuario.status}</Td>
                <Td>{usuario.level}</Td>
                <Td>
                  <Button colorScheme="blue" size="sm" mr={2} onClick={() => handleEditarUsuarios(usuario)}>
                    Editar
                  </Button>
                  <Button colorScheme="red" size="sm" mr={2} onClick={() => handleDeletarUsuario(usuario)}>
                    Deletar
                  </Button> </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Grid templateColumns="1fr auto" gap={4} alignItems="end" my={4} mx={4}>
        <Button colorScheme="blue" onClick={handleAdicionarUsuario}>
          Adicionar
        </Button>
      </Grid>
      <CriarUsuarioModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onUsuarioCriado={handleUsuariosGet}
      />
      <EditarUsuarioModal
        isOpen={modalEditAberto}
        onClose={() => setModalEditAberto(false)}
        usuarioSelecionado={usuarioSelecionado}
        onUsuarioEditado={handleUsuariosGet}
      />
    </>
  );
}
