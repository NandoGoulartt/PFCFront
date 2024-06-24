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

const EditarCategoriaModal = ({
  isOpen,
  onClose,
  categoriaSelecionada,
  onCategoriaEditada,
}) => {
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [erroFormulario, setErroFormulario] = useState('');

  useEffect(() => {
    if (categoriaSelecionada) {
      setDescricao(categoriaSelecionada.description);
      setTipo(categoriaSelecionada.type);
    }
  }, [categoriaSelecionada]);

  const handleDescricaoChange = (event) => {
    setDescricao(event.target.value);
  };

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
  };

  const handleCategoriaSubmit = async () => {
    try {
      // Verifica se ambos os campos estão preenchidos
      if (!descricao || !tipo) {
        setErroFormulario('Por favor, preencha todos os campos.');
        return;
      }

      const resposta = await api.put(`categorias/${categoriaSelecionada._id}`, {
        description: descricao,
        type: tipo,
      });

      if (resposta.status === 200) {
        console.log('Categoria editada com sucesso:', resposta.data);
        onCategoriaEditada();
        onClose();
      } else {
        console.error('Erro ao editar categoria:', resposta);
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }
  };

  const handleModalClose = () => {
    setErroFormulario('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Categoria</ModalHeader>
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
          <FormControl mb={4} isRequired>
            <FormLabel>Selecione o tipo</FormLabel>
            <Select
              placeholder="Selecione o tipo"
              value={tipo}
              onChange={handleTipoChange}
            >
              <option value="Despesa">Despesa</option>
              <option value="Receita">Receita</option>
            </Select>
          </FormControl>
          {erroFormulario && (
            <FormControl isInvalid>
              <FormErrorMessage>{erroFormulario}</FormErrorMessage>
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCategoriaSubmit}>
            Salvar
          </Button>
          <Button onClick={handleModalClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditarCategoriaModal;
