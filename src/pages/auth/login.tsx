import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../../components/LoginForm";
import { login } from "../../api/login";
import { LoginRequest } from "../../types/loginTypes";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (
    email: string,
    password: string,
    googleId?: string,
    appleId?: string
  ) => {
    setLoading(true);
    setError("");

    try {
      const loginData: LoginRequest = { email, password, googleId, appleId };
      console.log("Login data:", loginData);
      const response = await login(loginData);

      if (response.status === 200) {
        localStorage.setItem("auth_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        navigate("/dashboard");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoginComponent onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
};

export default LoginPage;
