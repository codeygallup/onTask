import Modal from "./Modal";
import type { SessionManagerProps } from "../types";
import { useSessionManager } from "../hooks/useSessionManager";

const SessionManager = ({ warningTime = 30 * 1000 }: SessionManagerProps) => {
  const { showModal, timeLeft, formatTime, handleExtendSession, handleLogout } =
    useSessionManager(warningTime);

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
