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
      <div className="flex justify-center items-center md:min-h-screen mx-4 mt-20 md:mt-0 md:pt-0 pb-20">
        <div className="w-full max-w-[750px] bg-white rounded-lg shadow-lg px-6 md:px-18 py-6 border-2 border-slate-300">
          <form className="mx-5" onSubmit={handleSubmit}>
            <h3 className="text-center text-3xl mb-8">{title}</h3>
            
            {title === "Sign Up" && (
              <div className="relative mb-10">
                <input
                  type="text"
                  name="username"
                  ref={usernameRef}
                  onChange={handleFormChange}
                  value={formData.username}
                  placeholder=" "
                  className={`peer w-full px-4 py-2 border-2 rounded mb-2 focus:outline-none focus:border-teal-500 ${
                    errorModal ? "input-error" : ""
                  }`}
                  required
                />
                <label
                  htmlFor="username"
                  className={`absolute top-2 left-4 text-gray-500 transition-all duration-300 ease-in-out pointer-events-none peer-focus:-top-8 peer-focus:text-base peer-focus:text-teal-500 peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-base peer-[:not(:placeholder-shown)]:text-teal-500 ${
                    errorModal ? "text-red-500" : ""
                  }`}
                >
                  Username
                </label>
              </div>
            )}
            
            <div className="relative mb-10">
              <input
                type="email"
                id="email"
                name="email"
                ref={emailRef}
                onChange={handleFormChange}
                value={formData.email}
                placeholder=" "
                className={`peer w-full px-4 py-2 border-2 rounded mb-2 focus:outline-none focus:border-teal-500 ${
                  errorModal ? "input-error" : ""
                }`}
                required
              />
              <label
                htmlFor="email"
                className={`absolute top-2 left-4 text-gray-500 transition-all duration-300 ease-in-out pointer-events-none peer-focus:-top-8 peer-focus:text-base peer-focus:text-teal-500 peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-base peer-[:not(:placeholder-shown)]:text-teal-500 ${
                  errorModal ? "text-red-500" : ""
                }`}
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

            <div className="w-full">
              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-3 rounded-lg text-center my-4 hover:bg-teal-600 transition-colors font-semibold"
              >
                {title === "Login" ? "Log in" : "Sign Up"}
              </button>
            </div>
          </form>
          
          <div className="mt-3">
            {title === "Login" ? (
              <p className="text-center">
                To create an account <Link to="/signup" className="text-teal-500 hover:text-teal-600 no-underline">click here</Link>
              </p>
            ) : (
              <p className="text-center">
                Already a user? <Link to="/login" className="text-teal-500 hover:text-teal-600 no-underline">login here</Link>
              </p>
            )}
          </div>
        </div>
      </div>
      
      {errorModal && (
        <Modal
          modalMessage={"Your email or password is incorrect!"}
          buttonConfig={[
            {
              label: "Try Again",
              className: "px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600",
              onClick: () => setErrorModal(false),
            },
          ]}
        />
      )}
    </>
  );
}