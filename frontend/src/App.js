// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toastify
import SignupPage from './pages/SignupPage';


import TestPage from './pages/Testpage';
import Cameracontroller from './pages/Cameracontroller';
import Questionpage from './pages/QuestionPage';

import LoginPage from './pages/LoginPage';


function App() {
  return (
  
      <Routes>
        <Route path="/"  element={<SignupPage />} />
    <Route path="/login" element={<LoginPage/>} />
        <Route path="/testpage" element={<TestPage/>} />
        <Route path="/camera" element={<Cameracontroller/>}/>
        <Route path="/questionpage" element={<Questionpage/>}/>
      </Routes>
    
  );
}

export default App;

