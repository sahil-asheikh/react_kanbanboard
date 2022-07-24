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
  Center,
  Stack,
  IconButton,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  EditIcon,
} from '@chakra-ui/icons';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const TaskCard = ({ id, task, getAllTasks }) => {
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
    try {
      onLoadingOpen();
      onDeleteClose();
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
      taskDeletedSuccess();
      onLoadingClose();
      // onDeleteClose();
    } catch (error) {
      console.log(`${error}`);
      taskAlertError();
    }
    getAllTasks();
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
    console.log(taskData);
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
        let taskUpdate = await fetch(
          `https://kanbanapibegawo.herokuapp.com/tasks`,
          {
            method: 'PUT',
            headers: {
              // Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
          }
        );
        taskUpdate = await taskUpdate.json();
        console.log(taskData);
        taskAlertSuccess();
        setTitle(title);
        setSummary(summary);
        setDescription(description);
        setPriority(priority);
        setDeadline(deadline);
        setAssignee(assignee);
        setAddStatus(addStatus);
        onLoadingClose();
        getAllTasks();
      } catch (error) {
        console.log(`${error}`);
        taskAlertError();
      }
      onUpdateClose();
    }
  };

  const storeData = () => {
    onLoadingOpen();
    setTitle(task.title);
    setSummary(task.summary);
    setDescription(task.description);
    setAddStatus('');
    setPriority(task.priority);
    setDeadline(task.deadline);
    setAssignee(task.assigneeId);
    setAddStatus(task.status);
    onLoadingClose();
  };

  useEffect(() => {
    storeData();
  }, []);

  return (
    <div>
      <Center my={3}>
        {/* {storeData} */}
        <Box
          maxW={'330px'}
          w={'full'}
          boxShadow={'2xl'}
          borderRadius={'3px'}
          overflow={'hidden'}
          background={'white'}
        >
          <Stack textAlign={'left'} px={3} align={'left'}>
            <Box mt={1} textAlign={'right'}>
              <IconButton
                aria-label="Search database"
                size={3}
                onClick={onDeleteOpen}
                icon={
                  <DeleteIcon
                    w={'24px'}
                    h={'24px'}
                    p={'5px'}
                    bg={'white'}
                    color={'red.500'}
                  />
                }
              />
              &nbsp;
              <IconButton
                aria-label="Search database"
                size={3}
                onClick={onUpdateOpen}
                icon={
                  <EditIcon
                    w={'24px'}
                    h={'24px'}
                    p={'5px'}
                    bg={'white'}
                    color={'blue.500'}
                  />
                }
              />
            </Box>
            {/* <Divider /> */}
            <Link to={`/Task/${id}`}>
              <Text
                pt={1}
                color="#333333"
                rounded={'full'}
                size={'sm'}
                fontSize={'16px'}
                fontWeight={'medium'}
              >
                {task.title}
              </Text>
              <Text size={'sm'} fontSize="14px">
                {task.summary}
              </Text>
            </Link>
            <Box textAlign={'right'} pb={3}>
              <Text size="sm" fontSize={'12px'}>
                {task.priority === 'P4' || task.priority === 'P3' ? (
                  <span>
                    <ChevronDownIcon w={6} h={6} color="#30AD53" me={1} />
                    Low &nbsp;
                  </span>
                ) : task.priority === 'P2' ? (
                  <span>
                    <ChevronDownIcon w={6} h={6} color="#2A4ECB" me={1} />
                    Medium &nbsp;
                  </span>
                ) : (
                  <span>
                    <ChevronUpIcon w={6} h={6} color="red" me={1} />
                    High &nbsp;
                  </span>
                )}
                <Badge
                  bg={'#EEEEEE'}
                  borderRadius={'7px'}
                  px={2}
                  fontWeight={400}
                >
                  {task.priority}
                </Badge>
              </Text>
            </Box>
          </Stack>
        </Box>
      </Center>
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

export default TaskCard;
