import { useEffect, useRef, useState } from "react";
import Auth from "../utils/auth";

export const useLoginForm = ({
  title,
  formData,
  setFormData,
  handleSub,
  authData,
  userIdParam,
}: {
  title: string;
  formData: any;
  setFormData: any;
  handleSub: any;
  authData: string;
  userIdParam: string | null;
}) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    // Focus the appropriate input field on mount
    if (title === "Login") {
      if (userIdParam) {
        passwordRef.current?.focus();
      } else {
        emailRef.current?.focus();
      }
    } else {
      usernameRef.current?.focus();
    }
  }, [title, userIdParam]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      const { data } = await handleSub({
        variables: { ...formData, password },
      });
      authData === "loginUser"
        ? Auth.login(data.loginUser.token)
        : Auth.login(data.addUser.token);
    } catch (err: any) {
      console.error(err);

      let errorMsg = "Something went wrong. Please try again.";

      // Parse error message if it's a JSON string
      if (err.message && typeof err.message === "string") {
        try {
          const parsed = JSON.parse(err.message);
          // Check if parsed is an array of errors with message property
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].message) {
            // Join all error messages into a list
            errorMsg = parsed.map((e: any) => `\n• ${e.message}`).join("\n");
          } else {
            // Fallback to original message if structure is unexpected
            errorMsg = err.message;
          }
        } catch {
          // If parsing fails, use the original message
          errorMsg = err.message;
        }
        // GraphQL errors
      } else if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        errorMsg = err.graphQLErrors[0].message;
        // Network error
      } else if (err.networkError) {
        errorMsg = "Network error. Please check your connection.";
      }

      setErrorMsg(errorMsg);
      setErrorModalOpen(true);
    }
  };

  return {
    handleFormChange,
    handleSubmit,
    emailRef,
    usernameRef,
    passwordRef,
    password,
    setPassword,
    errorModalOpen,
    setErrorModalOpen,
    errorMsg,
    setErrorMsg,
  };
};
