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
} from '@chakra-ui/react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassowrd] = useState('');
  const [userId, setUserId] = useState('');
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
    if (
      username.trim() === '' ||
      username.trim().length === 0 ||
      password.trim() === '' ||
      password.trim().length === 0
    ) {
      loginAlertEmpty();
    } else {
      try {
        let taskById = await fetch(`https://kanbanapibegawo.herokuapp.com/login?username=${username}&password=${password}`);
        // let taskById = await fetch(`http://localhost:7000/login?username=${username}&password=${password}`);
        taskById = await taskById.json();

        if (taskById.outputCode === 'Loged in succesfully') {
          loginAlertSuccess();
          localStorage.setItem('userId', taskById.userId);
          console.log(localStorage.getItem('userId'));
          navigate('/');
        } else if (taskById.outputCode === 'User not found') {
          loginIncorrectUsername();
        } else if (taskById.outputCode === 'Incorrect password') {
          loginIncorrectPassword();
        } else {
          loginAlertError();
        }
      } catch (error) {
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
  }, []);

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
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
        <Avatar bg="gray.500" />
        <Heading my={3} size={'lg'} fontWeight={'semibold'} color="black">
          Login to Continue
        </Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <Center>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              borderRadius={'5px'}
              width="90%"
              boxShadow="md"
            >
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
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                onClick={login}
                borderRadius={'5px'}
                variant="solid"
                colorScheme="facebook"
                width="full"
              >
                Login
              </Button>
            </Stack>
          </Center>
        </Box>
      </Stack>
      <Box>
        New to us?{' '}
        <Link fontWeight={'semibold'} color="blue.600" href="/Signup">
          Sign Up
        </Link>
      </Box>
    </Flex>
  );
};

export default Login;
