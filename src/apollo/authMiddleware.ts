import { HttpLink } from "@apollo/client";

export const AuthMiddleware = new HttpLink({
  uri: "https://qckclllnjvaozmbbseatqsy3ye.appsync-api.us-east-1.amazonaws.com/graphql",
  headers: {
    Authorization: process.env.REACT_APP_TANENT_API_KEY || ""
  }
});
