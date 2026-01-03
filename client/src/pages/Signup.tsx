import LoginForm from "../components/LoginForm";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const { addUser, formData, setFormData } = useSignup();

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
