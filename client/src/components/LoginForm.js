import { Link } from "react-router-dom";
import Auth from "../utils/auth";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function LoginForm({
  title,
  formData,
  setFormData,
  handleSub,
  authData,
}) {
  const emailRef = useRef(null);
  const usernameRef = useRef(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (title === "Login") {
      emailRef.current.focus();
    } else {
      usernameRef.current.focus();
    }
  }, [title]);

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
        variables: { ...formData },
      });
      authData === "loginUser"
        ? Auth.login(data.loginUser.token)
        : Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
      setErrorModal(true);
      setErrorMsg("Your email or  password is incorrect!");
    }
  };

  const closeModal = () => {
    setErrorModal(false);
    setErrorMsg("");
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 ">
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
            <div className="form-group d-flex align-items-center flex-wrap">
              <div className="flex-grow-1">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleFormChange}
                  value={formData.password}
                  placeholder=" "
                  className={`form-control mb-2 ${
                    errorModal ? "input-error" : ""
                  }`}
                  required
                />
                <label
                  htmlFor="password"
                  className={`${errorModal ? "text-danger input-error" : ""}`}
                >
                  Password
                </label>
              </div>
              <button
                type="button"
                className="btn pb-3"
                onClick={handleShowPassword}
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </button>
              {title === "Login" && (
                <div className="w-100">
                  <div>
                    <p className="mb-0 float-end">
                      <Link to="/recover"> Forgot password?</Link>
                    </p>
                  </div>
                </div>
              )}
            </div>

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
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content text-center">
              <div className="modal-body">
                <p className="fs-4">{errorMsg}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
