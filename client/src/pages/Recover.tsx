import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { useRequestRecovery } from "../hooks/useRequestRecovery";

const Recover = () => {
  const {
    email,
    setEmail,
    successModal,
    errorMessage,
    handleSubmitEmail,
    handleRedirect,
  } = useRequestRecovery();

  return (
    <>
      <div className="mx-4 mt-50 flex items-center justify-center pb-40 transition-all duration-400 ease-in-out md:mt-20 md:h-[calc(100vh-10rem)]">
        <div
          className={`w-full max-w-[550px] rounded-lg border-2 border-slate-300 bg-white p-8 shadow-lg transition-all duration-400 ease-in-out ${
            successModal ? "opacity-40 blur-[5px]" : ""
          }`}
        >
          <form
            className="mx-5 flex flex-col gap-6"
            onSubmit={handleSubmitEmail}
          >
            <h3 className="mb-18 text-center text-3xl">Password Recovery</h3>

            {errorMessage && (
              <div className="rounded border border-red-400 bg-red-100 p-3 text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="relative flex flex-col gap-2">
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                className="peer w-full rounded border-2 px-4 py-2 focus:border-teal-500 focus:outline-none"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="email"
                className="pointer-events-none absolute top-2 left-4 text-gray-500 transition-all duration-300 ease-in-out peer-focus:-top-8 peer-focus:text-base peer-focus:text-teal-500 peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-base peer-[:not(:placeholder-shown)]:text-teal-500"
              >
                Email
              </label>
              <button
                type="submit"
                className="w-full rounded-lg bg-teal-500 py-3 text-center font-semibold text-white transition-colors hover:bg-teal-600"
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
          modalMessage={
            "A recovery PIN was sent to your email, please check your spam"
          }
          buttonConfig={[
            {
              label: "Input PIN",
              className:
                "px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600",
              onClick: handleRedirect,
            },
          ]}
        />
      )}
    </>
  );
};

export default Recover;
