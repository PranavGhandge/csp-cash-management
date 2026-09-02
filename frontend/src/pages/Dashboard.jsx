import { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">

        <h1>
          Welcome {user?.first_name || "Coder"} 👋
        </h1>

        <p>
          You have successfully logged in.
        </p>

      </div>
    </div>
  );
};

export default Dashboard;