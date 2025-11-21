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
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            ref={passwordRef}
            placeholder=" "
            className={`peer w-full px-4 py-2 border-2 rounded mb-2 focus:outline-none focus:border-teal-500 ${
              errorModal ? "input-error" : ""
            }`}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            htmlFor="password"
            className={`absolute top-2 left-4 text-gray-500 transition-all duration-300 ease-in-out pointer-events-none peer-focus:-top-8 peer-focus:text-base peer-focus:text-teal-500 peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-base peer-[:not(:placeholder-shown)]:text-teal-500 ${
              errorModal ? "text-red-500" : ""
            }`}
          >
            Password
          </label>
        </div>
        <button
          type="button"
          className="pb-3 px-3 hover:text-teal-500 transition-colors"
          onClick={handleShowPassword}
        >
          {showPassword ? (
            <FontAwesomeIcon icon={faEyeSlash} />
          ) : (
            <FontAwesomeIcon icon={faEye} />
          )}
        </button>
      </div>
      {title === "Login" && (
        <div className="w-full">
          <p className="mb-0 text-right">
            <Link
              to="/recover"
              className="text-teal-500 hover:text-teal-600 no-underline"
            >
              Forgot password?
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Password;