import { useMutation } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";
import { REFRESH_TOKEN } from "../utils/mutations";
import Auth from "../utils/auth";
import Modal from "./Modal";
import type { RefreshTokenResponse, SessionManagerProps } from "../types";

const SessionManager = ({ warningTime = 30 * 1000 }: SessionManagerProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [refreshToken] = useMutation<RefreshTokenResponse>(REFRESH_TOKEN);
  // Ref to store the countdown interval ID
  const countDownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    let checkInterval: ReturnType<typeof setInterval>;

    // Function to check token expiry
    const checkTokenExpiry = () => {
      // If modal is already shown, no need to check again
      if (showModal) return;
      // Get the token from Auth utility if none is found, exit early
      const token = Auth.getToken();
      if (!token) return;

      try {
        const decoded = Auth.getProfile();
        // Check if the decoded token has an expiration time
        if (!decoded || !decoded.exp) return;

        // Calculate time until expiry in milliseconds
        const expiryTime = decoded.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        // Show modal if within warning time
        if (
          timeUntilExpiry <= warningTime &&
          timeUntilExpiry > 0 &&
          !showModal
        ) {
          setShowModal(true);
          setTimeLeft(Math.floor(timeUntilExpiry / 1000));

          // Start countdown interval
          if (countDownIntervalRef.current) {
            clearInterval(countDownIntervalRef.current);
          }

          // Update time left every second
          countDownIntervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
              // If time left reaches 0, logout the user
              if (prev <= 1) {
                if (countDownIntervalRef.current) {
                  clearInterval(countDownIntervalRef.current);
                }
                Auth.logout();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else if (timeUntilExpiry > warningTime && showModal) {
          // If user is active again, hide modal and clear interval
          setShowModal(false);
          if (countDownIntervalRef.current) {
            clearInterval(countDownIntervalRef.current);
            countDownIntervalRef.current = null;
          }
        } else if (timeUntilExpiry <= 0) {
          Auth.logout();
        }
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    };

    // Initial check and set interval to check periodically
    checkInterval = setInterval(checkTokenExpiry, 30000);
    checkTokenExpiry();

    // Cleanup on unmount
    return () => {
      clearInterval(checkInterval);
      if (countDownIntervalRef.current) {
        clearInterval(countDownIntervalRef.current);
      }
    };
  }, [warningTime]);

  // Function to handle session extension via token refresh
  const handleExtendSession = async () => {
    try {
      const { data } = await refreshToken();

      if (data?.refreshToken?.token) {
        localStorage.setItem("id_token", data.refreshToken.token);

        if (countDownIntervalRef.current) {
          clearInterval(countDownIntervalRef.current);
          countDownIntervalRef.current = null;
        }

        setShowModal(false);
        setTimeLeft(0);
        console.log("Session extended successfully");
      }
    } catch (err) {
      console.error("Failed to refresh token:", err);
      Auth.logout();
    }
  };

  const handleLogout = () => {
    Auth.logout();
  };

  // Function to format time in mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Do not render modal if not needed
  if (!showModal) return null;

  return (
    <Modal
      modalMessage={
        <div className="space-y-4">
          <p className="text-xl font-semibold text-slate-800">
            Session Expiring Soon
          </p>
          <p className="text-slate-700">
            Your session is about to expire due to inactivity. Please log out or
            extend your session to continue.
          </p>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500">
              {formatTime(timeLeft)}
            </div>
            <p className="mt-2 text-sm text-slate-500">Time remaining</p>
          </div>
        </div>
      }
      buttonConfig={[
        {
          label: "Logout Now",
          className:
            "px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 font-semibold",
          onClick: handleLogout,
        },
        {
          label: "Stay Logged In",
          className:
            "px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 font-semibold",
          onClick: handleExtendSession,
        },
      ]}
    />
  );
};

export default SessionManager;
