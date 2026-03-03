import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";
import PasswordInput from "../components/PasswordInput";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log(" Login attempt...");

      // Send login request to your Django backend
      const res = await api.post("auth/login/", {
        email,
        password,
      });

      console.log("Login successful!");
      console.log("User type from backend:", res.data.user.user_type);

      // Clear any old data first (Chrome fix)
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

      // Save JWT tokens to localStorage
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // Save user data
      const userData = {
        id: res.data.user.id,
        email: res.data.user.email,
        role: res.data.user.user_type, // Map user_type to role
        username: res.data.user.username,
        user_type: res.data.user.user_type // Keep original for reference
      };
      localStorage.setItem("user", JSON.stringify(userData));

      console.log(" Saved to localStorage:", userData);

      setError(""); // clear any previous errors

      // CHROME FIX: Detect browser and use appropriate redirect method
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      console.log(" Browser is Chrome?", isChrome);

      const targetPath = res.data.user.user_type === "company"
        ? "/dashboard/company"
        : "/dashboard/user";

      console.log(" Redirecting to:", targetPath);

      if (isChrome) {
        // Chrome often has issues with React Router navigate()
        // Force a full page reload for Chrome
        window.location.href = targetPath;
      } else {
        // Use navigate() for other browsers
        navigate(targetPath);
      }

    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response?.data);

      let errorMessage = "Invalid email or password";

      // More specific error messages
      if (err.response?.status === 400) {
        errorMessage = err.response.data?.error || "Invalid credentials";
      } else if (err.response?.status === 401) {
        errorMessage = "Unauthorized access";
      } else if (!err.response) {
        errorMessage = "Cannot connect to server. Please check if backend is running.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Login to continue</p>

        {error && (
          <div className="error" style={{
            color: 'red',
            padding: '10px',
            marginBottom: '15px',
            background: '#ffebee',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading}
          />

          <button
            type="submit"
            className="btn primary full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;