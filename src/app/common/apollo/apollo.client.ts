import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_SERVER_LINK,
  cache: new InMemoryCache(),
});
