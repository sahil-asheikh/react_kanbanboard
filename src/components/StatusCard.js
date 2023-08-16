import { API_BASE_URL } from '../config';
import {
  Box,
  Center,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRef } from 'react';
import TaskCard from './TaskCard';

const StatusCard = ({ taskList, getAllTasks, taskStat }) => {
  const toast = useToast();
  const dragItem = useRef();
  const dragOverItem = useRef();
  let changeTo = '';
  const {
    isOpen: isLoadingOpen,
    onOpen: onLoadingOpen,
    onClose: onLoadingClose,
  } = useDisclosure();

  const changeStatus = async () => {
    const currentTaskId = localStorage.getItem('currentDragTaskId');
    console.log(currentTaskId + '::' + changeTo, 'success');
    onLoadingOpen();
    try {
      let taskUpdate = await fetch(
        `${API_BASE_URL}/changeStatus?taskId=${currentTaskId}&status=${changeTo}`,
        {
          method: 'PUT',
        }
      );
      taskUpdate = await taskUpdate.json();
      console.log(taskUpdate);
      alertToast('Moved to ' + changeTo, 'success');
      onLoadingClose();
      getAllTasks();
    } catch (error) {
      console.log(`${error}`);
      alertToast('Operation Failed!', 'error');
      onLoadingClose();
    }
  };

  const alertToast = (message, alertStatus) =>
    toast({
      title: message,
      status: alertStatus,
      duration: 1500,
      isClosable: true,
    });

  const onDragOver = e => {
    e.preventDefault();
    // alertToast('DONE', 'success');
  };

  const onDragStart = (e, dragTaskId) => {
    localStorage.setItem('currentDragTaskId', dragTaskId);
    dragItem.current = dragTaskId;
  };

  const onDragEnter = (e, dragTaskId) => {
    dragOverItem.current = dragTaskId;
  };

  const onDrop = (e, moveTo) => {
    changeTo = moveTo;
    changeStatus();
  };

  return (
    <div>
      <Box>
        <div onDragOver={e => onDragOver(e)} onDrop={e => onDrop(e, taskStat)}>
          <Box
            background="#EEEEEE"
            px={3}
            borderRadius={3}
            minH={{ base: '', md: '100vh', lg: '100vh', xl: '100vh' }}
            py={1}
          >
            {taskList.length <= 0 ? (
              <Center bg={'white'} my={3} borderRadius={'5px'}>
                <Text
                  p={3}
                  color="#333333"
                  rounded={'full'}
                  size={'lg'}
                  fontWeight={'medium'}
                >
                  No task to show...
                </Text>
              </Center>
            ) : (
              taskList.map((task, index) => (
                <div
                  key={index}
                  onDragStart={e => onDragStart(e, task.taskId)}
                  onDragEnter={e => onDragEnter(e, task.taskId)}
                  draggable
                >
                  <TaskCard
                    taskId={task.taskId}
                    task={task}
                    getAllTasks={getAllTasks}
                  />
                </div>
              ))
            )}
          </Box>
        </div>
      </Box>
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

export default StatusCard;
