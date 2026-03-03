// components/UserDropdown.jsx - FIXED LOGOUT VERSION
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log("🔴 Logging out...");

    // Clear ALL authentication data
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    // Clear session storage too
    sessionStorage.clear();

    // Force a state reset
    setIsOpen(false);

    // Use window.location.href for absolute redirect
    console.log("🔄 Redirecting to login...");
    window.location.href = "/login";

    // Alternative: Force a complete page reload
    // window.location.reload();
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "50%",
          width: "45px",
          height: "45px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(155, 92, 255, 0.3)";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(255, 255, 255, 0.1)";
          e.target.style.transform = "scale(1)";
        }}
      >
        ⋮
      </button>

      {isOpen && (
        <div style={{
          position: "absolute",
          top: "50px",
          right: "0",
          background: "rgba(15, 15, 26, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
          minWidth: "220px",
          zIndex: 1000,
          border: "1px solid rgba(155, 92, 255, 0.2)",
          overflow: "hidden"
        }}>
          <div style={{
            padding: "20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}>
            <p style={{
              margin: "0 0 5px 0",
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.6)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Logged in as
            </p>
            <p style={{
              margin: "0",
              fontSize: "16px",
              fontWeight: "600",
              color: "white"
            }}>
              {user.email || user.username || "User"}
            </p>
            <p style={{
              margin: "8px 0 0 0",
              fontSize: "12px",
              color: "#9b5cff",
              fontWeight: "500",
              background: "rgba(155, 92, 255, 0.1)",
              padding: "4px 8px",
              borderRadius: "4px",
              display: "inline-block"
            }}>
              {user.role === "company" ? "Company Account" : "User Account"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "15px 20px",
              border: "none",
              background: "none",
              textAlign: "left",
              cursor: "pointer",
              color: "#ff6b6b",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(255, 107, 107, 0.1)"}
            onMouseLeave={(e) => e.target.style.background = "none"}
          >
            <span style={{ fontSize: "18px" }}>⎋</span>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;