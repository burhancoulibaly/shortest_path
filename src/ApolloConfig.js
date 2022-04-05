import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
console.log(process.env.IS_HEROKU)
const url = process.env.IS_HEROKU && process.env.IS_HEROKU === 'TRUE' ? "https://shortestpathbackend.herokuapp.com/" : "http://localhost:3000/";

const httpLink = createHttpLink({ 
  uri:  url + 'graphql',
  credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = localStorage.getItem('accessToken');

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    }
  }
});

export default new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        addTypename: false
    })
});