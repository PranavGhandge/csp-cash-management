import { useEffect, useState, useCallback } from "react";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
    ArrowLeftRight,
    Landmark,
    User,
    ArrowDownLeft,
    ArrowUpRight,
    IndianRupee,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Sparkles,
    Coins,
    Lock,
    ShieldAlert,
    Calendar
} from "lucide-react";
import "./Transaction.css";

const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const notes = [
    { name: "note_500", label: "₹500", value: 500, color: "#34d399" },
    { name: "note_200", label: "₹200", value: 200, color: "#fb923c" },
    { name: "note_100", label: "₹100", value: 100, color: "#818cf8" },
    { name: "note_50",  label: "₹50",  value: 50,  color: "#22d3ee" },
    { name: "note_20",  label: "₹20",  value: 20,  color: "#f472b6" },
    { name: "note_10",  label: "₹10",  value: 10,  color: "#a78bfa" }
];

const isDateToday = (dateInput) => {
    if (!dateInput) return false;
    const now = new Date();
    const yr = now.getFullYear();
    const mo = String(now.getMonth() + 1).padStart(2, "0");
    const dy = String(now.getDate()).padStart(2, "0");
    const todayLocal = `${yr}-${mo}-${dy}`;

    if (typeof dateInput === "string") {
        if (dateInput.startsWith(todayLocal)) return true;
        try {
            const d = new Date(dateInput);
            if (!isNaN(d.getTime())) {
                const cYr = d.getFullYear();
                const cMo = String(d.getMonth() + 1).padStart(2, "0");
                const cDy = String(d.getDate()).padStart(2, "0");
                return `${cYr}-${cMo}-${cDy}` === todayLocal;
            }
        } catch {
            return false;
        }
    }
    return false;
};

const Transaction = () => {
    const toast = useToast();

    const [banks, setBanks] = useState([]);
    const [isClosedToday, setIsClosedToday] = useState(false);
    const [closedDate, setClosedDate] = useState("");
    const [checkingClosing, setCheckingClosing] = useState(true);

    const [formData, setFormData] = useState({
        bank_id: "",
        customer_name: "",
        transaction_type: "WITHDRAWAL",
        amount: "",
        note_500: "",
        note_200: "",
        note_100: "",
        note_50: "",
        note_20: "",
        note_10: ""
    });

    const [errors, setErrors] = useState({
        bank_id: "",
        customer_name: "",
        amount: ""
    });

    const [touched, setTouched] = useState({
        bank_id: false,
        customer_name: false,
        amount: false
    });

    const [loading, setLoading] = useState(false);
    const [fetchingBanks, setFetchingBanks] = useState(true);

    const fetchBanks = useCallback(async () => {
        try {
            setFetchingBanks(true);
            const result = await apiRequest("/api/bank");
            setBanks(result?.data || []);
        } catch (err) {
            console.error("Fetch banks error:", err);
            toast.error(err.message || "Failed to load banks");
        } finally {
            setFetchingBanks(false);
        }
    }, [toast]);

    const checkClosingStatus = useCallback(async () => {
        try {
            setCheckingClosing(true);
            // Check closing history for today's record
            const result = await apiRequest("/api/closing?page=1&limit=5");
            const list = result?.data || [];
            const todayClosing = list.find((item) => 
                isDateToday(item.closing_date || item.createdAt || item.created_at)
            );

            if (todayClosing) {
                setIsClosedToday(true);
                setClosedDate(todayClosing.closing_date || "Today");
            } else {
                setIsClosedToday(false);
            }
        } catch (err) {
            console.error("Check closing status error:", err);
        } finally {
            setCheckingClosing(false);
        }
    }, []);

    useEffect(() => {
        fetchBanks();
        checkClosingStatus();
    }, [fetchBanks, checkClosingStatus]);

    const calculateDenominationTotal = () => {
        return notes.reduce((total, note) => {
            const count = Number(formData[note.name]) || 0;
            return total + count * note.value;
        }, 0);
    };

    const denominationTotal = calculateDenominationTotal();
    const enteredAmount = Number(formData.amount) || 0;
    const diff = enteredAmount - denominationTotal;
    const isMatched = enteredAmount > 0 && diff === 0;

    const validateField = (name, value) => {
        switch (name) {
            case "bank_id":
                if (!value) return "Please select a bank";
                return "";
            case "customer_name":
                if (!value.trim()) return "Customer name is required";
                if (value.trim().length < 2) return "Must be at least 2 characters";
                return "";
            case "amount":
                if (!value || Number(value) <= 0) return "Please enter a valid amount greater than 0";
                return "";
            default:
                return "";
        }
    };

    const formatTitleCase = (str) => {
        if (!str) return "";
        return str.replace(/(^|\s)\S/g, (char) => char.toUpperCase());
    };

    const handleChange = (e) => {
        if (isClosedToday) return;

        const { name, value } = e.target;
        const formattedValue = name === "customer_name" ? formatTitleCase(value) : value;

        setFormData((prev) => ({
            ...prev,
            [name]: formattedValue
        }));

        if (touched[name]) {
            const err = validateField(name, formattedValue);
            setErrors((prev) => ({ ...prev, [name]: err }));
        }
    };

    const handleBlur = (e) => {
        if (isClosedToday) return;

        const { name, value } = e.target;
        const formattedValue = name === "customer_name" ? formatTitleCase(value.trim()) : value;
        if (name === "customer_name") {
            setFormData((prev) => ({ ...prev, customer_name: formattedValue }));
        }
        setTouched((prev) => ({ ...prev, [name]: true }));
        const err = validateField(name, formattedValue);
        setErrors((prev) => ({ ...prev, [name]: err }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isClosedToday) {
            toast.error("Transactions are locked because Cash Closing has already been completed for today.");
            return;
        }

        const formattedCustomerName = formatTitleCase(formData.customer_name.trim());
        const formErrors = {
            bank_id: validateField("bank_id", formData.bank_id),
            customer_name: validateField("customer_name", formattedCustomerName),
            amount: validateField("amount", formData.amount)
        };

        setErrors(formErrors);
        setTouched({ bank_id: true, customer_name: true, amount: true });

        const firstError = Object.values(formErrors).find((e) => e !== "");
        if (firstError) {
            toast.error(firstError);
            return;
        }

        if (denominationTotal !== enteredAmount) {
            toast.error(`Denomination total (₹${denominationTotal.toLocaleString("en-IN")}) must match transaction amount (₹${enteredAmount.toLocaleString("en-IN")})`);
            return;
        }

        try {
            setLoading(true);

            const result = await apiRequest("/api/transaction", {
                method: "POST",
                body: JSON.stringify({
                    bank_id: formData.bank_id,
                    customer_name: formattedCustomerName,
                    transaction_type: formData.transaction_type,
                    amount: enteredAmount,
                    note_500: Number(formData.note_500) || 0,
                    note_200: Number(formData.note_200) || 0,
                    note_100: Number(formData.note_100) || 0,
                    note_50:  Number(formData.note_50) || 0,
                    note_20:  Number(formData.note_20) || 0,
                    note_10:  Number(formData.note_10) || 0
                })
            });

            toast.success(result?.message || "Transaction recorded successfully! 🎉");

            setFormData({
                bank_id: "",
                customer_name: "",
                transaction_type: "WITHDRAWAL",
                amount: "",
                note_500: "",
                note_200: "",
                note_100: "",
                note_50: "",
                note_20: "",
                note_10: ""
            });

            setTouched({ bank_id: false, customer_name: false, amount: false });
            setErrors({ bank_id: "", customer_name: "", amount: "" });

            await fetchBanks();

        } catch (err) {
            console.error("Create transaction error:", err);
            toast.error(err.message || "Failed to record transaction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tx-page-container">
            {/* Header with Logo Badge */}
            <div className="tx-page-header">
                <div className="tx-header-logo-badge">
                    <ArrowLeftRight size={24} />
                </div>
                <div className="tx-header-titles">
                    <h1>Record Transaction</h1>
                </div>
            </div>

            {/* Warning Banner if Cash is Closed Today */}
            {isClosedToday && (
                <div className="tx-closed-warning-banner">
                    <div className="tx-closed-icon-wrap">
                        <Lock size={22} />
                    </div>
                    <div className="tx-closed-text-content">
                        <h4>Cash Register Closed for Today</h4>
                        <p>
                            Daily cash closing has already been completed for today ({closedDate}). Transaction recording is locked until the next business day (new date).
                        </p>
                    </div>
                    <div className="tx-closed-badge">
                        <ShieldAlert size={14} />
                        <span>REGISTER CLOSED</span>
                    </div>
                </div>
            )}

            {/* Main Form Card */}
            <div className={`tx-dark-card ${isClosedToday ? "tx-card-locked" : ""}`}>
                <div className="tx-card-header">
                    <div className="tx-card-icon-box">
                        {isClosedToday ? <Lock size={20} style={{ color: "#ef4444" }} /> : <ArrowLeftRight size={20} />}
                    </div>
                    <div className="tx-card-title-group">
                        <h2>New Cash Transaction</h2>
                    </div>
                    {isClosedToday && (
                        <span className="badge badge-danger" style={{ marginLeft: "auto" }}>
                            Locked
                        </span>
                    )}
                </div>

                <form onSubmit={handleSubmit} noValidate className="tx-form">
                    {/* Top Row: Bank & Customer */}
                    <div className="tx-fields-grid">
                        {/* Select Bank */}
                        <div className="tx-form-group">
                            <label htmlFor="tx_bank_id">
                                Bank <span className="tx-req-star">*</span>
                            </label>
                            <div className={`tx-field-box ${isClosedToday ? "disabled-box" : ""} ${touched.bank_id && errors.bank_id ? "has-error" : ""} ${touched.bank_id && !errors.bank_id && formData.bank_id ? "is-valid" : ""}`}>
                                <Landmark size={16} className="tx-field-icon" />
                                <select
                                    id="tx_bank_id"
                                    name="bank_id"
                                    className="tx-real-select"
                                    value={formData.bank_id}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={fetchingBanks || isClosedToday}
                                >
                                    <option value="">
                                        {fetchingBanks ? "Loading banks..." : "-- Select Bank --"}
                                    </option>
                                    {banks.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.bank_name} - ({b.csp_id})
                                        </option>
                                    ))}
                                </select>
                                {touched.bank_id && !errors.bank_id && formData.bank_id && (
                                    <CheckCircle2 size={16} className="tx-check-icon" />
                                )}
                            </div>
                            {touched.bank_id && errors.bank_id && (
                                <div className="tx-error-text">
                                    <AlertCircle size={12} />
                                    <span>{errors.bank_id}</span>
                                </div>
                            )}
                        </div>

                        {/* Customer Name */}
                        <div className="tx-form-group">
                            <label htmlFor="tx_customer_name">
                                Customer Name <span className="tx-req-star">*</span>
                            </label>
                            <div className={`tx-field-box ${isClosedToday ? "disabled-box" : ""} ${touched.customer_name && errors.customer_name ? "has-error" : ""} ${touched.customer_name && !errors.customer_name && formData.customer_name ? "is-valid" : ""}`}>
                                <User size={16} className="tx-field-icon" />
                                <input
                                    id="tx_customer_name"
                                    type="text"
                                    name="customer_name"
                                    className="tx-real-input"
                                    style={{ textTransform: "capitalize" }}
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={isClosedToday}
                                    placeholder="e.g. Ramesh Kulkarni"
                                    autoComplete="off"
                                />
                                {touched.customer_name && !errors.customer_name && formData.customer_name && (
                                    <CheckCircle2 size={16} className="tx-check-icon" />
                                )}
                            </div>
                            {touched.customer_name && errors.customer_name && (
                                <div className="tx-error-text">
                                    <AlertCircle size={12} />
                                    <span>{errors.customer_name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle Row: Type & Amount */}
                    <div className="tx-fields-grid">
                        {/* Transaction Type */}
                        <div className="tx-form-group">
                            <label>Transaction Type</label>
                            <div className="tx-type-toggle-group">
                                <button
                                    type="button"
                                    disabled={isClosedToday}
                                    className={`tx-type-btn ${formData.transaction_type === "WITHDRAWAL" ? "active-withdrawal" : ""}`}
                                    onClick={() => setFormData((p) => ({ ...p, transaction_type: "WITHDRAWAL" }))}
                                >
                                    <ArrowUpRight size={16} />
                                    <span>Withdrawal (Cash Out)</span>
                                </button>
                                <button
                                    type="button"
                                    disabled={isClosedToday}
                                    className={`tx-type-btn ${formData.transaction_type === "DEPOSIT" ? "active-deposit" : ""}`}
                                    onClick={() => setFormData((p) => ({ ...p, transaction_type: "DEPOSIT" }))}
                                >
                                    <ArrowDownLeft size={16} />
                                    <span>Deposit (Cash In)</span>
                                </button>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="tx-form-group">
                            <label htmlFor="tx_amount">
                                Total Amount (₹) <span className="tx-req-star">*</span>
                            </label>
                            <div className={`tx-field-box ${isClosedToday ? "disabled-box" : ""} ${touched.amount && errors.amount ? "has-error" : ""} ${touched.amount && !errors.amount && formData.amount ? "is-valid" : ""}`}>
                                <IndianRupee size={16} className="tx-field-icon" />
                                <input
                                    id="tx_amount"
                                    type="number"
                                    name="amount"
                                    className="tx-real-input"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={isClosedToday}
                                    placeholder="Enter total amount (e.g. 5000)"
                                    min="1"
                                    step="0.01"
                                />
                                {touched.amount && !errors.amount && formData.amount && (
                                    <CheckCircle2 size={16} className="tx-check-icon" />
                                )}
                            </div>
                            {touched.amount && errors.amount && (
                                <div className="tx-error-text">
                                    <AlertCircle size={12} />
                                    <span>{errors.amount}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Denominations Section */}
                    <div className="tx-denominations-section">
                        <div className="tx-section-header">
                            <div className="tx-sec-title">
                                <Coins size={18} style={{ color: "#38bdf8" }} />
                                <h3>Note Denominations</h3>
                            </div>
                            <div className={`tx-match-indicator ${isMatched ? "is-matched" : "is-mismatch"}`}>
                                {isMatched ? (
                                    <>
                                        <CheckCircle2 size={14} />
                                        <span>Matched (₹{formatAmount(denominationTotal)})</span>
                                    </>
                                ) : enteredAmount > 0 ? (
                                    <>
                                        <AlertCircle size={14} />
                                        <span>
                                            Difference: {diff > 0 ? `₹${formatAmount(diff)} Remaining` : `₹${formatAmount(Math.abs(diff))} Excess`}
                                        </span>
                                    </>
                                ) : (
                                    <span>Enter count of physical notes</span>
                                )}
                            </div>
                        </div>

                        <div className="tx-notes-grid">
                            {notes.map((n) => {
                                const count = Number(formData[n.name]) || 0;
                                const subtotal = count * n.value;

                                return (
                                    <div className="tx-note-card" key={n.name}>
                                        <div className="tx-note-top">
                                            <span className="tx-note-tag" style={{ color: n.color, borderColor: `${n.color}40`, background: `${n.color}15` }}>
                                                {n.label}
                                            </span>
                                            <span className="tx-pcs-text">
                                                Subtotal: ₹{subtotal.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                        <div className="tx-note-input-wrap">
                                            <input
                                                type="number"
                                                name={n.name}
                                                className="tx-note-input"
                                                value={formData[n.name]}
                                                onChange={handleChange}
                                                disabled={isClosedToday}
                                                min="0"
                                                step="1"
                                                placeholder="0 pcs"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="tx-actions-wrap">
                        <button
                            type="submit"
                            className={`tx-btn-submit ${isClosedToday ? "disabled-locked" : ""}`}
                            disabled={loading || isClosedToday || checkingClosing}
                        >
                            {isClosedToday ? (
                                <>
                                    <Lock size={16} />
                                    <span>Transactions Locked (Cash Closed for Today)</span>
                                </>
                            ) : loading ? (
                                <>
                                    <Loader2 size={17} className="tx-spin-icon" />
                                    <span>Processing Transaction...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    <span>Create Transaction</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Transaction;