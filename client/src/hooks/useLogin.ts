import { useMutation, useQuery } from "@apollo/client/react";
import { useLocation } from "react-router-dom";
import type { FindUserData, LoginFormData } from "../types";
import { FIND_USER } from "../utils/queries";
import { useEffect, useState } from "react";
import { LOGIN } from "../utils/mutations";

export const useLogin = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userIdParam = params.get("userId") || "";

  const { data } = useQuery<FindUserData>(FIND_USER, {
    variables: { id: userIdParam },
    skip: !userIdParam,
  });

  const user = data?.findUser?.email || "";

  const [formData, setFormData] = useState<LoginFormData>({
    email: user ?? "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        email: user,
      }));
    }
  }, [user]);

  const [loginUser] = useMutation(LOGIN);

  return { formData, setFormData, userIdParam, loginUser };
};
