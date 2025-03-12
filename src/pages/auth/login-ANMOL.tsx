import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../../components/LoginForm";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      if (email && password) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        localStorage.setItem("auth_token", "demo_token");

        navigate("/dashboard");
      } else {
        setError("Please enter both email and password");
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
