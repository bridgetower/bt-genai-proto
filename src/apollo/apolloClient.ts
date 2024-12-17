// import { ApolloClient, ApolloLink, InMemoryCache, split } from "@apollo/client";
// import { getMainDefinition } from "@apollo/client/utilities";

// import { log } from "console";

// import { httpLink, wsLink } from "./authMiddleware";

// // export const apolloClient = new ApolloClient({
// //   cache: new InMemoryCache(),
// //   link: httpLink
// // });

// // Split link to route queries, mutations, and subscriptions

// const authLink = new ApolloLink((operation, forward) => {
//   // Add the Authorization header with your token
//   operation.setContext(({ headers = {} }) => ({
//     headers: {
//       ...headers,
//       Authorization: process.env.REACT_APP_TANENT_API_KEY || "", // Replace with dynamic token logic if needed
//       identity: localStorage.getItem("idToken") || ""
//     }
//   }));

//   // Ensure forward is called
//   return forward(operation);
// });

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return definition.kind === "OperationDefinition" && definition.operation === "subscription";
//   },
//   wsLink,
//   httpLink
// );
// const link = ApolloLink.from([authLink, splitLink]);
// export const apolloClient = new ApolloClient({
//   link: link,
//   cache: new InMemoryCache()
// });
export const unused = "";
// console.log(a);
