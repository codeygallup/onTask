import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REQUEST_PASSWORD_RECOVERY } from "../utils/mutations";
import Modal from "../components/Modal";

const Recover = () => {
  const [email, setEmail] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const [requestPasswordRecovery] = useMutation(REQUEST_PASSWORD_RECOVERY);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const {
        data: {
          requestPasswordRecovery: { user: { _id = null } = {} } = {},
        } = {},
      } = await requestPasswordRecovery({
        variables: { email },
      });
      setUserId(_id);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRedirect = () => {
    navigate(`/reset/${userId}`);
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className={`container card shadow p-4 ${successModal && "faded"}`}
          style={{ maxWidth: "550px" }}
        >
          <>
            <form className="mx-5" onSubmit={handleSubmitEmail}>
              <h3 className="text-center mb-3">Password Recovery</h3>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder=" "
                  className="form-control"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary text-center">
                  Request Recovery PIN
                </button>
              </div>
            </form>
            <div className="mt-2">
              <p className="text-center">
                Return to <Link to="/login">login here</Link>
              </p>
            </div>
          </>
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
              className: "btn-secondary mx-auto",
              onClick: handleRedirect,
            },
          ]}
        />
      )}
    </>
  );
};

export default Recover;
