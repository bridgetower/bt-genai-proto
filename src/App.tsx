import "./App.css";
import "./styles/global.css";

import { ApolloProvider } from "@apollo/client";
import React from "react";
import { Toaster } from "react-hot-toast";

import { apolloClient } from "./apollo/apolloClient";
import AppRouter from "./AppRouter";

const App: React.FC = () => {
  return (
    <div className="App">
      <Toaster />
      <ApolloProvider client={apolloClient}>
        <AppRouter />
      </ApolloProvider>
    </div>
  );
};

export default App;
