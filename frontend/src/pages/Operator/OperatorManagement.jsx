import { useState } from "react";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
    Users,
    UserPlus,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Sparkles
} from "lucide-react";
import "./OperatorManagement.css";

const OperatorManagement = () => {
    const toast = useToast();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    });

    const [touched, setTouched] = useState({
        first_name: false,
        last_name: false,
        email: false,
        password: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateField = (name, value) => {
        switch (name) {
            case "first_name":
                if (!value.trim()) return "First name is required";
                if (value.trim().length < 2) return "Must be at least 2 characters";
                if (!/^[A-Za-z\s]+$/.test(value.trim())) return "Only letters are allowed";
                return "";
            case "last_name":
                if (!value.trim()) return "Last name is required";
                if (value.trim().length < 1) return "Must be at least 1 character";
                if (!/^[A-Za-z\s]+$/.test(value.trim())) return "Only letters are allowed";
                return "";
            case "email":
                if (!value.trim()) return "Email address is required";
                if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())) {
                    return "Please enter a valid email address";
                }
                return "";
            case "password":
                if (!value) return "Password is required";
                if (value.length < 6) return "Password must be at least 6 characters";
                return "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (touched[name]) {
            const err = validateField(name, value);
            setErrors((prev) => ({
                ...prev,
                [name]: err
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true
        }));

        const err = validateField(name, value);
        setErrors((prev) => ({
            ...prev,
            [name]: err
        }));
    };

    const validateAll = () => {
        const newErrors = {
            first_name: validateField("first_name", formData.first_name),
            last_name: validateField("last_name", formData.last_name),
            email: validateField("email", formData.email),
            password: validateField("password", formData.password)
        };

        setErrors(newErrors);
        setTouched({
            first_name: true,
            last_name: true,
            email: true,
            password: true
        });

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateAll();
        const firstErrorKey = Object.keys(formErrors).find((k) => formErrors[k] !== "");

        if (firstErrorKey) {
            toast.error(formErrors[firstErrorKey]);
            return;
        }

        try {
            setLoading(true);

            const result = await apiRequest("/api/operator", {
                method: "POST",
                body: JSON.stringify({
                    first_name: formData.first_name.trim(),
                    last_name: formData.last_name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password
                })
            });

            toast.success(result?.message || "Operator account created successfully! 🎉");

            // Reset form
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                password: ""
            });

            setTouched({
                first_name: false,
                last_name: false,
                email: false,
                password: false
            });

            setErrors({
                first_name: "",
                last_name: "",
                email: "",
                password: ""
            });

        } catch (err) {
            console.error("Create operator error:", err);
            toast.error(err.message || "Failed to create operator. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="operator-page-container">
            {/* Page Header with Logo Badge */}
            <div className="operator-page-header">
                <div className="operator-header-logo-badge">
                    <Users size={24} />
                </div>
                <div className="operator-header-titles">
                    <h1>Operator Management</h1>
                </div>
            </div>

            {/* Form Card */}
            <div className="operator-dark-card">
                {/* Card Header */}
                <div className="operator-card-header">
                    <div className="operator-card-icon-box">
                        <UserPlus size={20} />
                    </div>
                    <div className="operator-card-title-group">
                        <h2>Create Operator</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="operator-form">
                    {/* First Name & Last Name */}
                    <div className="operator-fields-grid">
                        <div className="operator-form-group">
                            <label htmlFor="op_first_name">
                                First Name <span className="op-req-star">*</span>
                            </label>
                            <div className={`operator-field-box ${touched.first_name && errors.first_name ? "has-error" : ""} ${touched.first_name && !errors.first_name && formData.first_name ? "is-valid" : ""}`}>
                                <User size={16} className="operator-field-icon" />
                                <input
                                    id="op_first_name"
                                    type="text"
                                    name="first_name"
                                    className="operator-real-input"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. Rahul"
                                    autoComplete="off"
                                />
                                {touched.first_name && !errors.first_name && formData.first_name && (
                                    <CheckCircle2 size={16} className="operator-check-icon" />
                                )}
                            </div>
                            {touched.first_name && errors.first_name && (
                                <div className="operator-error-text">
                                    <AlertCircle size={12} />
                                    <span>{errors.first_name}</span>
                                </div>
                            )}
                        </div>

                        <div className="operator-form-group">
                            <label htmlFor="op_last_name">
                                Last Name <span className="op-req-star">*</span>
                            </label>
                            <div className={`operator-field-box ${touched.last_name && errors.last_name ? "has-error" : ""} ${touched.last_name && !errors.last_name && formData.last_name ? "is-valid" : ""}`}>
                                <User size={16} className="operator-field-icon" />
                                <input
                                    id="op_last_name"
                                    type="text"
                                    name="last_name"
                                    className="operator-real-input"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. Sharma"
                                    autoComplete="off"
                                />
                                {touched.last_name && !errors.last_name && formData.last_name && (
                                    <CheckCircle2 size={16} className="operator-check-icon" />
                                )}
                            </div>
                            {touched.last_name && errors.last_name && (
                                <div className="operator-error-text">
                                    <AlertCircle size={12} />
                                    <span>{errors.last_name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="operator-form-group">
                        <label htmlFor="op_email">
                            Email Address <span className="op-req-star">*</span>
                        </label>
                        <div className={`operator-field-box ${touched.email && errors.email ? "has-error" : ""} ${touched.email && !errors.email && formData.email ? "is-valid" : ""}`}>
                            <Mail size={16} className="operator-field-icon" />
                            <input
                                id="op_email"
                                type="email"
                                name="email"
                                className="operator-real-input"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="operator@csp.bank.in"
                                autoComplete="off"
                            />
                            {touched.email && !errors.email && formData.email && (
                                <CheckCircle2 size={16} className="operator-check-icon" />
                            )}
                        </div>
                        {touched.email && errors.email && (
                            <div className="operator-error-text">
                                <AlertCircle size={12} />
                                <span>{errors.email}</span>
                            </div>
                        )}
                    </div>

                    {/* Password */}
                    <div className="operator-form-group">
                        <label htmlFor="op_password">
                            Password <span className="op-req-star">*</span>
                        </label>
                        <div className={`operator-field-box ${touched.password && errors.password ? "has-error" : ""} ${touched.password && !errors.password && formData.password ? "is-valid" : ""}`}>
                            <Lock size={16} className="operator-field-icon" />
                            <input
                                id="op_password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="operator-real-input"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter secure password (min 6 characters)"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="operator-eye-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {touched.password && errors.password ? (
                            <div className="operator-error-text">
                                <AlertCircle size={12} />
                                <span>{errors.password}</span>
                            </div>
                        ) : (
                            <span className="operator-field-hint">
                                Must be at least 6 characters.
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="operator-actions-wrap">
                        <button
                            type="submit"
                            className="operator-btn-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={17} className="operator-spin-icon" />
                                    <span>Creating Operator...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    <span>Create Operator</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OperatorManagement;