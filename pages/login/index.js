import { api } from '@/conexao/axios'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react'
import { useState } from 'react';
import Cookies from 'js-cookie';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembreMe, setLembreMe] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleLogin = async () => {
    try {
      limparMensagens();
      const resposta = await api.post('login', { email, pwd: senha });

      if (resposta.status === 200) {
        const { token } = resposta.data;
        Cookies.set('userToken', token, { expires: 1 });

        setSucesso('Login bem-sucedido');
        console.log('Login bem-sucedido');

        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setErro(resposta.data.message);
        console.error('Erro no login:', resposta.data.message);
      }
    } catch (error) {
      setErro(error.response.data.message);
      console.error('Erro ao fazer a requisição:', error.response.data.message);
    }
  };


  const limparMensagens = () => {
    setErro('');
    setSucesso('');
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Faça login em sua conta</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Senha</FormLabel>
              <Input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </FormControl>
            {erro && (
              <Text color="red.500" fontSize="sm">
                {erro}
              </Text>
            )}
            {sucesso && (
              <Text color="green.500" fontSize="sm">
                {sucesso}
              </Text>
            )}
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox isChecked={lembreMe} onChange={(e) => setLembreMe(e.target.checked)}>Lembre me</Checkbox>
                <Link href='criarconta' color={'blue.400'}>Não tem uma conta ainda?</Link>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleLogin}>
                Entrar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
