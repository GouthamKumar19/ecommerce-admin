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

      const response = await login(loginData);

      if (response.status === 200) {
        // Log successful login details
        console.group("Successful Login");
        console.log("User Logged In:", response.data.name);
        console.log("Login Timestamp:", new Date().toISOString());
        console.groupEnd();

        // Store user details in localStorage for potential use
        localStorage.setItem("user_id", response.data._id);
        localStorage.setItem("user_name", response.data.name);
        localStorage.setItem("user_email", response.data.email);
        localStorage.setItem("user_role", response.data.role);

        // Store tokens
        localStorage.setItem("auth_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem(
          "token_expires_at",
          response.data.refreshExpiresAt
        );

        navigate("/dashboard");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (googleCredential: string) => {
    setLoading(true);
    setError("");

    try {
      const loginData: LoginRequest = {
        email: "",
        password: "",
        googleId: googleCredential,
      };

      const response = await login(loginData);

      if (response.status === 200) {
        // Log successful Google login details
        console.group("Successful Google Login");
        console.log("User Logged In:", response.data.name);
        console.log("Login Method: Google");
        console.log("Login Timestamp:", new Date().toISOString());
        console.groupEnd();

        // Store user details in localStorage
        localStorage.setItem("user_id", response.data._id);
        localStorage.setItem("user_name", response.data.name);
        localStorage.setItem("user_email", response.data.email);
        localStorage.setItem("user_role", response.data.role);

        // Store tokens
        localStorage.setItem("auth_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem(
          "token_expires_at",
          response.data.refreshExpiresAt
        );

        navigate("/dashboard");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Google login failed. Please try again.");
      console.error("Google Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoginComponent
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        onGoogleLogin={handleGoogleLogin}
      />
    </div>
  );
};

export default LoginPage;
