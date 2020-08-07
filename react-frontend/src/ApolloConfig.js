import { ApolloClient, InMemoryCache } from '@apollo/client';

export default new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
    credentials: 'include'
});