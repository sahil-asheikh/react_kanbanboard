import {
  Button,
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
  Select,
  Textarea,
  useDisclosure,
  useToast,
  Box,
  Text,
  Link,
  Spinner,
  Center,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Task = () => {
  const navigate = useNavigate();
  const { id } = useParams({});
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
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('');
  const [priorities] = React.useState(['P1', 'P2', 'P3', 'P4']);
  const [assignee, setAssignee] = useState('');
  const [assignees] = React.useState(['Sahil', 'Kshitij', 'Vaishali']);
  const toast = useToast();

  const taskDeletedSuccess = () =>
    toast({
      title: 'Task Deleted Successfully',
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
  const taskAlertSuccess = () =>
    toast({
      title: 'Task Updated Successfully',
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

  const softDeleteTask = async () => {
    onLoadingOpen();
    onDeleteClose();
    try {
      let taskSoftDeleted = await fetch(
        `https://kanbanapibegawo.herokuapp.com/softDelete/${id}/`,
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
      taskDeletedSuccess();
      onLoadingClose();
      navigate('/');
    } catch (error) {
      console.log(`${error}`);
      taskAlertError();
    }
  };

  const updateTask = async () => {
    onLoadingOpen();
    let taskData = {
      id: id,
      title: title,
      summary: summary,
      description: description,
      priority: priority,
      status: addStatus,
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
      deadline.length === 0 ||
      addStatus === '' ||
      !addStatus ||
      addStatus.length === 0
    ) {
      onLoadingClose();
      taskAlertEmpty();
    } else {
      try {
        let taskUpdate = await fetch(`https://kanbanapibegawo.herokuapp.com/tasks`, {
          method: 'PUT',
          headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
        taskUpdate = await taskUpdate.json();
        taskAlertSuccess();
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
        taskAlertError();
      }
    }
  };

  const fetchTask = async () => {
    onLoadingOpen();
    let taskById = await fetch(`https://kanbanapibegawo.herokuapp.com/tasks/${id}`);
    taskById = await taskById.json();
    setTask(taskById);

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
    fetchTask();
  }, []);

  return (
    <div>
      <Box mx={100} my={10}>
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

        <Grid templateColumns="repeat(2, 1fr)" mt={10} gap={10}>
          <GridItem width={'750px'}>
            <Text fontWeight={'400'} color={'#333333'} fontSize={'16px'}>
              {task.description}
            </Text>
          </GridItem>
          {/* <Center maxWidth={'20px'}>
            <Divider mx={1} orientation="vertical" />
          </Center> */}
          <GridItem p={4} bg={'#EEEEEE'} borderRadius={'5px'}>
            <Text fontWeight={'medium'} color={'#333333'} fontSize={'16px'}>
              Priority: &nbsp; {task.priority}
            </Text>
            <Text fontWeight={'medium'} color={'#333333'} fontSize={'16px'}>
              Status: &nbsp; {task.status}
            </Text>
            {/* <Text fontWeight={'medium'} color={'#333333'} fontSize={'16px'}>
              Assigned By: &nbsp; {task.assignedById}
            </Text>
            <Text fontWeight={'medium'} color={'#333333'} fontSize={'16px'}>
              Assignee: &nbsp; {task.assigneeId}
            </Text> */}
            <Text fontWeight={'medium'} color={'#333333'} fontSize={'16px'}>
              Created On: &nbsp; {task.createdAt}
            </Text>
            <Text fontWeight={'medium'} color={'#333333'} fontSize={'16px'}>
              Deadline: &nbsp; {task.deadline}
            </Text>
          </GridItem>
        </Grid>
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
