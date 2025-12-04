import { useEffect, useState } from "react";
import { LOGIN } from "../utils/mutations";
import { useMutation, useQuery } from "@apollo/client";
import LoginForm from "../components/LoginForm";
import { useLocation } from "react-router-dom";
import { FIND_USER } from "../utils/queries";

const Login = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userIdParam = queryParams.get("userId") || "";
  const { data: { findUser: { email: user } = {} } = {} } = useQuery(
    FIND_USER,
    {
      variables: { id: userIdParam },
      skip: !userIdParam,
    },
  );

  const [formData, setFormData] = useState({
    email: user ?? "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        email: user,
      }));
    }
  }, [user]);

  const [loginUser] = useMutation(LOGIN);

  return (
    <LoginForm
      title="Login"
      formData={formData}
      setFormData={setFormData}
      handleSub={loginUser}
      authData="loginUser"
      userIdParam={userIdParam}
    />
  );
};

export default Login;
