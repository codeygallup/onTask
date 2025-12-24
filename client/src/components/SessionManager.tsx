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
  const countDownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    let checkInterval: ReturnType<typeof setInterval>;

    const checkTokenExpiry = () => {
      if (showModal) return;
      const token = Auth.getToken();
      if (!token) return;

      try {
        const decoded = Auth.getProfile();
        if (!decoded || !decoded.exp) return;

        const expiryTime = decoded.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        if (
          timeUntilExpiry <= warningTime &&
          timeUntilExpiry > 0 &&
          !showModal
        ) {
          setShowModal(true);
          setTimeLeft(Math.floor(timeUntilExpiry / 1000));

          if (countDownIntervalRef.current) {
            clearInterval(countDownIntervalRef.current);
          }

          countDownIntervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
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

    checkInterval = setInterval(checkTokenExpiry, 30000);
    checkTokenExpiry();

    return () => {
      clearInterval(checkInterval);
      if (countDownIntervalRef.current) {
        clearInterval(countDownIntervalRef.current);
      }
    };
  }, [warningTime]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
