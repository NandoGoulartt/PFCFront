import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { api } from '@/conexao/axios';

const EditarUsuarioModal = ({
  isOpen,
  onClose,
  usuarioSelecionado,
  onUsuarioEditado,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState('');
  const [level, setLevel] = useState('');
  const [status, setStatus] = useState('');
  const [erroFormulario, setErroFormulario] = useState('');
  const [erroApi, setErroApi] = useState('');

  useEffect(() => {
    if (usuarioSelecionado) {
      setName(usuarioSelecionado.name);
      setEmail(usuarioSelecionado.email);
      setUser(usuarioSelecionado.user);
      setLevel(usuarioSelecionado.level);
      setStatus(usuarioSelecionado.status);
    }
  }, [usuarioSelecionado]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUserChange = (event) => {
    setUser(event.target.value);
  };

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleUsuarioSubmit = async () => {
    try {
      if (!name || !email || !user || !level || !status) {
        setErroFormulario('Por favor, preencha todos os campos.');
        return;
      }

      const resposta = await api.put(`usuarios/${usuarioSelecionado._id}`, {
        name,
        email,
        user,
        level,
        status,
      });

      if (resposta.status === 200) {
        console.log('Usuário editado com sucesso:', resposta.data);
        setErroFormulario('');
        onUsuarioEditado();
        onClose();
      } else {
        console.error('Erro ao editar usuário:', resposta);
        setErroApi('Erro ao editar usuário. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      setErroApi('Erro ao conectar com o servidor. Por favor, tente novamente mais tarde.');
    }
  };

  const handleModalClose = () => {
    setName('');
    setEmail('');
    setUser('');
    setLevel('');
    setStatus('');
    setErroFormulario('');
    setErroApi('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Usuário</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Nome</FormLabel>
            <Input
              placeholder="Nome"
              value={name}
              onChange={handleNameChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>E-mail</FormLabel>
            <Input
              placeholder="E-mail"
              value={email}
              onChange={handleEmailChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Usuário</FormLabel>
            <Input
              placeholder="Usuário"
              value={user}
              onChange={handleUserChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Nível de Acesso</FormLabel>
            <Select
              placeholder="Selecione o nível de acesso"
              value={level}
              onChange={handleLevelChange}
            >
              <option value="admin">Admin</option>
              <option value="user">Usuário</option>
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Status</FormLabel>
            <Select
              placeholder="Selecione o status"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </Select>
            {erroFormulario && (
              <FormControl isInvalid>
                <FormErrorMessage>{erroFormulario}</FormErrorMessage>
              </FormControl>
            )}
            {erroApi && (
              <FormControl isInvalid>
                <FormErrorMessage>{erroApi}</FormErrorMessage>
              </FormControl>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUsuarioSubmit}>
            Salvar
          </Button>
          <Button onClick={handleModalClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditarUsuarioModal;
