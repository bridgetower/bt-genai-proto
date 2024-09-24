import { ApolloClient, InMemoryCache } from "@apollo/client";

import { AuthMiddleware } from "./authMiddleware";

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: AuthMiddleware
});
