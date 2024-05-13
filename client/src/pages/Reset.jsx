import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { RESET_PASSWORD, VALIDATE_PIN } from "../utils/mutations";
import { FIND_USER } from "../utils/queries";
import Password from "../components/Password";

const Reset = () => {
  const { id } = useParams();
  const [email, setEmail] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pin, setPin] = useState("");
  const [validatedPin, setValidatedPin] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const pinRef = useRef(null);
  const passwordRef = useRef(null);

  const [resetPassword] = useMutation(RESET_PASSWORD);
  const [validatePIN] = useMutation(VALIDATE_PIN);

  const { data } = useQuery(FIND_USER, {
    variables: { id: id },
  });
  const user = data?.findUser?.email;

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
      const { data } = await validatePIN({
        variables: { email, pin },
      });
      setValidatedPin(true);
      // setSuccessMessage(data.resetPassword.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await resetPassword({
        variables: { email, newPassword },
      });
      // setSuccessMessage(data.resetPassword.message);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div
        className={`d-flex justify-content-center align-items-center vh-100 ${
          successModal ? "faded" : ""
        }`}
      >
        <div
          className="container card shadow p-4"
          style={{ maxWidth: "550px" }}
        >
          <>
            <form
              className="mx-5"
              onSubmit={validatedPin ? handleSubmitPassword : handleValidatePIN}
            >
              <h3 className="text-center mb-5">Changing password for {user}</h3>
              {validatedPin ? (
                <>
                  <Password
                    password={newPassword}
                    setPassword={setNewPassword}
                    passwordRef={passwordRef}
                  />
                </>
              ) : (
                <>
                  <div className="form-group">
                    <input
                      type="PIN"
                      id="PIN"
                      name="PIN"
                      ref={pinRef}
                      placeholder=" "
                      className="form-control"
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                    />
                    <label htmlFor="PIN">PIN</label>
                  </div>
                </>
              )}
              <div className="d-grid">
                <button type="submit" className="btn btn-primary text-center">
                  {validatedPin ? "Reset Password" : "Enter PIN"}
                </button>
              </div>
            </form>

            <div className="mt-2">
              <p className="text-center">
                Return to <Link to="/login">login here</Link>
              </p>
            </div>
          </>
          {/* {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )} */}
        </div>
      </div>
      {successModal && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content text-center">
              <div className="modal-body">
                <p className="fs-4">Password succesfully changed</p>{" "}
                <p className="text-center">
                  <Link to="/login">Return to login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reset;

// const reset = () => {
//   return (
//     <>
//     {validatedPin ? (
//       <Password />
//     ) :
//     <Pin />}
//     </>
//   )
// }

// const password = () => {
//   // all password logic here
// }

// const pin = () => {
//   // all pin logic here

// }
