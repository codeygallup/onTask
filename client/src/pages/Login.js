import { useState } from "react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    console.log(email, password);
  };

  return (
    <form className="login text-center" onSubmit={handleSubmit}>
      <h3 className="mb-5">Login</h3>
      <label className="mx-3">Email:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label className="mx-3">Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="mb-4"
      />
      <br />
      <button className="btn">Login</button>
    </form>
  );
};

export default Login;
