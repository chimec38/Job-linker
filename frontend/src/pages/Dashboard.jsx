import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("auth/me/")
      .then((res) => {
        if (res.data.user_type === "company") {
          navigate("/company");
        } else {
          navigate("/user");
        }
      })
      .catch(() => {
        localStorage.clear();
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return null;
}

export default Dashboard;
