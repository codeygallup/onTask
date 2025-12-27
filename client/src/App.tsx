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
import Auth from "./utils/auth";
import SessionManager from "./components/SessionManager";

// Set up Apollo Client
const http = new HttpLink({
  uri:
    import.meta.env.MODE === "production"
      ? "/graphql"
      : "http://localhost:3001/graphql",
});

// Middleware to attach the JWT token to each request
const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Instantiate Apollo Client
const client = new ApolloClient({
  link: authLink.concat(http),
  cache: new InMemoryCache({
    // This ensures that when we update a project, the tasks array is replaced entirely
    // This prevents issues with stale data in nested arrays
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

// Component to protect private routes
const PrivateRoutes = () => {
  const isAuthenticated = Auth.loggedIn();
  return isAuthenticated ? <Outlet /> : <Navigate to={"/"} replace />;
};

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Navbar />
        // Show session warning 1 minute before expiration
        {Auth.loggedIn() && <SessionManager warningTime={1 * 60 * 1000} />}
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
