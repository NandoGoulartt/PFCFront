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
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { api } from '@/conexao/axios';

const EditarContaModal = ({ isOpen, onClose, contaSelecionada, onContaEditada }) => {
  const [descricao, setDescricao] = useState('');
  const [comentario, setComentario] = useState('');
  const [erroDescricao, setErroDescricao] = useState('');
  const [erroComentario, setErroComentario] = useState('');

  useEffect(() => {
    if (contaSelecionada) {
      setDescricao(contaSelecionada.description);
      setComentario(contaSelecionada.comments);
    }
  }, [contaSelecionada]);

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
      // Validar se os campos obrigatórios estão preenchidos
      if (!descricao.trim()) {
        setErroDescricao('Campo obrigatório');
        return;
      }

      const resposta = await api.put(`contas/${contaSelecionada._id}`, {
        description: descricao,
        comments: comentario,
      });

      if (resposta.status === 200) {
        console.log('Conta editada com sucesso:', resposta.data);
        onContaEditada();
        onClose();
      } else {
        console.error('Erro ao editar conta:', resposta);
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }
  };

  const handleModalClose = () => {
    setErroDescricao('');
    setErroComentario('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Conta</ModalHeader>
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
            Salvar
          </Button>
          <Button onClick={handleModalClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditarContaModal;
