import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("access_token");

  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
