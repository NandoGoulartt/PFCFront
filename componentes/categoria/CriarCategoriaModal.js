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

const CriarCategoriaModal = ({ isOpen, onClose, onCategoriaCriada }) => {
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [erroFormulario, setErroFormulario] = useState('');

  const handleDescricaoChange = (event) => {
    setDescricao(event.target.value);
  };

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
  };

  const handleCategoriaSubmit = async () => {
    try {
      if (!descricao || !tipo) {
        setErroFormulario('Por favor, preencha todos os campos.');
        return;
      }

      const resposta = await api.post('categorias', { description: descricao, type: tipo });

      if (resposta.status === 201) {
        console.log('Categoria criada com sucesso:', resposta.data);
        setDescricao('');
        setTipo('');
        onCategoriaCriada();
        onClose();
      } else {
        console.error('Erro ao criar categoria:', resposta);
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }
  };

  const handleModalClose = () => {
    setDescricao('');
    setTipo('');
    setErroFormulario('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Criar Categoria</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Descrição da categoria</FormLabel>
            <Input
              placeholder="Descrição da categoria"
              value={descricao}
              onChange={handleDescricaoChange}
            />
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel>Selecione o tipo</FormLabel>
            <Select
              placeholder="Selecione o tipo"
              value={tipo}
              onChange={handleTipoChange}
            >
              <option value="Despesa">Despesa</option>
              <option value="Receita">Receita</option>
            </Select>
            {erroFormulario && (
              <FormControl isInvalid>
                <FormErrorMessage>{erroFormulario}</FormErrorMessage>
              </FormControl>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCategoriaSubmit}>
            Criar Categoria
          </Button>
          <Button onClick={handleModalClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CriarCategoriaModal;
