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
  Spinner,
  ModalContent,
} from '@chakra-ui/react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Signup = () => {
  const {
    isOpen: isLoadingOpen,
    onOpen: onLoadingOpen,
    onClose: onLoadingClose,
  } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const signupAlertSuccess = () =>
    toast({
      title: 'Registration Successful Please Login to continue',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  const signupAlertError = () =>
    toast({
      title: 'Operation Failed!',
      status: 'error',
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
  const alertUsernameAvailable = () =>
    toast({
      title: 'Username is already available',
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
  const signupAlertEmpty = () =>
    toast({
      title: 'Input fields are empty!',
      status: 'warning',
      duration: 2000,
      isClosable: true,
    });

  const signup = async () => {
    onLoadingOpen();
    const userData = {
      name: name,
      username: username,
      password: password,
    };
    if (
      name.trim() === '' ||
      name.trim().length === 0 ||
      username.trim() === '' ||
      username.trim().length === 0 ||
      password.trim() === '' ||
      password.trim().length === 0
    ) {
      onLoadingClose();
      signupAlertEmpty();
    } else if (password.length < 6) {
      onLoadingClose();
      alertPasswordLength();
    } else if (!username.match('@')) {
      onLoadingClose();
      alertInvalidUsername();
    } else {
      try {
        let userAdded = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        userAdded = await userAdded.json();

        if (userAdded.outputCode === 'User already Available') {
          onLoadingClose();
          alertUsernameAvailable();
        } else {
          onLoadingClose();
          signupAlertSuccess();
          navigate('/Login');
        }
      } catch (error) {
        onLoadingClose();
        console.log(`${error}`);
        signupAlertError();
      }
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem('userId') === '' ||
      localStorage.getItem('userId') === null
    ) {
      console.log('Please register to continue');
    } else {
      navigate('/');
    }
    // eslint-disable-next-line
  }, []);

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
          alignItems="center"
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
                  REGISTER
                </Heading>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      type="text"
                      placeholder="name"
                    />
                  </InputGroup>
                </FormControl>
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
                      onChange={e => setPassword(e.target.value)}
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
                  onClick={signup}
                  borderRadius={'5px'}
                  variant="solid"
                  colorScheme="facebook"
                  width="full"
                >
                  Signup
                </Button>
                <Box>
                  Already had an account?{' '}
                  <Link fontWeight={'semibold'} color="blue.600" href="/Login">
                    Login
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

export default Signup;
