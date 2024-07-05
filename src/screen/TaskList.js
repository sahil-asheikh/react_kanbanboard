import { API_BASE_URL } from '../config';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import StatusCard from '../components/StatusCard';
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isLoadingOpen,
    onOpen: onLoadingOpen,
    onClose: onLoadingClose,
  } = useDisclosure();
  const [tasksNotStarted, setTaskNotStarted] = useState([]);
  const [tasksOnProgress, setTaskOnProgress] = useState([]);
  const [tasksCompleted, setTaskCompleted] = useState([]);
  const [status] = useState(['Not Started', 'On Progress', 'Completed']);
  const [addStatus, setAddStatus] = useState([]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('');
  const [priorities] = React.useState(['P1', 'P2', 'P3', 'P4']);
  let checkLoad = false;
  const toast = useToast();
  const navigate = useNavigate();
  const onCreateClose = () => {
    setTitle('');
    setSummary('');
    setDescription('');
    setPriority('');
    setDeadline('');
    onLoadingClose();
    getAllTasks();
    onClose();
  };
  const onCreateOpen = () => {
    setTitle('');
    setSummary('');
    setDescription('');
    setPriority('');
    setDeadline('');
    onLoadingClose();
    getAllTasks();
    onOpen();
  };

  const getAllTasks = async () => {
    onLoadingOpen();
    setTaskNotStarted([]);
    setTaskOnProgress([]);
    setTaskCompleted([]);
    try {
      let allTask = await fetch(
        `${API_BASE_URL}/tasksByUserId/${localStorage.getItem('userId')}`
      );
      allTask = await allTask.json();
      if (!checkLoad) {
        for (let i in allTask) {
          if (allTask[i].status === 'Not Started') {
            setTaskNotStarted(prevTask => [...prevTask, allTask[i]]);
          } else if (allTask[i].status === 'On Progress') {
            setTaskOnProgress(prevTask => [...prevTask, allTask[i]]);
          } else if (allTask[i].status === 'Completed') {
            setTaskCompleted(prevTask => [...prevTask, allTask[i]]);
          }
        }
      }
      checkLoad = true;
    } catch (error) {
      console.log(`${error}`);
      alertToast('Operation Failed!', 'error');
    }
    onLoadingClose();
  };

  const alertToast = (message, alertStatus) =>
    toast({
      title: message,
      status: alertStatus,
      duration: 1500,
      isClosable: true,
    });

  const addTask = async () => {
    onLoadingOpen();
    let taskData = {
      title: title.toString().trim(),
      summary: summary.toString().trim(),
      description: description.toString().trim(),
      priority: priority.toString().trim(),
      status: 'Not Started',
      deadline: deadline.toString().trim(),
      assigneeId: 'Sahil',
      assigneeById: localStorage.getItem('userId').toString().trim(),
      projectId: 'sahilmustchange',
    };
    if (
      title === '' ||
      !title ||
      title.length === 0 ||
      summary === '' ||
      !summary ||
      summary.length === 0 ||
      description === '' ||
      !description ||
      description.length === 0 ||
      priority === '' ||
      !priority ||
      priority.length === 0 ||
      deadline === '' ||
      !deadline ||
      deadline.length === 0
    ) {
      onLoadingClose();
      alertToast('Please fill the empty inputs', 'warning');
    } else {
      try {
        let taskAdded = await fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
        taskAdded = await taskAdded.json();
        console.log(taskAdded);
        alertToast('Task Added Successfully', 'success');
        setTitle('');
        setSummary('');
        setDescription('');
        setPriority('');
        setDeadline('');
        onLoadingClose();
        getAllTasks();
        onClose();
      } catch (error) {
        console.log(`${error}`);
        alertToast('Operation Failed!', 'error');
      }
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/Login');
  };

  useEffect(() => {
    if (
      localStorage.getItem('userId') === '' ||
      localStorage.getItem('userId') === null
    ) {
      console.log('Please login to continue');
      navigate('/Login');
    } else {
      getAllTasks();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Box mx={{ base: 1, md: 100, lg: 100, xl: 100 }} my={10}>
        <Heading fontWeight={'400'} color="#333333" fontSize={'36px'}>
          Kanban Board
        </Heading>
        {/* <Text
          fontWeight={'400'}
          size={'4xl'}
          color={'#333333'}
          fontSize={'24px'}
        >
          Developed by{' '}
          <a
            style={{ color: '#385898', fontWeight: '500' }}
            target={'_blank'}
            rel="noreferrer"
            href="https://www.linkedin.com/in/sahilsheikh-dev/"
          >
            Sahil Sheikh
          </a>
        </Text> */}
        <Divider my={3} />
        <Button
          fontSize={'sm'}
          fontWeight={'normal'}
          size={'sm'}
          colorScheme="facebook"
          mr={3}
          onClick={onCreateOpen}
        >
          Create Task
        </Button>
        <Button
          fontSize={'sm'}
          fontWeight={'normal'}
          size={'sm'}
          bg={'red.100'}
          color={'red'}
          mr={3}
          onClick={logout}
        >
          Logout
        </Button>

        <SimpleGrid columns={[1, 3, 3, 3]} mt={10} gap={10}>
          <GridItem w="100%" borderRadius={'5px'}>
            <Text size="20px" px={2} py={1} fontWeight={'medium'} bg={'white'}>
              {status[0]} {'(' + tasksNotStarted.length + ')'}
            </Text>
            <Box bg={'#EEEEEE'}>
              <StatusCard
                taskStat={status[0]}
                taskList={tasksNotStarted}
                getAllTasks={getAllTasks}
              />
            </Box>
          </GridItem>
          <GridItem w="100%" borderRadius={'5px'}>
            <Text size="20px" px={2} py={1} fontWeight={'medium'} bg={'white'}>
              {status[1]} {'(' + tasksOnProgress.length + ')'}
            </Text>
            <Box bg={'#EEEEEE'}>
              <StatusCard
                taskStat={status[1]}
                taskList={tasksOnProgress}
                getAllTasks={getAllTasks}
              />
            </Box>
          </GridItem>
          <GridItem w="100%" borderRadius={'5px'}>
            <Text size="20px" px={2} py={1} fontWeight={'medium'} bg={'white'}>
              {status[2]} {'(' + tasksCompleted.length + ')'}
            </Text>
            <Box bg={'#EEEEEE'}>
              <StatusCard
                taskStat={status[2]}
                taskList={tasksCompleted}
                getAllTasks={getAllTasks}
              />
            </Box>
          </GridItem>
        </SimpleGrid>
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
              Add Your Task
            </Heading>
            <Divider mt={3} />
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 2, xl: 2 }}
              mt={1}
              gap={10}
            >
              <GridItem>
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
                  <Input
                    color={'black'}
                    fontSize={'12px'}
                    size={'sm'}
                    borderRadius={'5px'}
                    placeholder="Enter Summary"
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize={'12px'} opacity={'80%'} mt={2}>
                    Description
                  </FormLabel>
                  <Textarea
                    color={'black'}
                    rows={'10'}
                    fontSize={'12px'}
                    size={'sm'}
                    borderRadius={'5px'}
                    placeholder="Enter Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontSize={'12px'} opacity={'80%'} mt={2}>
                    Status
                  </FormLabel>
                  <Select
                    disabled
                    opacity={'80%'}
                    fontSize={'12px'}
                    size={'sm'}
                    borderRadius={'5px'}
                    value={addStatus}
                    onChange={e => setAddStatus(e.target.value)}
                  >
                    <option fontSize={'12px'} color={'black'} selected>
                      Blocked
                    </option>
                    {status.map(statusItem => (
                      <option
                        color={'black'}
                        fontSize={'12px'}
                        bg={'white'}
                        key={statusItem}
                        value={statusItem}
                      >
                        {statusItem}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={'12px'} opacity={'80%'} mt={2}>
                    Priority
                  </FormLabel>
                  <Select
                    opacity={'80%'}
                    fontSize={'12px'}
                    size={'sm'}
                    borderRadius={'5px'}
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                  >
                    <option
                      fontSize={'12px'}
                      color={'black'}
                      selected
                      value={''}
                    >
                      Select the Priority
                    </option>
                    {priorities.map(priorityItem => (
                      <option
                        color={'black'}
                        fontSize={'12px'}
                        bg={'white'}
                        key={priorityItem}
                        value={priorityItem}
                      >
                        {priorityItem}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize={'12px'} opacity={'80%'} mt={2}>
                    Deadline
                  </FormLabel>
                  <Input
                    color={'black'}
                    fontSize={'12px'}
                    size={'sm'}
                    borderRadius={'5px'}
                    type="date"
                    placeholder="Enter Title"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={'12px'} opacity={'80%'} mt={2}>
                    Note: Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </FormLabel>
                </FormControl>
              </GridItem>
            </SimpleGrid>
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
              onClick={addTask}
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

export default TaskList;
