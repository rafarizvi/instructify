// client/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Home from './pages/Home';
import VideoSearch from './components/videoSearch';
import Login from './components/Login';
import Signup from './components/Signup';
// import Dashboard from './components/Dashboard';
import Tutorial from './components/Tutorial';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index : true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path:'signup', element: <Signup /> },
      // { path: 'dashboard', element: <Dashboard /> },
      { path: 'tutorial', element: <Tutorial /> },
      { path: 'videosearch', element: <VideoSearch /> }
      
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
