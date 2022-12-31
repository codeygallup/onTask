import { Link } from "react-router-dom";
import Auth from "../utils/auth";

export default function LoginForm({
  title,
  formData,
  setFormData,
  handleSub,
  authData,
}) {
  console.log(typeof authData);
  console.log(typeof math);
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const current = window.location.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      const { data } = await handleSub({
        variables: { ...formData },
      });
      authData === "loginUser"
        ? Auth.login(data.loginUser.token)
        : Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form className="login-form text-center" onSubmit={handleSubmit}>
        <h3>{title}</h3>
        {current === "/signup" && (
          <input
            type="text"
            name="username"
            onChange={handleFormChange}
            value={formData.username}
            placeholder="Username"
            className="login-input"
            required
          />
        )}
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
      </form>
      {current === "/login" ? (
        <p className="login-link">
          To create an account{" "}
          <Link className="cred-link" to="/signup">
            click here
          </Link>
        </p>
      ) : (
        <p className="login-link">
          Already a user?{" "}
          <Link className="cred-link" to="/login">
            login here
          </Link>
        </p>
      )}
    </>
  );
}
