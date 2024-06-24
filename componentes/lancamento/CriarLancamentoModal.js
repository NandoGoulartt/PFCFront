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

const CriarLancamentoModal = ({ isOpen, onClose, onLancamentoCriado }) => {
  const [tipo, setTipo] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [contas, setContas] = useState([]);
  const [conta, setConta] = useState('');
  const [status, setStatus] = useState('Lancada');
  const [comentarios, setComentarios] = useState('');
  const [erroFormulario, setErroFormulario] = useState('');
  const [erroApi, setErroApi] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [contasResponse, categoriasResponse] = await Promise.all([
            api.get('contas'),
            api.get('categorias'),
          ]);
          setContas(contasResponse.data);
          setCategorias(categoriasResponse.data);
        } catch (error) {
          console.error('Erro ao buscar contas ou categorias:', error);
          setErroApi('Erro ao buscar contas ou categorias');
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleLancamentoSubmit = async () => {
    try {
      console.log(tipo, categoria, descricao, parseFloat(valor), dataVencimento, dataPagamento, conta, status, comentarios);

      if (!tipo || !categoria || !descricao || !valor || !dataVencimento || !conta || !status) {
        setErroFormulario('Por favor, preencha todos os campos.');
        return;
      }

      const resposta = await api.post('lancamentos', {
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

      if (resposta.status === 201) {
        console.log('Lançamento criado com sucesso:', resposta.data);
        setTipo('');
        setCategoria('');
        setDescricao('');
        setValor('');
        setDataVencimento('');
        setDataPagamento('');
        setConta('');
        setStatus('Lancada');
        setComentarios('');
        onLancamentoCriado();
        onClose();
      } else {
        console.error('Erro ao criar lançamento:', resposta);
        setErroApi(resposta.data.message);
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      setErroApi(error.response?.data?.message || 'Erro ao fazer a requisição');
    }
  };

  const handleModalClose = () => {
    setTipo('');
    setCategoria('');
    setDescricao('');
    setValor('');
    setDataVencimento('');
    setDataPagamento('');
    setConta('');
    setStatus('Lancada');
    setComentarios('');
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
        <ModalHeader>Criar Lançamento</ModalHeader>
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
            <Input
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Valor</FormLabel>
            <Input
              placeholder="Valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Data de Vencimento</FormLabel>
            <Input
              placeholder="Data de Vencimento"
              type="date"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Data de Pagamento</FormLabel>
            <Input
              placeholder="Data de Pagamento"
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Conta</FormLabel>
            <Select value={conta} onChange={(e) => setConta(e.target.value)}>
              <option value="">Selecione uma opção</option>
              {contas.map((acc) => (
                <option key={acc.id} value={acc.description}>
                  {acc.description} - {acc.comments}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Status</FormLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Lancada">Lançada</option>
              <option value="Paga">Paga</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Cancelada">Cancelada</option>
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Comentários</FormLabel>
            <Input
              placeholder="Comentários"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            />
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
            Criar Lançamento
          </Button>
          <Button onClick={handleModalClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CriarLancamentoModal;
