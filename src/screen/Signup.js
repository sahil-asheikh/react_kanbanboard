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
  FormHelperText,
  InputRightElement,
  Center,
  useToast,
} from '@chakra-ui/react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Signup = () => {
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
  const signupAlertEmpty = () =>
    toast({
      title: 'Input fields are empty!',
      status: 'warning',
      duration: 2000,
      isClosable: true,
    });

  const signup = async () => {
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
      signupAlertEmpty();
    } else {
      try {
        let userAdded = await fetch('https://kanbanapibegawo.herokuapp.com/register',
        // let userAdded = await fetch('http://localhost:7000/register',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          }
        );
        userAdded = await userAdded.json();
        signupAlertSuccess();
        navigate('/Login');
      } catch (error) {
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
          Register to Continue
        </Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <Center>
            <Stack
              borderRadius={'5px'}
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
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
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                onClick={signup}
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
        <Link fontWeight={'semibold'} color="blue.600" href="/Login">
          Login
        </Link>
      </Box>
    </Flex>
  );
};

export default Signup;
