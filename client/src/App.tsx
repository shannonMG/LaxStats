import './App.css';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

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

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen flex flex-col">
        <Header />

        {/* Main content area */}
         <main>
          {/* Any child routes will render here */}
          <Outlet />
        </main>

        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
