// client/src/App.jsx
import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VideoSearch from './components/videoSearch';
import Login from './components/Signup';
import Signup from './components/Login';


const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <React.Fragment>
      <ApolloProvider client={client}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<VideoSearch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Routes>
        <Outlet />
      </ApolloProvider>
    </React.Fragment>
  );
}

export default App;
