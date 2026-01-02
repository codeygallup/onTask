import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RecoveryResponse } from "../types";
import { REQUEST_PASSWORD_RECOVERY } from "../utils/mutations";

export const useRequestRecovery = () => {
  const [email, setEmail] = useState<string>("");
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const [requestPasswordRecovery] = useMutation<RecoveryResponse>(
    REQUEST_PASSWORD_RECOVERY
  );

  const handleSubmitEmail = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const { data } = await requestPasswordRecovery({ variables: { email } });

      // If the request was successful, show the success modal
      if (data?.requestPasswordRecovery?.success) {
        setUserId(data.requestPasswordRecovery.user._id);
        setSuccessModal(true);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          "Failed to send password recovery PIN. Please try again later."
      );
    }
  };

  // Redirect to reset page with userId
  const handleRedirect = (): void => {
    navigate(`/reset/${userId}`);
  };

  return {
    email,
    setEmail,
    successModal,
    errorMessage,
    handleSubmitEmail,
    handleRedirect,
  };
};
