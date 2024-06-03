import './App.css';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Importing the universe search from components
import { SearchProvider } from './components/search/SearchContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary'; // Ensure ErrorBoundary is imported

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Adding the universal search to wrap the entire webpage so the user can use it anywhere!
function App() {
  return (
    <ApolloProvider client={client}>
      <SearchProvider>
        <ErrorBoundary>
          <Navbar />
          <Outlet />
          <ToastContainer position="top-center" autoClose={1200} />
        </ErrorBoundary>
      </SearchProvider>
    </ApolloProvider>
  );
}

export default App;
