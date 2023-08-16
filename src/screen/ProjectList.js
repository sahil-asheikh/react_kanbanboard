import { API_BASE_URL } from '../config';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';

const ProjectList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const {
    isOpen: isLoadingOpen,
    onOpen: onLoadingOpen,
    onClose: onLoadingClose,
  } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const onCreateClose = () => {
    setTitle('');
    setSummary('');
    onLoadingClose();
    getAllProjects();
    onClose();
  };
  const onCreateOpen = () => {
    setTitle('');
    setSummary('');
    onLoadingClose();
    getAllProjects();
    onOpen();
  };
  // const [allProjects, setAllProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);

  const getAllProjects = async () => {
    onLoadingOpen();
    // setAllProjects([]);
    try {
      // let allTask = await fetch(`https://kanbanboard-apis.up.railway.app/projectsByUserId/${localStorage.getItem('userId')}`);
      // let allProjects = await fetch(`${API_BASE_URL}/projectsByUserId/${localStorage.getItem('userId')}`);
      // allProjects = await allProjects.json();
      // setAllProjects(allProjects);
    } catch (error) {
      console.log(`${error}`);
      alertToast('Operation Failed!', 'error');
    }
    onLoadingClose();
  };

  const getUser = async () => {
    onLoadingOpen();
    setCurrentUser([]);
    try {
      let currentUserData = await fetch(`${API_BASE_URL}/users/${localStorage.getItem('userId')}`);
      currentUserData = await currentUserData.json();
      setCurrentUser(currentUserData);
    } catch (error) {
      console.log(`${error}`);
      alertToast('Operation Failed!', 'error');
    }
    onLoadingClose();
  }
  
  const logout = () => {
    localStorage.clear();
    navigate('/Login');
  };


  const alertToast = (message, alertStatus) =>
    toast({
      title: message,
      status: alertStatus,
      duration: 1500,
      isClosable: true,
    });

    useEffect(()=>{
        getAllProjects();
        getUser();
        // eslint-disable-next-line
    },[])

  return (
    <div>
      <Box mx={100} my={10}>
        <Text
          fontWeight={'400'}
          size={'4xl'}
          color={'#333333'}
          fontSize={'24px'}
        >
          Welcome,
        </Text>
        <Heading fontWeight={'400'} color="#333333" fontSize={'36px'}>
          {currentUser.name}
        </Heading>
        <Divider my={3} />
        <Button
          fontSize={'sm'}
          fontWeight={'normal'}
          size={'sm'}
          colorScheme="facebook"
          mr={3}
          onClick={onCreateOpen}
        >
          Create Project
        </Button>
        <Button
          fontSize={'sm'}
          fontWeight={'normal'}
          size={'sm'}
          // colorScheme="red"
          bg={'red.100'}
          color={'red'}
          mr={3}
          onClick={logout}
        >
          Logout
        </Button>

        <Grid templateColumns="repeat(1, 2fr)" mt={10} gap={10}>
          <GridItem w="100%" borderRadius={'5px'} bg={'#FFFFFF'}>
                <Text size="20px" px={2} py={1} fontWeight={'medium'} bg={'white'}>
                    All Projects {'(10)'}
                </Text>
                <Divider mb={3} />
                <Box p={2}>
                    <ProjectCard />
                    <ProjectCard />
                </Box>
            </GridItem>
        </Grid>

      </Box>

      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        size={'3xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton onClick={onCreateClose} />
          <ModalBody>
            <Heading fontSize={'26px'} fontWeight={'400'} mt={4}>
              Add Your Project
            </Heading>
            <Divider mt={3} />
            {/* <Grid templateColumns="repeat(2, 1fr)" mt={1} gap={10}>
              <GridItem> */}
                <FormControl isRequired>
                  <FormLabel fontSize={'12px'} opacity={'80%'} mt={2}>
                    Title
                  </FormLabel>
                  <Input
                    color={'black'}
                    fontSize={'12px'}
                    size={'sm'}
                    borderRadius={'5px'}
                    placeholder="Enter Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize={'12px'} opacity={'80%'} mt={2}>
                    Summary
                  </FormLabel>
                  <Textarea
                    color={'black'}
                    rows={'10'}
                    fontSize={'12px'}
                    size={'sm'}
                    borderRadius={'5px'}
                    placeholder="Enter Description"
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={'12px'} opacity={'80%'} mt={2}>
                    Note: Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </FormLabel>
                </FormControl>
              {/* </GridItem>
            </Grid> */}
          </ModalBody>

          <ModalFooter textAlign={'right'}>
            <Button
              size={'sm'}
              colorScheme="white"
              color={'black'}
              mr={3}
              fontWeight={'normal'}
              onClick={onCreateClose}
            >
              Close
            </Button>
            <Button
              //   onClick={addProject}
              type="submit"
              size={'sm'}
              px={6}
              fontWeight={'normal'}
              colorScheme="facebook"
              mr={3}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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

export default ProjectList;
