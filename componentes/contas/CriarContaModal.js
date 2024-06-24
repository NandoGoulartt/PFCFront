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
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { api } from '@/conexao/axios';

const CriarContaModal = ({ isOpen, onClose, onContaCriada }) => {
  const [descricao, setDescricao] = useState('');
  const [comentario, setComentario] = useState('');
  const [erroDescricao, setErroDescricao] = useState('');
  const [erroComentario, setErroComentario] = useState('');

  const handleDescricaoChange = (event) => {
    setDescricao(event.target.value);
    setErroDescricao('');
  };

  const handleComentarioChange = (event) => {
    setComentario(event.target.value);
    setErroComentario('');
  };

  const handleContaSubmit = async () => {
    try {
      if (!descricao.trim()) {
        setErroDescricao('Campo obrigatório');
        return;
      }

      const resposta = await api.post('contas', { description: descricao, comments: comentario });

      if (resposta.status === 201) {
        console.log('Conta criada com sucesso:', resposta.data);
        setDescricao('');
        setComentario('');
        onContaCriada();
        onClose();
      } else {
        console.error('Erro ao criar conta:', resposta);
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }
  };

  const handleModalClose = () => {
    setDescricao('');
    setComentario('');
    setErroDescricao('');
    setErroComentario('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Criar Conta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired isInvalid={!!erroDescricao} mb={4}>
            <FormLabel>Descrição da Conta</FormLabel>
            <Input
              placeholder="Descrição da Conta"
              value={descricao}
              onChange={handleDescricaoChange}
            />
            <FormErrorMessage>{erroDescricao}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Deixe um comentário</FormLabel>
            <Textarea
              placeholder="Deixe um comentário"
              value={comentario}
              onChange={handleComentarioChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleContaSubmit}>
            Criar Conta
          </Button>
          <Button onClick={handleModalClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CriarContaModal;
