import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";
import { useToast } from "../context/ToastContext";
import { Building2, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password.trim()) {
            toast.warning("Please enter your email and password");
            return;
        }

        try {
            setLoading(true);

            const result = await apiRequest("/api/login", {
                method: "POST",
                body: JSON.stringify(formData)
            });

            localStorage.setItem("token", result.token);
            localStorage.setItem(
                "user",
                JSON.stringify(result.data)
            );

            toast.success(`Welcome ${result.data?.first_name || "User"}!`);
            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-portal-card">
                <div className="login-brand-header">
                    <div className="login-logo-icon">
                        <Building2 size={28} />
                    </div>
                    <h1>CSP Core Banking</h1>
                    <p>Cash Management & Multi-Bank Operations</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-input-group">
                        <label htmlFor="email">Work Email</label>
                        <div className="login-input-wrapper">
                            <Mail size={18} className="login-input-icon" />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@branch.csp"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="login-input-group">
                        <label htmlFor="password">Security Password</label>
                        <div className="login-input-wrapper">
                            <Lock size={18} className="login-input-icon" />
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary login-submit-btn"
                        disabled={loading}
                    >
                        <span>{loading ? "Authenticating..." : "Authorize Sign In"}</span>
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="login-security-notice">
                    <ShieldCheck size={18} style={{ color: "#16a34a", flexShrink: 0 }} />
                    <span>256-bit TLS encrypted session. Authorized CSP staff only.</span>
                </div>
            </div>
        </div>
    );
};

export default Login;