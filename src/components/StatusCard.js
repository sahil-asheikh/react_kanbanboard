import { Box, Center, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import React from 'react';
import TaskCard from './TaskCard';

const StatusCard = ({ taskList, getAllTasks }) => {
  return (
    <div>
      <Box>
        <Box background="#EEEEEE" px={3} borderRadius={3}>
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
              <TaskCard
                key={index}
                id={task.id}
                task={task}
                getAllTasks={getAllTasks}
              />
            ))
          )}
        </Box>
      </Box>
    </div>
  );
};

export default StatusCard;
