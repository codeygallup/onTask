import { useState } from "react";
import { LOGIN } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import LoginForm from "../components/LoginForm";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginUser] = useMutation(LOGIN);

  return (
    <div className="login">
      <LoginForm
        title="Login"
        formData={formData}
        setFormData={setFormData}
        handleSub={loginUser}
        authData="loginUser"
      />
    </div>
  );
};

export default Login;