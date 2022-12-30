import { useState } from "react";
import Auth from "../utils/auth";
import { LOGIN } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import LoginForm from "../components/LoginForm";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginUser] = useMutation(LOGIN);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      const { data } = await loginUser({
        variables: { ...formData },
      });
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
    }

    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="login">
      <LoginForm
        title="Login"
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Login;
