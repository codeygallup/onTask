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
import { setContext } from "@apollo/client/link/context";
import jwtDecode from "jwt-decode";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Project from "./pages/Project";
import ProjectPage from "./pages/ProjectPage";
import ProjectUpdate from "./pages/ProjectUpdate";
import Recover from "./pages/Recover";
import Reset from "./pages/Reset";
import Navbar from "./components/Navbar";

const http = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "/graphql"
      : "http://localhost:3001/graphql",
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

// const PrivateRoutes = () => {
//   const [showModal, setShowModal] = useState(false)
//   const token = localStorage.getItem("id_token");
//   let isAuthenticated = false;
//   if (token) {
//     try {
//       const { exp } = jwtDecode(token);
//       if (Date.now() >= exp * 1000) {
//         console.log("Token is expired");
//         localStorage.removeItem("id_token");
//       } else {
//         isAuthenticated = true;
//       }
//     } catch (err) {
//       console.error("Token decoding failed", err);
//       localStorage.removeItem("id_token");
//     }
//   }
//   const handleModalClose = () => {
//     setShowModal(false);
//     window.location.href = "/login";
//   };

//   return (
//     <>
//       {isAuthenticated ? <Outlet /> : <Navigate to={"/"} />}
//       {showModal && (
//         <Modal
//           modalMessage={"Your session has expired"}
//           buttonConfig={[
//             {
//               label: "Return to login",
//               className: "btn-secondary mx-auto",
//               onClick: handleModalClose,
//             },
//           ]}
//         />
//       )}
//     </>
//   );
// };
