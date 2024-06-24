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

const EditarLancamentoModal = ({ isOpen, onClose, lancamentoSelecionado, onLancamentoEditado }) => {
  const [tipo, setTipo] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [contas, setContas] = useState([]);
  const [conta, setConta] = useState('');
  const [status, setStatus] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [erroFormulario, setErroFormulario] = useState('');
  const [erroApi, setErroApi] = useState('');

  useEffect(() => {
    if (isOpen && lancamentoSelecionado) {
      const fetchData = async () => {
        try {
          const [contasResponse, categoriasResponse] = await Promise.all([
            api.get('contas'),
            api.get('categorias'),
          ]);
          setContas(contasResponse.data);
          setCategorias(categoriasResponse.data);

          setTipo(lancamentoSelecionado.type);
          setCategoria(lancamentoSelecionado.categories);
          setDescricao(lancamentoSelecionado.description);
          setValor(String(lancamentoSelecionado.value));
          setDataVencimento(formatarData(lancamentoSelecionado.due_date));
          setDataPagamento(formatarData(lancamentoSelecionado.payment_date));
          setConta(lancamentoSelecionado.account);
          setStatus(lancamentoSelecionado.status);
          setComentarios(lancamentoSelecionado.comments);
        } catch (error) {
          console.error('Erro ao buscar contas ou categorias:', error);
          setErroApi('Erro ao buscar contas ou categorias');
        }
      };

      fetchData();
    }
  }, [isOpen, lancamentoSelecionado]);

  const formatarData = (data) => {
    if (!data) return '';
    return data.split('T')[0];
  };

  const handleDescricaoChange = (event) => {
    setDescricao(event.target.value);
  };

  const handleValorChange = (event) => {
    setValor(event.target.value);
  };

  const handleDataVencimentoChange = (event) => {
    setDataVencimento(event.target.value);
  };

  const handleDataPagamentoChange = (event) => {
    setDataPagamento(event.target.value);
  };

  const handleContaChange = (event) => {
    setConta(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleComentariosChange = (event) => {
    setComentarios(event.target.value);
  };

  const handleLancamentoSubmit = async () => {
    try {
      if (!descricao || !valor || !dataVencimento || !conta || !status) {
        setErroFormulario('Por favor, preencha todos os campos.');
        return;
      }

      const resposta = await api.put(`lancamentos/${lancamentoSelecionado._id}`, {
        type: tipo,
        categories: categoria,
        description: descricao,
        value: parseFloat(valor),
        due_date: dataVencimento,
        payment_date: dataPagamento,
        account: conta,
        status: status,
        comments: comentarios,
      });

      if (resposta.status === 200) {
        console.log('Lançamento editado com sucesso:', resposta.data);
        setErroFormulario('');
        onLancamentoEditado();
        onClose();
      } else {
        console.error('Erro ao editar lançamento:', resposta);
        setErroApi('Erro ao editar lançamento. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      setErroApi('Erro ao conectar com o servidor. Por favor, tente novamente mais tarde.');
    }
  };

  const handleModalClose = () => {
    setErroFormulario('');
    setErroApi('');
    onClose();
  };

  const handleCategoriaChange = (e) => {
    const categoriaSelecionada = categorias.find(cat => cat.description === e.target.value);
    setCategoria(e.target.value);
    setTipo(categoriaSelecionada?.type)
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Lançamento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Categoria</FormLabel>
            <Select value={categoria} onChange={handleCategoriaChange}>
              <option value="">Selecione uma opção</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.description}>
                  {cat.description}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Tipo</FormLabel>
            <Select value={tipo} disabled>
              <option value="">Selecione uma opção</option>
              <option value="Despesa">Despesa</option>
              <option value="Receita">Receita</option>
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Descrição</FormLabel>
            <Input placeholder="Descrição" value={descricao} onChange={handleDescricaoChange} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Valor</FormLabel>
            <Input placeholder="Valor" type="number" value={valor} onChange={handleValorChange} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Data de Vencimento</FormLabel>
            <Input
              placeholder="Data de Vencimento"
              type="date"
              value={dataVencimento}
              onChange={handleDataVencimentoChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Data de Pagamento</FormLabel>
            <Input
              placeholder="Data de Pagamento"
              type="date"
              value={dataPagamento}
              onChange={handleDataPagamentoChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Conta</FormLabel>
            <Select value={conta} onChange={handleContaChange}>
              {contas.map((conta) => (
                <option key={conta.id} value={conta.description}>
                  {conta.description} - {conta.comments}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Status</FormLabel>
            <Select value={status} onChange={handleStatusChange}>
              <option value="Lancada">Lançada</option>
              <option value="Paga">Paga</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Cancelada">Cancelada</option>
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Comentários</FormLabel>
            <Input placeholder="Comentários" value={comentarios} onChange={handleComentariosChange} />
          </FormControl>
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
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleLancamentoSubmit}>
            Salvar
          </Button>
          <Button onClick={handleModalClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditarLancamentoModal;
