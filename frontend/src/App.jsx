// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "./components/DashboardLayout";
import UserDashboard from "./pages/UserDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Get user info from localStorage
  const [user] = useState(() => {  // Removed setUser since not used
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Error parsing user:", e);
      return null;
    }
  });

  // DEBUG: Log user info
  useEffect(() => {
    console.log("App.jsx - Current user:", user);
    console.log("App.jsx - User role/user_type:", user?.role || user?.user_type);
  }, [user]);

  // FIXED: Support both role and user_type
  const userRole = user?.role || user?.user_type;

  // Protected route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      console.log("No user, redirecting to login");
      return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      console.log(`User role '${userRole}' not allowed, redirecting to appropriate dashboard`);
      // Redirect to their own dashboard
      return <Navigate to={`/dashboard/${userRole}`} />;
    }

    return children;
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <Router>
        <Routes>
          {/* Auth Routes - Redirect if already logged in */}
          <Route
            path="/login"
            element={user ? <Navigate to={`/dashboard/${userRole}`} /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to={`/dashboard/${userRole}`} /> : <Signup />}
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode} userRole={userRole}>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <UserDashboard />
                  </motion.div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/company"
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode} userRole={userRole}>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CompanyDashboard />
                  </motion.div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect /dashboard to correct role */}
          <Route
            path="/dashboard"
            element={
              user ?
                <Navigate to={`/dashboard/${userRole}`} /> :
                <Navigate to="/login" />
            }
          />

          {/* Root path redirect */}
          <Route
            path="/"
            element={
              user ?
                <Navigate to={`/dashboard/${userRole}`} /> :
                <Navigate to="/login" />
            }
          />

          {/* Catch-all redirect */}
          <Route
            path="*"
            element={
              user ?
                <Navigate to={`/dashboard/${userRole}`} /> :
                <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;