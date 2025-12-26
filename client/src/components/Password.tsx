import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { PasswordProps } from "../types";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

const Password = ({
  title = "",
  password,
  setPassword,
  errorModal = false,
  passwordRef,
  showStrengthIndicator = false,
}: PasswordProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowPassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            ref={passwordRef}
            placeholder=" "
            className={`peer mb-2 w-full rounded border-2 border-slate-300 px-4 py-2 focus:border-teal-500 focus:outline-none ${
              errorModal ? "input-error" : ""
            }`}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            htmlFor="password"
            className={`pointer-events-none absolute top-2 left-4 text-gray-500 transition-all duration-300 ease-in-out peer-focus:-top-8 peer-focus:text-base peer-focus:text-teal-500 peer-[:not(:placeholder-shown)]:-top-8 peer-[:not(:placeholder-shown)]:text-base peer-[:not(:placeholder-shown)]:text-teal-500 ${
              errorModal ? "text-red-500" : ""
            }`}
          >
            Password
          </label>
        </div>
        <button
          type="button"
          className="px-3 pb-3 transition-colors hover:text-teal-500"
          onClick={handleShowPassword}
        >
          {showPassword ? (
            <FontAwesomeIcon icon={faEyeSlash} />
          ) : (
            <FontAwesomeIcon icon={faEye} />
          )}
        </button>
      </div>

      {showStrengthIndicator && (
        <PasswordStrengthIndicator password={password} />
      )}

      {title === "Login" && (
        <div className="w-full">
          <p className="mb-0 text-right">
            <Link
              to="/recover"
              className="text-teal-500 no-underline hover:text-teal-600"
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
