import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskList from './screen/TaskList';
import Task from './screen/Task';
import Login from './screen/Login';
import Signup from './screen/Signup';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/" element={<TaskList />} />
          <Route path="/Task/:id" element={<Task />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
