import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REQUEST_PASSWORD_RECOVERY } from "../utils/mutations";
import Modal from "../components/Modal";

const Recover = () => {
  const [email, setEmail] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [requestPasswordRecovery] = useMutation(REQUEST_PASSWORD_RECOVERY);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const { data } = await requestPasswordRecovery({
        variables: { email },
      });
      
      if (data?.requestPasswordRecovery?.success) {
        setUserId(data.requestPasswordRecovery.user._id);
        setSuccessModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message || "Failed to send recovery PIN. Please try again.");
    }
  };

  const handleRedirect = () => {
    navigate(`/reset/${userId}`);
  };

  return (
    <>
      <div className="flex justify-center items-center md:h-[calc(100vh-10rem)] mt-50 md:mt-20 pb-40 transition-all duration-400 ease-in-out mx-4">
        <div
          className={`w-full max-w-[550px] bg-white rounded-lg shadow-lg p-8 transition-all duration-400 ease-in-out border-2 border-slate-300 ${
            successModal ? "opacity-40 blur-[5px]" : ""
          }`}
        >
          <form className="mx-5 flex flex-col gap-6" onSubmit={handleSubmitEmail}>
            <h3 className="text-center text-3xl mb-18">Password Recovery</h3>
            
            {errorMessage && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
            
            <div className="relative flex flex-col gap-2">
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                className="peer w-full px-4 py-2 border-2 rounded focus:outline-none focus:border-teal-500"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="email"
                className="absolute top-2 left-4 text-gray-500 transition-all duration-300 ease-in-out pointer-events-none peer-focus:-top-8 peer-focus:text-base peer-focus:text-teal-500 peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-base peer-[:not(:placeholder-shown)]:text-teal-500"
              >
                Email
              </label>
              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-3 rounded-lg text-center hover:bg-teal-600 transition-colors font-semibold"
              >
                Request Recovery PIN
              </button>
            </div>
          </form>
          <div className="mt-10">
            <p className="text-center">
              Return to{" "}
              <Link
                to="/login"
                className="text-teal-500 hover:text-teal-600 no-underline"
              >
                login here
              </Link>
            </p>
          </div>
        </div>
      </div>
      {successModal && (
        <Modal
          modalMessage={
            "A recovery PIN was sent to your email, please check your spam"
          }
          buttonConfig={[
            {
              label: "Input PIN",
              className: "px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600",
              onClick: handleRedirect,
            },
          ]}
        />
      )}
    </>
  );
};

export default Recover;