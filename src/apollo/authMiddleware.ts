import { ApolloClient, from, HttpLink, InMemoryCache, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { getLogoutFunction } from "@/providers/CoginitoAuthProvider";

const url1 = "https://qckclllnjvaozmbbseatqsy3ye.appsync-api.us-east-1.amazonaws.com/graphql";
const url2 = "https://g2n4ivs5jbcirgsy5kkal7puea.appsync-api.us-east-1.amazonaws.com/graphql";
export const httpLinks = new HttpLink({
  uri: url1,
  headers: {
    Authorization: process.env.REACT_APP_TANENT_API_KEY || ""
  }
});

// const region = "us-east-1";

// // Lambda authorization
// const auth = {
//   type: "AWS_LAMBDA" as AUTH_TYPE.AWS_LAMBDA,
//   token: process.env.REACT_APP_TANENT_API_KEY || ""
//   // identity: localStorage.getItem("idToken") || ""
// };

// export const authLink = createAuthLink({ url, region, auth });
// export const wsLink = createSubscriptionHandshakeLink({ url, region, auth }, authLink);

// const apolloLink = new ApolloLink((operation, forward) => {
//   // Add the Authorization header with your token
//   operation.setContext(({ headers = {} }) => ({
//     headers: {
//       ...headers
//       // identity: localStorage.getItem("idToken") || ""
//     }
//   }));
//   console.log("operation", operation.getContext());

//   return forward(operation);
// });

export const httpLinks2 = new HttpLink({
  uri: url2,
  headers: {
    Authorization: process.env.REACT_APP_TANENT_API_KEY || ""
  }
});

// const getLogoutFunction = () => {
//   localStorage.clear();

// };
const errorLink = onError(({ graphQLErrors, networkError }) => {
  const logout = getLogoutFunction();
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (extensions && extensions.code === "UNAUTHENTICATED") {
        logout();
      }
      console.log(message, locations, path);
    });
  }
  console.log("networkError", networkError);
  const networkErrors = networkError as any;
  if (networkErrors && networkErrors?.statusCode === 401) {
    logout();
  }
});
const splitLink = split(
  (operation) => operation.getContext().apiVersion === "admin",
  httpLinks2, //if above
  httpLinks
);
const link = from([errorLink, splitLink]);
// const link = ApolloLink.from([apolloLink, splitLink]);
export const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});
