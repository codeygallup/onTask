import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";

const Password = ({
  title = "",
  errorModal = false,
  passwordRef = null,
  password,
  setPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="form-group d-flex align-items-center flex-wrap">
      <div className="flex-grow-1">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          ref={passwordRef}
          placeholder=" "
          className={`form-control mb-2 ${errorModal ? "input-error" : ""}`}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label
          htmlFor="password"
          className={`${errorModal ? "text-danger input-error" : ""}`}
        >
          Password
        </label>
      </div>
      <button type="button" className="btn pb-3" onClick={handleShowPassword}>
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
  );
};

export default Password;

{
  /* 
  <input
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
  />*/
}

{
  /* 
                <input
                  onChange={handleFormChange}
                  value={formData.password}
                />
              > */
}
