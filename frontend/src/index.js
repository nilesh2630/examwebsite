import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer

import App from './App';
import Testprovider from './context/Testprovider';
import {BrowserRouter as Router} from 'react-router-dom'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <Router>
  <Testprovider>
    <App />
    </Testprovider>
    <ToastContainer />

    </Router>
  </React.StrictMode>
);


