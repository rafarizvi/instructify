import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Home from './pages/Home';
import VideoSearch from './components/videoSearch';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import Tutorial from './components/Tutorial';
// import All from './pages/All';
import TutorialCategories from './pages/TutorialCategories';
import ViewTutorial from './pages/ViewTutorial';

import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


//importing from pages index.js
import { 
  Home, 
  Dashboard,
  SingleTutorial,
  All } from './pages';

//importing from components index.js
import { 
  VideoSearch, 
  Login, Signup, 
  Tutorial } from './components';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index : true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path:'signup', element: <Signup /> },
      { path: 'videosearch', element: <VideoSearch /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'tutorial', element: <Tutorial /> },
      { path: 'categories', element: <TutorialCategories /> },
      { path: '/categories/view-tutorial', element: <ViewTutorial /> }

      { path: 'tutorial/:id', element: <SingleTutorial /> },
      { path: 'all', element: <All /> }    
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
