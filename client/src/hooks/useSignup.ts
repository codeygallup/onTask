import { useState } from "react";
import type { LoginFormData } from "../types";
import { ADD_USER } from "../utils/mutations";
import { useMutation } from "@apollo/client/react";

export const useSignup = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    email: "",
    password: "",
  });

  const [addUser] = useMutation(ADD_USER);

  return { formData, setFormData, addUser };
};
