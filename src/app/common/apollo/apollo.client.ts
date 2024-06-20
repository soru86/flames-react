import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: "http://localhost:8000/graphql", //process.env.GRAPHQL_SERVER_LINK,
  cache: new InMemoryCache(),
});
