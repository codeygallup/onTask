import { useState } from "react";
import Auth from "../utils/auth";
import { ADD_USER } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { Link } from 'react-router-dom'

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // eslint-disable-next-line
  const [addUser, { error }] = useMutation(ADD_USER);

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
      const { data } = await addUser({
        variables: { ...formData },
      });
      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
    }

    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="signup">
      <form className="login-form text-center" onSubmit={handleSubmit}>
        <h3>Sign Up</h3>
        <input
          type="text"
          name="username"
          onChange={handleFormChange}
          value={formData.username}
          placeholder="Username"
          className="login-input"
          required
        />
        <input
          type="email"
          name="email"
          onChange={handleFormChange}
          value={formData.email}
          placeholder="Email"
          className="login-input"
          required
        />
        <input
          type="password"
          name="password"
          onChange={handleFormChange}
          value={formData.password}
          placeholder="Password"
          className="login-input"
          required
        />
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
        <p className="login-link">Already a user? <Link className="cred-link" to="/login">login here</Link></p>
      </form>
    </div>
  );
};

export default Signup;
