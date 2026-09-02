import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.post(
        `${API_URL}/api/createuser`,
        formData
      );

      console.log(response.data);

      console.log(response.data);

      // Signup successful → Login page
      navigate("/login", {
        state: {
          message: "Signup successful! Please login.",
        },
      });

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>First Name</label>

            <input
              type="text"
              name="first_name"
              placeholder="Enter first name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>

            <input
              type="text"
              name="last_name"
              placeholder="Enter last name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="signup-btn"
          >
            Signup
          </button>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button
            type="button"
            className="switch-btn"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Signup;