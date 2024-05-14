import { Link } from "react-router-dom";
import Auth from "../utils/auth";
import { useEffect, useRef, useState } from "react";
import Password from "./Password";
import Modal from "./Modal";

export default function LoginForm({
  title,
  formData,
  setFormData,
  handleSub,
  authData,
  userIdParam = null,
}) {
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (title === "Login") {
      if (userIdParam) {
        passwordRef.current.focus();
      } else {
        emailRef.current.focus();
      }
    } else {
      usernameRef.current.focus();
    }
  }, [title, userIdParam]);

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
      const { data } = await handleSub({
        variables: { ...formData, password },
      });
      authData === "loginUser"
        ? Auth.login(data.loginUser.token)
        : Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
      setErrorModal(true);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 mx-4">
        <div
          className="container card shadow p-4"
          style={{ maxWidth: "750px" }}
        >
          <form className="mx-5" onSubmit={handleSubmit}>
            <h3 className="text-center mb-5">{title}</h3>
            {title === "Sign Up" && (
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  ref={usernameRef}
                  onChange={handleFormChange}
                  value={formData.username}
                  placeholder=" "
                  className={`form-control mb-2 ${
                    errorModal ? "input-error" : ""
                  }`}
                  required
                />
                <label
                  htmlFor="username"
                  className={`${errorModal ? "text-danger input-error" : ""}`}
                >
                  Username
                </label>
              </div>
            )}
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                ref={emailRef}
                onChange={handleFormChange}
                value={formData.email}
                placeholder=" "
                className={`form-control mb-2 ${
                  errorModal ? "input-error" : ""
                }`}
                required
              />
              <label
                htmlFor="email"
                className={`${errorModal ? "text-danger input-error" : ""}`}
              >
                Email
              </label>
            </div>
            <Password
              errorModal={errorModal}
              title={title}
              password={password}
              setPassword={setPassword}
              passwordRef={passwordRef}
            />

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary my-4 text-center"
              >
                Log in
              </button>
            </div>
          </form>
          <div className="mt-3">
            {title === "Login" ? (
              <p className="text-center">
                To create an account <Link to="/signup">click here</Link>
              </p>
            ) : (
              <p className="text-center">
                Already a user? <Link to="/login">login here</Link>
              </p>
            )}
          </div>
        </div>
      </div>
      {errorModal && (
        <Modal
          modalMessage={"Your email or  password is incorrect!"}
          buttonConfig={[
            {
              label: "Try Again",
              className: "btn-secondary mx-auto",
              onClick: () => setErrorModal(false),
            },
          ]}
        />
      )}
    </>
  );
}
