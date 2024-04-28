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
      <div className="d-flex justify-content-center align-items-center vh-100 ">
        <div className="container card shadow p-5">
          <form className="mx-5" onSubmit={handleSubmit}>
            <h3 className="text-center mb-5">{title}</h3>
            {current === "/signup" && (
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  onChange={handleFormChange}
                  value={formData.username}
                  placeholder=" "
                  className="form-control mb-2"
                  autoFocus
                  required
                />
                <label htmlFor="username">Username</label>
              </div>
            )}
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleFormChange}
                value={formData.email}
                placeholder=" "
                className="form-control mb-3"
                autoFocus
                required
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="form-group">
              <input
                name="password"
                type="password"
                onChange={handleFormChange}
                value={formData.password}
                placeholder=" "
                className="form-control"
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary my-4 text-center"
              >
                {current === "/login" ? "Login" : "Signup"}
              </button>
            </div>
          </form>
          {current === "/login" ? (
            <p className="text-center">
              To create an account{" "}
              <Link className="cred-link" to="/signup">
                click here
              </Link>
            </p>
          ) : (
            <p className="text-center">
              Already a user?{" "}
              <Link className="cred-link" to="/login">
                login here
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
