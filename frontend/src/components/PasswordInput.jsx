import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Fi = Feather Icons (clean outline style)

export default function PasswordInput({ value, onChange, placeholder = "Password" }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="password-input-wrapper" style={{ position: "relative" }}>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          paddingRight: "2.5rem",
          borderRadius: "0.5rem",
          border: "1px solid #555",
          background: "#333",
          color: "#fff",
          boxSizing: "border-box"
        }}
      />
      <span
        onClick={togglePassword}
        style={{
          position: "absolute",
          right: "0.75rem",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          color: "#9ca3af", // That clean gray color
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "none"
        }}
      >
        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </span>
    </div>
  );
}