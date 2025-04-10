import React, { useState, FormEvent } from "react";
import { FaApple } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

interface LoginComponentProps {
  onSubmit?: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string;
  onGoogleLogin: (googleCredential: string) => Promise<void>;
}

const LoginComponent: React.FC<LoginComponentProps> = ({
  onSubmit,

  error,
  onGoogleLogin,
}) => {
  const [email] = useState("");
  const [password] = useState("");
  // const [rememberMe, setRememberMe] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(email, password);
    } else {
      console.warn("Email/password login not implemented");
    }
  };

  const handleGoogleLoginSuccess = (response: any) => {
    console.log("Google Login Success:", response);
    // Extract the credential from the Google login response
    const googleCredential = response.credential;
    onGoogleLogin(googleCredential);
    // Note: navigation happens in the parent component after successful login
  };

  const handleGoogleLoginError = () => {
    console.error("Google Login Failed");
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm absolute top-4">
          {error}
        </div>
      )}
      <h2 className="text-center text-3xl font-bold text-[var(--secondary-color)] mb-4">
        Login here
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email field */}
        {/*
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[var(--primary-color)] focus:outline-none"
        />
        */}

        {/* Password field with toggle visibility */}
        {/*
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[var(--primary-color)] focus:outline-none pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        */}

        {/* Remember Me Checkbox */}
        {/*
        <div className="flex items-center ml-0.1">
          <label
            htmlFor="remember-me"
            className="flex items-center cursor-pointer space-x-2"
          >
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[var(--secondary-color)] checked:border-transparent focus:outline-none ml-2"
            />
            <span className="text-sm text-gray-700">Remember me</span>
          </label>
        </div>
        */}

        {/* Sign In Button */}
        {/*
        <button
          type="submit"
          disabled={loading}
          style={{ background: "var(--secondary-color)" }}
          className="w-full py-3 text-white rounded-lg hover:bg-[var(--foreground-color)] focus:outline-none"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        */}
      </form>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 mt-2">Create new account</p>
        <p className="text-sm text-[var(--secondary-color)] mt-1">
          Or continue with
        </p>
        <div className="flex justify-center space-x-4 mt-2">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
          <button
            className="bg-[var(--secondary-color)] text-white p-2 rounded-full"
            style={{ background: "var(--secondary-color)" }}
            type="button"
          >
            <FaApple />
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginComponent;
