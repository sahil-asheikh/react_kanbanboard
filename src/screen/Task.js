import { API_BASE_URL } from '../config';
import {
  Button,
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
  Textarea,
  useDisclosure,
  useToast,
  Box,
  Text,
  Spinner,
  Center,
  SimpleGrid,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Task = () => {
  const navigate = useNavigate();
  const { taskId } = useParams({});
  const [task, setTask] = useState([]);
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isLoadingOpen,
    onOpen: onLoadingOpen,
    onClose: onLoadingClose,
  } = useDisclosure();
  const [status] = useState(['Not Started', 'On Progress', 'Completed']);
  const [addStatus, setAddStatus] = useState('');
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('');
  const [priorities] = React.useState(['P1', 'P2', 'P3', 'P4']);
  const [assignee, setAssignee] = useState('');
  // const [assignees] = React.useState(['Sahil', 'Kshitij', 'Vaishali']);
  const toast = useToast();

  const alertToast = (message, alertStatus) =>
    toast({
      title: message,
      status: alertStatus,
      duration: 1500,
      isClosable: true,
    });

  const softDeleteTask = async () => {
    onLoadingOpen();
    onDeleteClose();
    try {
      let taskSoftDeleted = await fetch(
        `${API_BASE_URL}/softDelete/${taskId}/`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify(taskData),
        }
      );
      taskSoftDeleted = await taskSoftDeleted.json();
      console.log(taskSoftDeleted);
      alertToast('Task Deleted Successfully', 'error');
      onLoadingClose();
      navigate('/');
    } catch (error) {
      console.log(`${error}`);
      alertToast('Operation Failed!', 'error');
    }
  };

  const updateTask = async () => {
    onLoadingOpen();
    let taskData = {
      id: id,
      taskId: taskId,
      title: title.toString().trim(),
      summary: summary.toString().trim(),
      description: description.toString().trim(),
      priority: priority.toString().trim(),
      status: addStatus.toString().trim(),
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
      deadline.length === 0 ||
      addStatus === '' ||
      !addStatus ||
      addStatus.length === 0
    ) {
      onLoadingClose();
      alertToast('Input fields are empty!', 'warning');
    } else {
      try {
        let taskUpdate = await fetch(`${API_BASE_URL}/tasks`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
        taskUpdate = await taskUpdate.json();
        console.log(taskUpdate);
        alertToast('Task Updated Successfully', 'success');
        setTitle(title);
        setSummary(summary);
        setDescription(description);
        setAddStatus('');
        setPriority(priority);
        setDeadline(deadline);
        setAssignee(assignee);
        setAddStatus(addStatus);
        onLoadingClose();
        onUpdateClose();
        fetchTask();
      } catch (error) {
        console.log(`${error}`);
        alertToast('Operation Failed!', 'error');
      }
    }
  };

  const fetchTask = async () => {
    onLoadingOpen();
    let taskById = await fetch(`${API_BASE_URL}/tasks/${taskId}`);
    taskById = await taskById.json();
    setTask(taskById);
    setId(taskById.id);
    setTitle(taskById.title);
    setSummary(taskById.summary);
    setDescription(taskById.description);
    setPriority(taskById.priority);
    setDeadline(taskById.deadline);
    setAssignee(taskById.assigneeId);
    setAddStatus(taskById.status);
    onLoadingClose();
  };

  useEffect(() => {
    if (
      localStorage.getItem('userId') === '' ||
      localStorage.getItem('userId') === null
    ) {
      console.log('Please login to continue');
      navigate('/Login');
    } else {
      fetchTask();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Box mx={{ base: 1, md: 100, lg: 100, xl: 100 }} my={10}>
        <Heading fontWeight={'400'} color="#333333" fontSize={'36px'}>
          {task.title}
        </Heading>
        <Text
          fontWeight={'400'}
          size={'4xl'}
          color={'#333333'}
          fontSize={'24px'}
        >
          {task.summary}
        </Text>
        <Divider my={3} />
        <Box textAlign={'left'}>
          <Button
            fontSize={'sm'}
            fontWeight={'normal'}
            size={'sm'}
            colorScheme="facebook"
            mr={3}
            onClick={onUpdateOpen}
          >
            Update Task
          </Button>

          <Button
            fontSize={'sm'}
            fontWeight={'normal'}
            size={'sm'}
            colorScheme="red"
            mr={3}
            onClick={onDeleteOpen}
          >
            Delete Task
          </Button>
        </Box>

        <Text
          mt={10}
          mb={3}
          fontWeight={'400'}
          color={'#333333'}
          fontSize={'16px'}
        >
          {task.description}
        </Text>
        <Text fontWeight={'medium'} color={'#333333'} fontSize={'16px'}>
          Priority: &nbsp; {task.priority}
        </Text>
        <Text fontWeight={'medium'} color={'#333333'} fontSize={'16px'}>
          Status: &nbsp; {task.status}
        </Text>
        <Text fontWeight={'medium'} color={'#333333'} fontSize={'16px'}>
          Created On: &nbsp; {task.createdAt}
        </Text>
        <Text fontWeight={'medium'} color={'#333333'} fontSize={'16px'}>
          Deadline: &nbsp; {task.deadline}
        </Text>
      </Box>

      <Modal
        blockScrollOnMount={false}
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        size={'3xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Heading fontSize={'26px'} fontWeight={'400'} mt={4}>
              Update Your Task
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
                    opacity={'80%'}
                    fontSize={'12px'}
                    size={'sm'}
                    borderRadius={'5px'}
                    value={addStatus}
                    onChange={e => setAddStatus(e.target.value)}
                  >
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
              onClick={onUpdateClose}
            >
              Close
            </Button>
            <Button
              onClick={updateTask}
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
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        size={'lg'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Heading fontSize={'20px'} fontWeight={'400'} mt={4}>
              Do you want to delete your task?
            </Heading>
            <Divider mt={3} />
          </ModalBody>
          <ModalFooter textAlign={'right'}>
            <Button
              size={'sm'}
              colorScheme="white"
              color={'black'}
              mr={3}
              fontWeight={'normal'}
              onClick={onDeleteClose}
            >
              Close
            </Button>
            <Button
              onClick={softDeleteTask}
              type="submit"
              size={'sm'}
              px={6}
              fontWeight={'normal'}
              colorScheme="red"
              mr={3}
            >
              Delete
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

export default Task;
