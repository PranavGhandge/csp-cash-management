import { useEffect, useState, useCallback } from "react";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
    Landmark,
    Building2,
    Hash,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Sparkles,
    RefreshCw
} from "lucide-react";
import "./BankManagement.css";

const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const BankManagement = () => {
    const toast = useToast();

    const [formData, setFormData] = useState({
        bank_name: "",
        csp_id: ""
    });

    const [errors, setErrors] = useState({
        bank_name: "",
        csp_id: ""
    });

    const [touched, setTouched] = useState({
        bank_name: false,
        csp_id: false
    });

    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const validateField = (name, value) => {
        switch (name) {
            case "bank_name":
                if (!value.trim()) return "Bank name is required";
                if (value.trim().length < 2) return "Bank name must be at least 2 characters";
                return "";
            case "csp_id":
                if (!value.trim()) return "CSP ID is required";
                if (value.trim().length < 3) return "CSP ID must be at least 3 characters";
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
            bank_name: validateField("bank_name", formData.bank_name),
            csp_id: validateField("csp_id", formData.csp_id)
        };

        setErrors(newErrors);
        setTouched({
            bank_name: true,
            csp_id: true
        });

        return newErrors;
    };

    const fetchBanks = useCallback(async () => {
        try {
            setFetching(true);
            const result = await apiRequest("/api/bank");
            setBanks(result?.data || []);
        } catch (err) {
            console.error("Fetch banks error:", err);
            toast.error(err.message || "Failed to load bank accounts.");
        } finally {
            setFetching(false);
        }
    }, [toast]);

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

            const result = await apiRequest("/api/bank", {
                method: "POST",
                body: JSON.stringify({
                    bank_name: formData.bank_name.trim(),
                    csp_id: formData.csp_id.trim()
                })
            });

            toast.success(result?.message || "Bank account registered successfully! ");

            setFormData({
                bank_name: "",
                csp_id: ""
            });

            setTouched({
                bank_name: false,
                csp_id: false
            });

            setErrors({
                bank_name: "",
                csp_id: ""
            });

            await fetchBanks();

        } catch (err) {
            console.error("Create bank error:", err);
            toast.error(err.message || "Failed to register bank account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    return (
        <div className="bank-page-container">
            {/* Page Header with Logo Badge */}
            <div className="bank-page-header">
                <div className="bank-header-logo-badge">
                    <Landmark size={24} />
                </div>
                <div className="bank-header-titles">
                    <h1>Bank Management</h1>
                </div>
            </div>

            {/* Create Bank Form Card */}
            <div className="bank-dark-card">
                {/* Card Header */}
                <div className="bank-card-header">
                    <div className="bank-card-icon-box">
                        <Building2 size={20} />
                    </div>
                    <div className="bank-card-title-group">
                        <h2>Add Bank</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="bank-form">
                    <div className="bank-fields-grid">
                        {/* Bank Name */}
                        <div className="bank-form-group">
                            <label htmlFor="bank_name">
                                Bank Name <span className="bank-req-star">*</span>
                            </label>
                            <div className={`bank-field-box ${touched.bank_name && errors.bank_name ? "has-error" : ""} ${touched.bank_name && !errors.bank_name && formData.bank_name ? "is-valid" : ""}`}>
                                <Landmark size={16} className="bank-field-icon" />
                                <input
                                    id="bank_name"
                                    type="text"
                                    name="bank_name"
                                    className="bank-real-input"
                                    value={formData.bank_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. State Bank of India (SBI)"
                                    autoComplete="off"
                                />
                                {touched.bank_name && !errors.bank_name && formData.bank_name && (
                                    <CheckCircle2 size={16} className="bank-check-icon" />
                                )}
                            </div>
                            {touched.bank_name && errors.bank_name && (
                                <div className="bank-error-text">
                                    <AlertCircle size={12} />
                                    <span>{errors.bank_name}</span>
                                </div>
                            )}
                        </div>

                        {/* CSP ID */}
                        <div className="bank-form-group">
                            <label htmlFor="csp_id">
                                CSP ID <span className="bank-req-star">*</span>
                            </label>
                            <div className={`bank-field-box ${touched.csp_id && errors.csp_id ? "has-error" : ""} ${touched.csp_id && !errors.csp_id && formData.csp_id ? "is-valid" : ""}`}>
                                <Hash size={16} className="bank-field-icon" />
                                <input
                                    id="csp_id"
                                    type="text"
                                    name="csp_id"
                                    className="bank-real-input"
                                    value={formData.csp_id}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. CSP987654"
                                    autoComplete="off"
                                />
                                {touched.csp_id && !errors.csp_id && formData.csp_id && (
                                    <CheckCircle2 size={16} className="bank-check-icon" />
                                )}
                            </div>
                            {touched.csp_id && errors.csp_id && (
                                <div className="bank-error-text">
                                    <AlertCircle size={12} />
                                    <span>{errors.csp_id}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="bank-actions-wrap">
                        <button
                            type="submit"
                            className="bank-btn-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={17} className="bank-spin-icon" />
                                    <span>Adding Bank Account...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    <span>Add Bank</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Registered Bank List Card */}
            <div className="bank-dark-card">
                <div className="bank-card-header">
                    <div className="bank-card-icon-box">
                        <Landmark size={20} />
                    </div>
                    <div className="bank-card-title-group bank-header-flex">
                        <h2>Registered Banks</h2>
                        <span className="bank-count-pill">
                            {banks.length} {banks.length === 1 ? "Bank Connected" : "Banks Connected"}
                        </span>
                    </div>
                </div>

                {fetching ? (
                    <div className="bank-loading-box">
                        <RefreshCw size={20} className="bank-spin-icon" />
                        <span>Loading registered bank accounts...</span>
                    </div>
                ) : banks.length === 0 ? (
                    <div className="bank-empty-state">
                        <Building2 size={32} style={{ color: "#475569", marginBottom: "8px" }} />
                        <p>No bank accounts connected yet.</p>
                        <span>Use the form above to connect your first CSP bank account.</span>
                    </div>
                ) : (
                    <div className="bank-records-grid">
                        {banks.map((bank) => (
                            <div className="bank-record-item" key={bank.id}>
                                <div className="bank-item-left">
                                    <div className="bank-item-icon">
                                        <Building2 size={18} />
                                    </div>
                                    <div className="bank-item-meta">
                                        <h3>{bank.bank_name}</h3>
                                        <div className="bank-csp-tag">
                                            <span>CSP ID:</span>
                                            <strong>{bank.csp_id}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="bank-item-balance">
                                    <span className="balance-label">Online Balance</span>
                                    <strong className="balance-value">
                                        ₹{formatAmount(bank.online_balance)}
                                    </strong>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BankManagement;