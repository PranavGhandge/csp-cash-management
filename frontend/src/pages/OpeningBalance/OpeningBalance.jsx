import { useEffect, useState, useCallback } from "react";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
    Wallet,
    Landmark,
    Building2,
    Coins,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Sparkles,
    RefreshCw,
    Lock
} from "lucide-react";
import "./OpeningBalance.css";

const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const getTodayDateStr = () => {
    const now = new Date();
    const yr = now.getFullYear();
    const mo = String(now.getMonth() + 1).padStart(2, "0");
    const dy = String(now.getDate()).padStart(2, "0");
    return `${yr}-${mo}-${dy}`;
};

const OpeningBalance = () => {
    const toast = useToast();

    const [todayDate, setTodayDate] = useState(getTodayDateStr());
    const [banks, setBanks] = useState([]);
    const [completedBankIds, setCompletedBankIds] = useState([]);

    const [formData, setFormData] = useState({
        bank_id: "",
        opening_balance: ""
    });

    const [errors, setErrors] = useState({
        bank_id: "",
        opening_balance: ""
    });

    const [touched, setTouched] = useState({
        bank_id: false,
        opening_balance: false
    });

    const [loading, setLoading] = useState(false);
    const [fetchingBanks, setFetchingBanks] = useState(true);

    // Midnight 12:00 AM auto-reset checker
    useEffect(() => {
        const interval = setInterval(() => {
            const current = getTodayDateStr();
            if (current !== todayDate) {
                // Midnight crossed! Reset for new day
                setTodayDate(current);
                setCompletedBankIds([]);
                setFormData({ bank_id: "", opening_balance: "" });
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [todayDate]);

    // Load completed bank IDs for today from localStorage
    const loadCompletedBanks = useCallback((currentDate) => {
        try {
            const activeDate = currentDate || todayDate;
            const raw = localStorage.getItem("opening_balance_banks_" + activeDate);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    setCompletedBankIds(parsed.map(String));
                    return parsed.map(String);
                }
            }
        } catch (e) {
            console.error("Error reading completed banks:", e);
        }
        return [];
    }, [todayDate]);

    const fetchBanks = useCallback(async () => {
        try {
            setFetchingBanks(true);
            const result = await apiRequest("/api/bank");
            const bankList = result?.data || [];
            setBanks(bankList);
            loadCompletedBanks();
        } catch (err) {
            console.error("Fetch banks error:", err);
            toast.error(err.message || "Failed to load bank accounts.");
        } finally {
            setFetchingBanks(false);
        }
    }, [toast, loadCompletedBanks]);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    const isBankDone = (bankId) => completedBankIds.includes(String(bankId));

    const pendingBanks = banks.filter((b) => !isBankDone(b.id));
    const allBanksCompleted = banks.length > 0 && pendingBanks.length === 0;

    const validateField = (name, value) => {
        switch (name) {
            case "bank_id":
                if (!value) return "Please select a bank";
                if (isBankDone(value)) return "Opening balance for this bank is already set today";
                return "";
            case "opening_balance":
                if (value === "" || value === null || value === undefined) return "Opening balance is required";
                if (isNaN(Number(value)) || Number(value) < 0) return "Opening balance must be 0 or greater";
                return "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        if (allBanksCompleted) return;

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
        if (allBanksCompleted) return;

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
            bank_id: validateField("bank_id", formData.bank_id),
            opening_balance: validateField("opening_balance", formData.opening_balance)
        };

        setErrors(newErrors);
        setTouched({
            bank_id: true,
            opening_balance: true
        });

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (allBanksCompleted) {
            toast.error("Opening balance for all banks has already been recorded for today.");
            return;
        }

        const formErrors = validateAll();
        const firstErrorKey = Object.keys(formErrors).find((k) => formErrors[k] !== "");

        if (firstErrorKey) {
            toast.error(formErrors[firstErrorKey]);
            return;
        }

        try {
            setLoading(true);

            const submittedBankId = String(formData.bank_id);
            const selectedBank = banks.find((b) => String(b.id) === submittedBankId);
            const activeDate = getTodayDateStr();

            const result = await apiRequest("/api/opening-balance", {
                method: "POST",
                body: JSON.stringify({
                    bank_id: formData.bank_id,
                    opening_balance: Number(formData.opening_balance),
                    date: activeDate
                })
            });

            toast.success(result?.message || `Opening balance set for ${selectedBank?.bank_name || "bank"}! 🎉`);

            // Add this bank to today's completed list
            const updatedCompleted = Array.from(new Set([...completedBankIds, submittedBankId]));
            setCompletedBankIds(updatedCompleted);
            localStorage.setItem("opening_balance_banks_" + activeDate, JSON.stringify(updatedCompleted));

            setFormData({
                bank_id: "",
                opening_balance: ""
            });

            setTouched({
                bank_id: false,
                opening_balance: false
            });

            setErrors({
                bank_id: "",
                opening_balance: ""
            });

            await fetchBanks();

        } catch (err) {
            console.error("Create opening balance error:", err);
            toast.error(err.message || "Failed to set opening balance.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="opb-page-container">
            {/* Header with Logo Badge */}
            <div className="opb-page-header">
                <div className="opb-header-logo-badge">
                    <Wallet size={24} />
                </div>
                <div className="opb-header-titles">
                    <h1>Opening Balance</h1>
                </div>
            </div>

            {/* Daily Lock / Completion Banner */}
            {allBanksCompleted ? (
                <div className="opb-lock-banner">
                    <div className="opb-lock-icon-wrap">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="opb-lock-text-content">
                        <h4>Opening Balance Completed for All Banks ({todayDate})</h4>
                        <p>
                            Opening balance for all {banks.length} connected bank accounts has been recorded. Form will reset automatically at 12:00 AM midnight.
                        </p>
                    </div>
                    <div className="opb-lock-badge">
                        <Lock size={13} />
                        <span>ALL BANKS LOCKED</span>
                    </div>
                </div>
            ) : completedBankIds.length > 0 && (
                <div className="opb-progress-banner">
                    <div className="opb-prog-icon">
                        <Coins size={18} />
                    </div>
                    <div className="opb-prog-text">
                        <span>
                            <strong>{completedBankIds.length} of {banks.length}</strong> banks recorded today. ({pendingBanks.length} pending)
                        </span>
                    </div>
                </div>
            )}

            {/* Set Opening Balance Card */}
            <div className={`opb-dark-card ${allBanksCompleted ? "opb-card-locked" : ""}`}>
                <div className="opb-card-header">
                    <div className="opb-card-icon-box">
                        <Coins size={20} />
                    </div>
                    <div className="opb-card-title-group opb-header-flex">
                        <h2>Set Opening Balance</h2>
                        {!allBanksCompleted && banks.length > 0 && (
                            <span className="opb-pending-pill">
                                {pendingBanks.length} {pendingBanks.length === 1 ? "Bank Pending" : "Banks Pending"}
                            </span>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="opb-form">
                    <div className="opb-fields-grid">
                        {/* Select Bank */}
                        <div className="opb-form-group">
                            <label htmlFor="opb_bank_id">
                                Select Bank <span className="opb-req-star">*</span>
                            </label>
                            <div className={`opb-field-box ${allBanksCompleted ? "opb-field-disabled" : ""} ${touched.bank_id && errors.bank_id ? "has-error" : ""} ${touched.bank_id && !errors.bank_id && formData.bank_id ? "is-valid" : ""}`}>
                                <Landmark size={16} className="opb-field-icon" />
                                <select
                                    id="opb_bank_id"
                                    name="bank_id"
                                    className="opb-real-select"
                                    value={formData.bank_id}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={fetchingBanks || allBanksCompleted}
                                >
                                    <option value="">
                                        {fetchingBanks
                                            ? "Loading banks..."
                                            : allBanksCompleted
                                            ? "-- All Banks Completed for Today --"
                                            : "-- Select Pending Bank --"}
                                    </option>
                                    {banks.map((bank) => {
                                        const done = isBankDone(bank.id);
                                        return (
                                            <option
                                                key={bank.id}
                                                value={bank.id}
                                                disabled={done}
                                            >
                                                {bank.bank_name} - ({bank.csp_id}) {done ? "✓ (Already Set Today)" : ""}
                                            </option>
                                        );
                                    })}
                                </select>
                                {touched.bank_id && !errors.bank_id && formData.bank_id && (
                                    <CheckCircle2 size={16} className="opb-check-icon" />
                                )}
                            </div>
                            {touched.bank_id && errors.bank_id && (
                                <div className="opb-error-text">
                                    <AlertCircle size={12} />
                                    <span>{errors.bank_id}</span>
                                </div>
                            )}
                        </div>

                        {/* Opening Balance */}
                        <div className="opb-form-group">
                            <label htmlFor="opb_opening_balance">
                                Opening Balance (₹) <span className="opb-req-star">*</span>
                            </label>
                            <div className={`opb-field-box ${allBanksCompleted ? "opb-field-disabled" : ""} ${touched.opening_balance && errors.opening_balance ? "has-error" : ""} ${touched.opening_balance && !errors.opening_balance && formData.opening_balance ? "is-valid" : ""}`}>
                                <Coins size={16} className="opb-field-icon" />
                                <input
                                    id="opb_opening_balance"
                                    type="number"
                                    name="opening_balance"
                                    className="opb-real-input"
                                    value={formData.opening_balance}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={allBanksCompleted}
                                    placeholder="Enter opening balance (e.g. 50000)"
                                    min="0"
                                    step="0.01"
                                />
                                {touched.opening_balance && !errors.opening_balance && formData.opening_balance && (
                                    <CheckCircle2 size={16} className="opb-check-icon" />
                                )}
                            </div>
                            {touched.opening_balance && errors.opening_balance && (
                                <div className="opb-error-text">
                                    <AlertCircle size={12} />
                                    <span>{errors.opening_balance}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="opb-actions-wrap">
                        <button
                            type="submit"
                            className={`opb-btn-submit ${allBanksCompleted ? "disabled-locked" : ""}`}
                            disabled={loading || fetchingBanks || allBanksCompleted}
                        >
                            {allBanksCompleted ? (
                                <>
                                    <Lock size={16} />
                                    <span>All Banks Completed for Today (Locked)</span>
                                </>
                            ) : loading ? (
                                <>
                                    <Loader2 size={17} className="opb-spin-icon" />
                                    <span>Updating Opening Balance...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    <span>Set Opening Balance</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Current Bank Balances Card */}
            <div className="opb-dark-card">
                <div className="opb-card-header">
                    <div className="opb-card-icon-box">
                        <Building2 size={20} />
                    </div>
                    <div className="opb-card-title-group opb-header-flex">
                        <h2>Current Bank Balances</h2>
                        <span className="opb-count-pill">
                            {banks.length} {banks.length === 1 ? "Bank Connected" : "Banks Connected"}
                        </span>
                    </div>
                </div>

                {fetchingBanks ? (
                    <div className="opb-loading-box">
                        <RefreshCw size={20} className="opb-spin-icon" />
                        <span>Loading current balances...</span>
                    </div>
                ) : banks.length === 0 ? (
                    <div className="opb-empty-state">
                        <Building2 size={32} style={{ color: "#475569", marginBottom: "8px" }} />
                        <p>No connected bank accounts found.</p>
                        <span>Please add banks from the Bank Management page first.</span>
                    </div>
                ) : (
                    <div className="opb-records-grid">
                        {banks.map((bank) => {
                            const done = isBankDone(bank.id);
                            return (
                                <div className={`opb-record-item ${done ? "bank-item-done" : ""}`} key={bank.id}>
                                    <div className="opb-item-left">
                                        <div className={`opb-item-icon ${done ? "icon-done" : ""}`}>
                                            {done ? <CheckCircle2 size={18} /> : <Building2 size={18} />}
                                        </div>
                                        <div className="opb-item-meta">
                                            <h3>{bank.bank_name}</h3>
                                            <div className="opb-csp-tag">
                                                <span>CSP ID:</span>
                                                <strong>{bank.csp_id}</strong>
                                                {done && (
                                                    <span className="bank-done-badge">
                                                        ✓ Set Today
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="opb-item-balance">
                                        <span className="balance-label">Current Balance</span>
                                        <strong className="balance-value">
                                            ₹{formatAmount(bank.online_balance)}
                                        </strong>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpeningBalance;