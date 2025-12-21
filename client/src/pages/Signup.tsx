import { useState } from "react";
import type { LoginFormData } from "../types";
import { useMutation } from "@apollo/client/react";
import { ADD_USER } from "../utils/mutations";
import LoginForm from "../components/LoginForm";

const Signup = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    email: "",
    password: "",
  });

  const [addUser] = useMutation(ADD_USER);

  return (
    <div className="login">
      <LoginForm
        title="Sign Up"
        formData={formData}
        setFormData={setFormData}
        handleSub={addUser}
        authData="addUser"
      />
    </div>
  );
};

export default Signup;
