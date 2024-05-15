import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import "./App.css";
import { setContext } from "@apollo/client/link/context";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Project from "./pages/Project";
import ProjectPage from "./pages/ProjectPage";
import ProjectUpdate from "./pages/ProjectUpdate";
import Recover from "./pages/Recover";
import Reset from "./pages/Reset";

const http = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(http),
  cache: new InMemoryCache({
    typePolicies: {
      Project: {
        fields: {
          tasks: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

const PrivateRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("id_token");

  return isAuthenticated ? <Outlet /> : <Navigate to={"/"} />;
};

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recover" element={<Recover />} />
            <Route path="/reset/:id" element={<Reset />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/project" element={<Project />} />
              <Route path="/project/:id" element={<ProjectPage />} />
              <Route path="/project/:id/update" element={<ProjectUpdate />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
