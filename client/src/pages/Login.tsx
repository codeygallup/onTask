import LoginForm from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const { formData, setFormData, userIdParam, loginUser } = useLogin();

  return (
    <LoginForm
      title="Login"
      formData={formData}
      setFormData={setFormData}
      handleSub={loginUser}
      authData="loginUser"
      userIdParam={userIdParam}
    />
  );
};

export default Login;
