import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { RESET_PASSWORD, VALIDATE_PIN } from "../utils/mutations";
import { FIND_USER } from "../utils/queries";
import Password from "../components/Password";
import Modal from "../components/Modal";

const Reset = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [pin, setPin] = useState("");
  const [validatedPin, setValidatedPin] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const pinRef = useRef(null);
  const passwordRef = useRef(null);

  const [resetPassword] = useMutation(RESET_PASSWORD);
  const [validatePIN] = useMutation(VALIDATE_PIN);

  const { data: { findUser: { _id: userId, email: user } = {} } = {} } =
    useQuery(FIND_USER, {
      variables: { id: id },
    });

  useEffect(() => {
    setEmail(user);
  }, [user]);

  useEffect(() => {
    if (validatedPin) {
      passwordRef.current.focus();
    } else {
      pinRef.current.focus();
    }
  }, [validatedPin]);

  const handleValidatePIN = async (e) => {
    e.preventDefault();
    try {
      await validatePIN({
        variables: { email, pin },
      });
      setValidatedPin(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({
        variables: { email, newPassword },
      });
      setSuccessModal(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleModalClose = (userId) => {
    if (userId === null || userId === undefined) {
      navigate("/login");
      return;
    }
    navigate(`/login?userId=${encodeURIComponent(userId)}`);
  };

  return (
    <>
      <div
        className={`mx-6 mt-50 flex items-center justify-center pb-40 transition-all duration-400 ease-in-out md:mt-20 md:h-[calc(100vh-10rem)] ${
          successModal ? "opacity-40 blur-[5px]" : ""
        }`}
      >
        <div className="flex min-h-80 w-full max-w-[550px] flex-col items-center justify-between rounded-lg border-2 border-slate-300 bg-white p-4 shadow-lg md:p-8">
          <form
            className="mx-5 flex w-full flex-col gap-4"
            onSubmit={validatedPin ? handleSubmitPassword : handleValidatePIN}
          >
            <h3 className="mb-10 text-center text-2xl font-bold">
              Changing password for {user}
            </h3>
            {validatedPin ? (
              <div className="relative top-6">
                <Password
                  password={newPassword}
                  setPassword={setNewPassword}
                  passwordRef={passwordRef}
                />
              </div>
            ) : (
              <div className="relative top-10 mb-2">
                <input
                  type="text"
                  id="PIN"
                  name="PIN"
                  ref={pinRef}
                  placeholder=" "
                  className="peer w-full rounded border-2 px-4 py-2 focus:border-teal-500 focus:outline-none"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
                <label
                  htmlFor="PIN"
                  className="pointer-events-none absolute top-2 left-4 text-gray-500 transition-all duration-300 ease-in-out peer-focus:-top-8 peer-focus:text-base peer-focus:text-teal-500 peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-base peer-[:not(:placeholder-shown)]:text-teal-500"
                >
                  PIN
                </label>
              </div>
            )}
            <div className="relative top-6 mb-10 w-full">
              <button
                type="submit"
                className="w-full rounded-lg bg-teal-500 py-3 text-center font-semibold text-white transition-colors hover:bg-teal-600"
              >
                {validatedPin ? "Reset Password" : "Enter PIN"}
              </button>
            </div>
          </form>

          <div className="md:mt-2">
            <p className="text-center">
              Return to{" "}
              <Link
                to="/login"
                className="text-teal-500 no-underline hover:text-teal-600"
              >
                login here
              </Link>
            </p>
          </div>
        </div>
      </div>
      {successModal && (
        <Modal
          modalMessage={"Password successfully changed"}
          buttonConfig={[
            {
              label: "Login",
              className:
                "px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600",
              onClick: () => handleModalClose(userId),
            },
          ]}
        />
      )}
    </>
  );
};

export default Reset;
