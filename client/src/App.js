import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import './App.css'
import { setContext } from '@apollo/client/link/context'

import Home from "./pages/Home";
// import Navbar from "./components/navbar";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
// import Project from './pages/Project';

const http = createHttpLink({
  uri: "/graphql",
});
console.log("🚀 ~ file: App.js ~ line 16 ~ http", http)

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
})
console.log("🚀 ~ file: App.js ~ line 27 ~ authLink ~ authLink", authLink)

const client = new ApolloClient({
  link: authLink.concat(http),
  cache: new InMemoryCache(),
});
console.log("🚀 ~ file: App.js ~ line 33 ~ client", client)

function App() {
  useEffect(() => {
    document.title = "OnTask";
  });

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        {/* <Navbar /> */}
        <div className="App">
          <Routes>
            {/* <div className="pages"> */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/projects" element={<Project />} /> */}
            {/* <Route 
              path="*"
              element={<NotFound />}
            /> */}
            {/* </div> */}
          </Routes>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;