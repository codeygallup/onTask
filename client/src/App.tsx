import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { SetContextLink } from "@apollo/client/link/context";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Recover from "./pages/Recover";
import Reset from "./pages/Reset";
import Project from "./pages/Project";
import ProjectPage from "./pages/ProjectPage";
import ProjectUpdate from "./pages/ProjectUpdate";

const http = new HttpLink({
  uri:
    import.meta.env.MODE === "production"
      ? "/graphql"
      : "http://localhost:3001/graphql",
});

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...prevContext.headers,
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
            merge(_existing = [], incoming: any[]) {
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
        <Navbar />
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
      </BrowserRouter>
    </ApolloProvider>
  );
}
export default App;
