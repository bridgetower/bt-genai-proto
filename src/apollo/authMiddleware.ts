import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { AUTH_TYPE, createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";

export const httpLinks = new HttpLink({
  uri: "https://qckclllnjvaozmbbseatqsy3ye.appsync-api.us-east-1.amazonaws.com/graphql",
  headers: {
    Authorization: process.env.REACT_APP_TANENT_API_KEY || ""
  }
});

const url = "https://g2n4ivs5jbcirgsy5kkal7puea.appsync-api.us-east-1.amazonaws.com/graphql";
const region = "us-east-1";

// Lambda authorization
const auth = {
  type: "AWS_LAMBDA" as AUTH_TYPE.AWS_LAMBDA,
  token: process.env.REACT_APP_TANENT_API_KEY || ""
  // identity: localStorage.getItem("idToken") || ""
};

export const authLink = createAuthLink({ url, region, auth });
export const wsLink = createSubscriptionHandshakeLink({ url, region, auth }, authLink);

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

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  httpLinks
);
// const link = ApolloLink.from([apolloLink, splitLink]);
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});
