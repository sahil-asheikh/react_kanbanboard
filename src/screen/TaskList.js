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
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import StatusCard from '../components/StatusCard';

const TaskList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isLoadingOpen,
    onOpen: onLoadingOpen,
    onClose: onLoadingClose,
  } = useDisclosure();
  const [tasks, setAllTasks] = useState([]);
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
  const [assignee, setAssignee] = useState('');
  const [assignees] = React.useState(['Sahil', 'Kshitij', 'Vaishali']);
  let checkLoad = false;
  const toast = useToast();

  const getAllTasks = async () => {
    onLoadingOpen();
    setAllTasks([]);
    setTaskNotStarted([]);
    setTaskOnProgress([]);
    setTaskCompleted([]);
    try {
      let allTask = await fetch('https://kanbanapibegawo.herokuapp.com/tasks');
      allTask = await allTask.json();
      setAllTasks(allTask);
      if (!checkLoad) {
        for (let i in allTask) {
          if (allTask[i].status == 'Not Started') {
            setTaskNotStarted(prevTask => [...prevTask, allTask[i]]);
          } else if (allTask[i].status == 'On Progress') {
            setTaskOnProgress(prevTask => [...prevTask, allTask[i]]);
          } else if (allTask[i].status == 'Completed') {
            setTaskCompleted(prevTask => [...prevTask, allTask[i]]);
          }
        }
      }
      checkLoad = true;
    } catch (error) {
      console.log(`${error}`);
      taskAlertError();
    }
    onLoadingClose();
  };

  const taskAlertSuccess = () =>
    toast({
      title: 'Task Added Successfully',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  const taskAlertError = () =>
    toast({
      title: 'Operation Failed!',
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
  const taskAlertEmpty = () =>
    toast({
      title: 'Input fields are empty!',
      status: 'warning',
      duration: 2000,
      isClosable: true,
    });

  const addTask = async () => {
    onLoadingOpen();
    let taskData = {
      title: title,
      summary: summary,
      description: description,
      priority: priority,
      status: 'Not Started',
      deadline: deadline,
      assigneeId: 'Sahil',
      assigneeById: 'Sahil',
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
      taskAlertEmpty();
    } else {
      try {
        let taskAdded = await fetch('https://kanbanapibegawo.herokuapp.com/tasks', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
        taskAdded = await taskAdded.json();
        taskAlertSuccess();
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
        taskAlertError();
      }
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  return (
    <div>
      <Box mx={100} my={10}>
        <Heading fontWeight={'400'} color="#333333" fontSize={'36px'}>
          Kanban Board
        </Heading>
        <Text
          fontWeight={'400'}
          size={'4xl'}
          color={'#333333'}
          fontSize={'24px'}
        >
          Buzz Sahil's Task
        </Text>
        <Divider my={3} />
        <Button
          fontSize={'sm'}
          fontWeight={'normal'}
          size={'sm'}
          colorScheme="facebook"
          mr={3}
          onClick={onOpen}
        >
          Create Task
        </Button>

        <Grid templateColumns="repeat(4, 2fr)" mt={10} gap={10}>
          <GridItem w="100%" borderRadius={'5px'} bg={'#EEEEEE'}>
            <Text size="20px" px={2} py={1} fontWeight={'medium'} bg={'white'}>
              {status[0]} {'(' + tasksNotStarted.length + ')'}
            </Text>
            <Box bg={'#EEEEEE'}>
              <StatusCard
                taskList={tasksNotStarted}
                getAllTasks={getAllTasks}
              />
            </Box>
          </GridItem>
          <GridItem w="100%" borderRadius={'5px'} bg={'#EEEEEE'}>
            <Text size="20px" px={2} py={1} fontWeight={'medium'} bg={'white'}>
              {status[1]} {'(' + tasksOnProgress.length + ')'}
            </Text>
            <Box bg={'#EEEEEE'}>
              <StatusCard
                taskList={tasksOnProgress}
                getAllTasks={getAllTasks}
              />
            </Box>
          </GridItem>
          <GridItem w="100%" borderRadius={'5px'} bg={'#EEEEEE'}>
            <Text size="20px" px={2} py={1} fontWeight={'medium'} bg={'white'}>
              {status[2]} {'(' + tasksCompleted.length + ')'}
            </Text>
            <Box bg={'#EEEEEE'}>
              <StatusCard taskList={tasksCompleted} getAllTasks={getAllTasks} />
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
          {/* <ModalHeader>Add your new Task</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <Heading fontSize={'26px'} fontWeight={'400'} mt={4}>
              Add Your Task
            </Heading>
            <Divider mt={3} />
            <Grid templateColumns="repeat(2, 1fr)" mt={1} gap={10}>
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
                {/* <FormControl>
                  <FormLabel fontSize={'12px'} opacity={'80%'} mt={2}>
                    Assigne To
                  </FormLabel>
                  <Select
                    opacity={'80%'}
                    fontSize={'12px'}
                    size={'sm'}
                    borderRadius={'5px'}
                    value={assignee}
                    onChange={e => setAssignee(e.target.value)}
                  >
                    <option
                      fontSize={'12px'}
                      color={'black'}
                      selected
                      value={''}
                    >
                      Select the Assignee
                    </option>
                    {assignees.map(assigneeItem => (
                      <option
                        color={'black'}
                        fontSize={'12px'}
                        bg={'white'}
                        key={assigneeItem}
                        value={assigneeItem}
                      >
                        {assigneeItem}
                      </option>
                    ))}
                  </Select>
                </FormControl> */}
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
            </Grid>
          </ModalBody>

          <ModalFooter textAlign={'right'}>
            <Button
              size={'sm'}
              colorScheme="white"
              color={'black'}
              mr={3}
              fontWeight={'normal'}
              onClick={onClose}
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
