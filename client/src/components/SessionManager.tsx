import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { REFRESH_TOKEN } from "../utils/mutations";
import Auth from "../utils/auth";
import Modal from "./Modal";
import type { RefreshTokenResponse } from "../types";

interface SessionManagerProps {
  warningTime?: number;
}

const SessionManager = ({ warningTime = 30 * 1000 }: SessionManagerProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [refreshToken] = useMutation<RefreshTokenResponse>(REFRESH_TOKEN);

  useEffect(() => {
    let checkInterval: ReturnType<typeof setInterval>;
    let countDownInterval: ReturnType<typeof setInterval>;

    const checkTokenExpiry = () => {
      const token = Auth.getToken();
      if (!token) return;

      try {
        const decoded = Auth.getProfile();
        if (!decoded || !decoded.exp) return;

        const expiryTime = decoded.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        if (timeUntilExpiry <= warningTime && timeUntilExpiry > 0) {
          setShowModal(true);
          setTimeLeft(Math.floor(timeUntilExpiry / 1000));

          countDownInterval = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev <= 1) {
                clearInterval(countDownInterval);
                Auth.logout();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
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
      if (countDownInterval) clearInterval(countDownInterval);
    };
  }, [warningTime]);

  const handleExtendSession = async () => {
    try {
      const { data } = await refreshToken();

      if (data?.refreshToken?.token) {
        localStorage.setItem("id_token", data.refreshToken.token);
        setShowModal(false);
        console.log("Session extended successfully");
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
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
            Hey fucker, you're about to be signed out due to inactivity!
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
