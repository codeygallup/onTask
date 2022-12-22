import { useState } from "react";
import Auth from "../utils/auth";
import { LOGIN } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

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
      <form className="login-form text-center" onSubmit={handleSubmit}>
        <h3>Login</h3>
        <input
          name="email"
          type="email"
          onChange={handleFormChange}
          value={formData.email}
          placeholder="Email"
          className="login-input"
          required
        />
        <input
          name="password"
          type="password"
          onChange={handleFormChange}
          value={formData.password}
          placeholder="Password"
          className="login-input"
          required
        />
        <button type="submit" className="btn btn-primary login-input">
          Login
        </button>
        <p>To create an account <Link className="cred-link" to="/signup">click here</Link></p>
      </form>
    </div>
  );
};

export default Login;
