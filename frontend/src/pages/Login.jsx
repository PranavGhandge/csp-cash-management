import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState(
        location.state?.message || ""
    );

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const API_URL = import.meta.env.VITE_API_URL;

            const response = await axios.post(
                `${API_URL}/api/login`,
                formData
            );

            console.log(response.data);

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.data)
            );

            setMessage("Login successful!");

            // Dashboard ला redirect
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <h2>Welcome Back</h2>

                <form onSubmit={handleSubmit}>

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
                        className="login-btn"
                    >
                        Login
                    </button>

                    {message && (
                        <p className="success-message">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <button
                        type="button"
                        className="switch-btn"
                        onClick={() => navigate("/signup")}
                    >
                        Don't have an account? Signup
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Login;