import React, { useState } from "react";
import Auth from "../utils/auth";
import { LOGIN } from "../utils/mutations";
import { useMutation } from "@apollo/client";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // eslint-disable-next-line
  const [loginUser, { error }] = useMutation(LOGIN);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await loginUser({
        variables: { email: formData.email, password: formData.password },
      });
      const token = userData.data.login.token;
      Auth.login(token);
    } catch (err) {
      console.error(err);
    }

    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <form className="login text-center" onSubmit={handleSubmit}>
      <h3 className="mb-5">Login</h3>
      <label className="mx-3">Email:</label>
      <input name="email" type="email" onChange={handleFormChange} />
      <label className="mx-3">Password:</label>
      <input
        name="password"
        type="password"
        onChange={handleFormChange}
        className="mb-4"
      />
      <br />
      <button type="submit" className="btn">
        Login
      </button>
    </form>
  );
};

export default Login;
