import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../../components/LoginForm";
import { login } from "../../api/login";
import { LoginRequest } from "../../types/loginTypes";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle Google login
  const handleGoogleLogin = async (googleCredential: string) => {
    setLoading(true);
    setError("");

    try {
      const loginData: LoginRequest = {
        googleId: googleCredential,
      };

      console.log("Attempting Google login with credential");
      const response = await login(loginData);

      if (response.status === 200) {
        console.group("Successful Google Login");
        console.log("User Logged In:", response.data.name);
        console.log("Login Method: Google");
        console.log("Login Timestamp:", new Date().toISOString());
        console.groupEnd();

        // Navigate after successful login
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Google login failed. Please try again."
      );
      console.error("Google Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <LoginComponent
        loading={loading}
        error={error}
        onGoogleLogin={handleGoogleLogin}
      />
    </div>
  );
};

export default LoginPage;
