import { useMemo } from "react";
import type {
  PasswordRequirement,
  PasswordStrengthIndicatorProps,
} from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const PasswordStrengthIndicator = ({
  password,
}: PasswordStrengthIndicatorProps) => {
  // Define password requirements and their corresponding tests
  const requirements: PasswordRequirement[] = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "One number", test: (p) => /[0-9]/.test(p) },
    { label: "One special character", test: (p) => /[^a-zA-Z0-9]/.test(p) },
  ];

  // Evaluate each requirement against the current password
  const checks = useMemo(
    () => requirements.map((req) => ({ ...req, passed: req.test(password) })),
    [password]
  );

  // If password is empty, don't show the indicator
  if (password.length === 0) return null;

  return (
    <div className="mt-2 rounded border border-slate-200 bg-slate-50 p-3">
      <p className="mb-2 text-sm font-semibold text-gray-700">
        Password Requirements:
      </p>
      <ul className="space-y-1">
        {checks.map((check, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            {check.passed ? (
              <span className="text-teal-500">
                <FontAwesomeIcon icon={faCheck} />
              </span>
            ) : (
              <span className="text-red-500">
                <FontAwesomeIcon icon={faXmark} />
              </span>
            )}
            <span className={check.passed ? "text-teal-700" : "text-gray-600"}>
              {check.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;
