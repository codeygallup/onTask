import { useMutation, useQuery } from "@apollo/client/react";
import { useLocation } from "react-router-dom";
import { FIND_USER } from "../utils/queries";
import { useEffect, useState } from "react";
import { LOGIN } from "../utils/mutations";
import LoginForm from "../components/LoginForm";
import type { FindUserData, LoginFormData } from "../types";

const Login = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userIdParam = params.get("userId") || "";
  const { data } = useQuery<FindUserData>(FIND_USER, {
    variables: { id: userIdParam },
    skip: !userIdParam,
  });

  const user = data?.findUser?.email || "";

  const [formData, setFormData] = useState<LoginFormData>({
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
