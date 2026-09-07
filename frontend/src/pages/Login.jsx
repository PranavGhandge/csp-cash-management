import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";
import { useToast } from "../context/ToastContext";
import {
    Building2, Mail, Lock, ShieldCheck, ArrowRight,
    Loader2, Eye, EyeOff, Landmark, TrendingUp, Users
} from "lucide-react";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            localStorage.setItem("user", JSON.stringify(result.data));
            toast.success(`Welcome back, ${result.data?.first_name || "User"}!`);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lgn-root">
            {/* Animated background orbs */}
            <div className="lgn-orb lgn-orb-1" />
            <div className="lgn-orb lgn-orb-2" />
            <div className="lgn-orb lgn-orb-3" />

            {/* Grid overlay */}
            <div className="lgn-grid-overlay" />

            <div className="lgn-wrapper">
                {/* LEFT PANEL */}
                <div className="lgn-left-panel">
                    {/* Top Brand */}
                    <div className="lgn-brand-mark">
                        <div className="lgn-brand-icon">
                            <Building2 size={24} />
                        </div>
                        <div className="lgn-brand-info">
                            <span className="lgn-brand-name">CSP Core Banking</span>
                            <span className="lgn-brand-tag">Enterprise Portal</span>
                        </div>
                    </div>

                    {/* Middle Info & Feature Cards */}
                    <div className="lgn-left-main">
                        <div className="lgn-left-headline">
                            <h2>Secure. Fast.<br />Reliable.</h2>
                            <p>Enterprise-grade cash management platform for CSP operators and administrators.</p>
                        </div>

                        <div className="lgn-stats-list">
                            <div className="lgn-stat-item">
                                <div className="lgn-stat-icon">
                                    <Landmark size={18} />
                                </div>
                                <div className="lgn-stat-text">
                                    <strong>Multi-Bank Operations</strong>
                                    <span>Manage & reconcile across multiple branch accounts</span>
                                </div>
                            </div>
                            <div className="lgn-stat-item">
                                <div className="lgn-stat-icon">
                                    <TrendingUp size={18} />
                                </div>
                                <div className="lgn-stat-text">
                                    <strong>Real-time Tracking</strong>
                                    <span>Live transaction monitoring & physical cash audit</span>
                                </div>
                            </div>
                            <div className="lgn-stat-item">
                                <div className="lgn-stat-icon">
                                    <Users size={18} />
                                </div>
                                <div className="lgn-stat-text">
                                    <strong>Role-based Access</strong>
                                    <span>Granular admin & operator permissions</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Security Badge */}
                    <div className="lgn-left-badge">
                        <ShieldCheck size={14} />
                        <span>256-bit TLS encrypted · Authorized CSP staff only</span>
                    </div>
                </div>

                {/* RIGHT PANEL — login form */}
                <div className="lgn-right-panel">
                    <div className="lgn-card">
                        {/* Card glow border top */}
                        <div className="lgn-card-glow-bar" />

                        <div className="lgn-card-header">
                            <div className="lgn-card-logo">
                                <Building2 size={22} />
                            </div>
                            <div>
                                <h1 className="lgn-card-title">Welcome back</h1>
                                <p className="lgn-card-subtitle">Sign in to your CSP portal</p>
                            </div>
                        </div>

                        <form className="lgn-form" onSubmit={handleSubmit} noValidate>
                            {/* Email */}
                            <div className="lgn-field-group">
                                <label className="lgn-label" htmlFor="email">
                                    Work Email
                                </label>
                                <div className="lgn-input-box">
                                    <Mail size={16} className="lgn-field-icon" />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        className="lgn-input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@branch.csp"
                                        required
                                        autoFocus
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="lgn-field-group">
                                <label className="lgn-label" htmlFor="password">
                                    Security Password
                                </label>
                                <div className="lgn-input-box">
                                    <Lock size={16} className="lgn-field-icon" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="lgn-input"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="lgn-eye-btn"
                                        onClick={() => setShowPassword((p) => !p)}
                                        tabIndex={-1}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="lgn-submit-btn"
                                id="login-submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={17} className="lgn-spin" />
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Authorize Sign In</span>
                                        <ArrowRight size={17} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="lgn-security-row">
                            <ShieldCheck size={13} className="lgn-shield-icon" />
                            <span>Secured with 256-bit TLS encryption</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;