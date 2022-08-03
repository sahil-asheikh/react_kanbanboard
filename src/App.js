import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskList from './screen/TaskList';
import Task from './screen/Task';
import Login from './screen/Login';
import Signup from './screen/Signup';
import ProjectList from './screen/ProjectList';
import Project from './screen/Project';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/" element={<TaskList />} />
          <Route path="/Task/:taskId" element={<Task />} />
          <Route path="/ProjectList" element={<ProjectList />} />
          <Route path="/Project/:projectId" element={<Project />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
