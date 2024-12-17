import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";

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
const splitLink = split(
  (operation) => operation.getContext().apiVersion === "admin",
  httpLinks2, //if above
  httpLinks
);
// const link = ApolloLink.from([apolloLink, splitLink]);
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});
