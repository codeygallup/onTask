import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "../utils/mutations";
import { useLocation } from "react-router-dom";

const Reset = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const user = params.get("user");
  const recoverToken = params.get("token");
  const [token, setToken] = useState(recoverToken || ""); // Initialize state with token from params if available
  const [email, setEmail] = useState(user);
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [resetPassword] = useMutation(RESET_PASSWORD);

  // Update token state when token changes in params
  useEffect(() => {
    setToken(recoverToken || "");
  }, [recoverToken]);

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      console.log('Email:', email);
      console.log('Token:', token);
      console.log('New Password:', newPassword);
      const { data } = await resetPassword({
        variables: { email, token, newPassword },
      });
      console.log('Success:', data);
      setSuccessMessage(data.resetPassword.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="container card shadow p-4" style={{ maxWidth: "550px" }}>
            <>
              <form className="mx-5" onSubmit={handleSubmitPassword}>
                <h3 className="text-center mb-3">Changing password for {user}</h3>
                <div className="form-group">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder=" "
                    className="form-control"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary text-center">
                    Reset Password
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
    </>
  );
};

export default Reset;