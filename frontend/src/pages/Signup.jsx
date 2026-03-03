import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";
import PasswordInput from "../components/PasswordInput";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("auth/register/", {
        email,
        password,
        user_type: userType,
      });

      setError("");

      // Auto-login after signup
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      const userData = {
        id: res.data.user.id,
        email: res.data.user.email,
        role: res.data.user.user_type,
        username: res.data.user.username,
        user_type: res.data.user.user_type
      };
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect to appropriate dashboard
      if (res.data.user.user_type === "company") {
        navigate("/dashboard/company");
      } else {
        navigate("/dashboard/user");
      }

    } catch (err) {
      let errorMessage = "Signup failed. Please try again.";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.email) {
        errorMessage = `Email error: ${err.response.data.email}`;
      } else if (err.response?.data?.password) {
        errorMessage = `Password error: ${Array.isArray(err.response.data.password) 
          ? err.response.data.password.join(', ') 
          : err.response.data.password}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Sign up to get started</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              disabled={loading}
            />
          </div>

          {/* Account Type Selection */}
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <div className="account-type-selector">
              <div
                className={`account-type-option ${userType === "user" ? "selected" : ""}`}
                onClick={() => !loading && setUserType("user")}
              >
                <div className="account-type-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="account-type-content">
                  <div className="account-type-title">Job Seeker</div>
                  <div className="account-type-description">Looking for job opportunities</div>
                </div>
                {userType === "user" && (
                  <div className="account-type-check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>

              <div
                className={`account-type-option ${userType === "company" ? "selected" : ""}`}
                onClick={() => !loading && setUserType("company")}
              >
                <div className="account-type-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div className="account-type-content">
                  <div className="account-type-title">Employer</div>
                  <div className="account-type-description">Hiring talent for your company</div>
                </div>
                {userType === "company" && (
                  <div className="account-type-check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn primary full"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;