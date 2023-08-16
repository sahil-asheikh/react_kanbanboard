import { API_BASE_URL } from '../config';
import { useEffect, useState } from 'react';
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  InputRightElement,
  Center,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  Spinner,
} from '@chakra-ui/react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const {
    isOpen: isLoadingOpen,
    onOpen: onLoadingOpen,
    onClose: onLoadingClose,
  } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassowrd] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const loginAlertSuccess = () =>
    toast({
      title: 'Login Successfully',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  const loginAlertError = () =>
    toast({
      title: 'Operation Failed!',
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
  const loginAlertEmpty = () =>
    toast({
      title: 'Input fields are empty!',
      status: 'warning',
      duration: 2000,
      isClosable: true,
    });
  const alertPasswordLength = () =>
    toast({
      title: 'Password length must be more than 6 characters',
      status: 'warning',
      duration: 2000,
      isClosable: true,
    });
  const alertInvalidUsername = () =>
    toast({
      title: 'Invalid Username',
      status: 'warning',
      duration: 2000,
      isClosable: true,
    });
  const loginIncorrectUsername = () =>
    toast({
      title: 'User not found',
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
  const loginIncorrectPassword = () =>
    toast({
      title: 'Incorrect Password',
      status: 'error',
      duration: 2000,
      isClosable: true,
    });

  const login = async () => {
    onLoadingOpen();
    if (
      username.trim() === '' ||
      username.trim().length === 0 ||
      password.trim() === '' ||
      password.trim().length === 0
    ) {
      onLoadingClose();
      loginAlertEmpty();
    } else if (!username.match('@')) {
      onLoadingClose();
      alertInvalidUsername();
    } else if (password.length < 6) {
      onLoadingClose();
      alertPasswordLength();
    } else {
      try {
        let taskById = await fetch(
          `${API_BASE_URL}/login?username=${username
            .toString()
            .trim()}&password=${password.toString().trim()}`
        );
        taskById = await taskById.json();

        if (taskById.outputCode === 'Loged in succesfully') {
          loginAlertSuccess();
          localStorage.setItem('userId', taskById.userId);
          navigate('/');
        } else if (taskById.outputCode === 'User not found') {
          loginIncorrectUsername();
        } else if (taskById.outputCode === 'Incorrect password') {
          loginIncorrectPassword();
        } else {
          loginAlertError();
        }
        onLoadingClose();
      } catch (error) {
        onLoadingClose();
        console.log(`${error}`);
        loginAlertError();
      }
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem('userId') === '' ||
      localStorage.getItem('userId') === null
    ) {
      console.log('Please login to continue');
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <div>
      <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        backgroundColor="gray.200"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          // alignItems="center"
        >
          <Box minW={{ base: '90%', md: '468px' }}>
            <Center>
              <Stack
                spacing={4}
                p="1rem"
                py={10}
                backgroundColor="whiteAlpha.900"
                borderRadius={'5px'}
                width="350px"
                boxShadow="md"
                textAlign={'center'}
              >
                <Avatar bg="gray.500" mx={'auto'} />
                <Heading
                  my={1}
                  size={'sm'}
                  fontWeight={'semibold'}
                  color="black"
                >
                  LOGIN
                </Heading>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      type="email"
                      required
                      placeholder="email address"
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<CFaLock color="gray.300" />}
                    />
                    <Input
                      value={password}
                      onChange={e => setPassowrd(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        bg={'white'}
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowClick}
                      >
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Button
                  size={'sm'}
                  onClick={login}
                  borderRadius={'5px'}
                  variant="solid"
                  colorScheme="facebook"
                  width="full"
                >
                  Login
                </Button>
                <Box>
                  New to us?{' '}
                  <Link fontWeight={'semibold'} color="blue.600" href="/Signup">
                    Sign Up
                  </Link>
                </Box>
              </Stack>
            </Center>
          </Box>
        </Stack>
      </Flex>
      <Modal
        isCentered
        blockScrollOnMount={false}
        isOpen={isLoadingOpen}
        onClose={onLoadingClose}
        size={'3xl'}
      >
        <ModalOverlay />
        <ModalContent shadow={'none'} bg={'transparent'}>
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Login;
