// client/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Home from './pages/Home';
import VideoSearch from './components/videoSearch';
import Login from './components/Signup';
import Signup from './components/Login';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/search', element: <VideoSearch /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
    ],
  },
]);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
