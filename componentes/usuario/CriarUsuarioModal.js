import { useState } from 'react';
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

const CriarUsuarioModal = ({ isOpen, onClose, onUsuarioCriado }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [level, setLevel] = useState('admin');
  const [status, setStatus] = useState('Ativo');
  const [erroFormulario, setErroFormulario] = useState('');
  const [erroApi, setErroApi] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUserChange = (event) => {
    setUser(event.target.value);
  };

  const handlePwdChange = (event) => {
    setPwd(event.target.value);
  };

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleUsuarioSubmit = async () => {
    try {
      if (!name || !email || !user || !pwd || !level || !status) {
        setErroFormulario('Por favor, preencha todos os campos.');
        return;
      }

      const resposta = await api.post('usuarios', {
        name,
        email,
        user,
        pwd,
        level,
        status,
      });

      if (resposta.status === 201) {
        console.log('Usuário criado com sucesso:', resposta.data);
        setName('');
        setEmail('');
        setUser('');
        setPwd('');
        setLevel('admin');
        setStatus('Ativo');
        onUsuarioCriado();
        onClose();
      } else {
        console.error('Erro ao criar usuário:', resposta);
        console.log(error)
        setErroApi(error.response.data.message);
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      setErroApi(error.response.data.message);
      console.log(error)
    }
  };

  const handleModalClose = () => {
    setName('');
    setEmail('');
    setUser('');
    setPwd('');
    setLevel('admin');
    setStatus('Ativo');
    setErroFormulario('');
    setErroApi('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Criar Usuário</ModalHeader>
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
            <FormLabel>Senha</FormLabel>
            <Input
              placeholder="Senha"
              type="password"
              value={pwd}
              onChange={handlePwdChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Nível de Acesso</FormLabel>
            <Select
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
            Criar Usuário
          </Button>
          <Button onClick={handleModalClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CriarUsuarioModal;
