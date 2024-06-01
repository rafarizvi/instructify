import './App.css';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//importing the universe search from components
import { SearchProvider } from './components/search/SearchContext';
import Navbar from './components/Navbar';

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

/* import Footer from './components/Footer' */

// adding the universal search to wrap the entire webpage so the user can use it anywhere!
function App() {
  return (
    <ApolloProvider client={client}>
      <SearchProvider>
        <Navbar />
        <Outlet />
        <ToastContainer position="top-center" autoClose={1200} />
      </SearchProvider>
    </ApolloProvider>
  );
}

/* removed <Footer /> from under <Outlet /> above for now, as we have an empty footer */

export default App;

