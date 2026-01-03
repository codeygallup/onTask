import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";
import { RESET_PASSWORD, VALIDATE_PIN } from "../utils/mutations";
import { FIND_USER } from "../utils/queries";
import type { FindUserData } from "../types";
import { useNavigate, useParams } from "react-router-dom";

export const usePasswordReset = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [validatedPin, setValidatedPin] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const pinRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [resetPassword] = useMutation(RESET_PASSWORD);
  const [validatePIN] = useMutation(VALIDATE_PIN);

  const { data } = useQuery<FindUserData>(FIND_USER, {
    variables: { id },
  });

  const userId = data?.findUser?._id || undefined;
  const user = data?.findUser?.email || null;

  useEffect(() => {
    if (user) {
      setEmail(user);
    }
  }, [user]);

  useEffect(() => {
    // Focus the appropriate input based on whether the PIN has been validated
    if (validatedPin) {
      passwordRef.current?.focus();
    } else {
      pinRef.current?.focus();
    }
  }, [validatedPin]);

  const handleValidatePIN = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      await validatePIN({
        variables: { email, pin },
      });
      setValidatedPin(true);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSubmitPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      await resetPassword({
        variables: { email, newPassword },
      });
      setSuccessModal(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleModalClose = (userId?: string): void => {
    if (!userId) {
      navigate("/login");
      return;
    }
    // Redirect to login with userId as query parameter
    navigate(`/login?userId=${encodeURIComponent(userId)}`);
  };

  return {
    email,
    setEmail,
    newPassword,
    setNewPassword,
    pin,
    setPin,
    validatedPin,
    successModal,
    pinRef,
    passwordRef,
    handleValidatePIN,
    handleSubmitPassword,
    handleModalClose,
    user,
    userId,
  };
};
