import { useEffect, useRef, useState } from "react";
import Auth from "../utils/auth";
import { Link } from "react-router-dom";
import Password from "./Password";
import type { LoginFormProps } from "../types";
import Modal from "./Modal";

const LoginForm = ({
  title,
  formData,
  setFormData,
  handleSub,
  authData,
  userIdParam,
}: LoginFormProps) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // const [errorMsg, setErrorMsg] = useState<string>("");
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    if (title === "Login") {
      if (userIdParam) {
        passwordRef.current?.focus();
      } else {
        emailRef.current?.focus();
      }
    } else {
      usernameRef.current?.focus();
    }
  }, [title, userIdParam]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
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
    } catch (err: any) {
      console.error(err); 
      setErrorModalOpen(true);
    }
  };

  return (
    <>
      <div className="mx-4 flex min-h-[calc(100vh-10rem)] items-center justify-center md:my-20 md:min-h-0">
        <div className="w-full max-w-[750px] rounded-lg border-0 bg-white px-6 py-8 shadow-xl md:border-2 md:border-slate-300 md:px-12">
          <form className="mx-2 md:mx-5" onSubmit={handleSubmit}>
            <h3 className="mb-8 text-center text-3xl font-bold">{title}</h3>

            {title === "Sign Up" && (
              <div className="relative mb-10">
                <input
                  type="text"
                  id="username"
                  name="username"
                  ref={usernameRef}
                  onChange={handleFormChange}
                  value={formData.username || ""}
                  placeholder=" "
                  className={`peer mb-2 w-full rounded border-2 px-4 py-2 transition-colors focus:border-teal-500 focus:outline-none ${
                    errorModalOpen ? "border-red-500" : "border-slate-300"
                  }`}
                  required
                />
                <label
                  htmlFor="username"
                  className={`pointer-events-none absolute top-2 left-4 text-gray-500 transition-all duration-300 ease-in-out peer-focus:-top-8 peer-focus:text-base peer-focus:text-teal-500 peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-base peer-[:not(:placeholder-shown)]:text-teal-500 ${
                    errorModalOpen ? "text-red-500" : ""
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
                className={`peer mb-2 w-full rounded border-2 px-4 py-2 transition-colors focus:border-teal-500 focus:outline-none ${
                  errorModalOpen ? "border-red-500" : "border-slate-300"
                }`}
                required
              />
              <label
                htmlFor="email"
                className={`pointer-events-none absolute top-2 left-4 text-gray-500 transition-all duration-300 ease-in-out peer-focus:-top-8 peer-focus:text-base peer-focus:text-teal-500 peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-base peer-[:not(:placeholder-shown)]:text-teal-500 ${
                  errorModalOpen ? "text-red-500" : ""
                }`}
              >
                Email
              </label>
            </div>

            <Password
              errorModal={errorModalOpen}
              title={title}
              password={password}
              setPassword={setPassword}
              passwordRef={passwordRef}
            />

            <div className="w-full">
              <button
                type="submit"
                className="my-4 w-full rounded-lg bg-teal-500 py-3 text-center font-semibold text-white shadow-md transition-colors hover:bg-teal-600 hover:shadow-lg"
              >
                {title === "Login" ? "Log in" : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="mt-3">
            {title === "Login" ? (
              <p className="text-center">
                To create an account{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-teal-500 no-underline hover:text-teal-600"
                >
                  click here
                </Link>
              </p>
            ) : (
              <p className="text-center">
                Already a user?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-teal-500 no-underline hover:text-teal-600"
                >
                  login here
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {errorModalOpen && (
        <Modal
          modalMessage={"Your email or password is incorrect!"}
          buttonConfig={[
            {
              label: "Try Again",
              className:
                "px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-semibold",
              onClick: () => setErrorModalOpen(false),
            },
          ]}
        />
      )}
    </>
  );
};

export default LoginForm;
