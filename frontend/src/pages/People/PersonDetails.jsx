import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
    ArrowLeft,
    ArrowUpRight,
    ArrowDownLeft,
    Phone,
    Banknote,
    CreditCard,
    History,
    Calendar,
    CheckCircle2,
    Plus,
    X,
    Loader2,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    FileText,
    Receipt,
    Wallet
} from "lucide-react";
import "./PersonDetails.css";
import "./People.css";

const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const formatSignedAmount = (amount) => {
    const num = Number(amount || 0);
    const formatted = Math.abs(num).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    if (num > 0) return `+₹${formatted}`;
    if (num < 0) return `-₹${formatted}`;
    return `₹${formatted}`;
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    } catch {
        return dateStr;
    }
};

const getInitials = (name) => {
    if (!name) return "P";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const PersonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [person, setPerson] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    // modalType: null | 'CREDIT' | 'DEBIT'
    const [modalType, setModalType] = useState(null);
    const [txFormData, setTxFormData] = useState({
        amount: "",
        payment_mode: "CASH",
        note: ""
    });
    const [txErrors, setTxErrors] = useState({});
    const [submittingTx, setSubmittingTx] = useState(false);

    // Fetch Person details & Transactions
    const fetchPersonDetails = useCallback(async () => {
        try {
            setLoading(true);

            const [personRes, txRes] = await Promise.allSettled([
                apiRequest(`/api/people/${id}`),
                apiRequest(`/api/people-transaction/person/${id}`)
            ]);

            if (personRes.status === "fulfilled" && personRes.value?.data) {
                setPerson(personRes.value.data);
            } else {
                toast.error("Failed to load person record.");
            }

            if (txRes.status === "fulfilled" && txRes.value?.data) {
                const list = Array.isArray(txRes.value.data) ? txRes.value.data : [];
                // Sort newest transaction first
                list.sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.created_at || a.transaction_date || 0);
                    const dateB = new Date(b.createdAt || b.created_at || b.transaction_date || 0);
                    return dateB - dateA;
                });
                setTransactions(list);
            } else {
                setTransactions([]);
            }
        } catch (err) {
            console.error("Fetch person details error:", err);
            toast.error(err.message || "Failed to load person details.");
        } finally {
            setLoading(false);
        }
    }, [id, toast]);

    useEffect(() => {
        if (id) {
            fetchPersonDetails();
        }
    }, [id, fetchPersonDetails]);

    // Open Modal
    const handleOpenModal = (type) => {
        setModalType(type);
        setTxFormData({
            amount: "",
            payment_mode: "CASH",
            note: ""
        });
        setTxErrors({});
    };

    const handleCloseModal = () => {
        if (!submittingTx) {
            setModalType(null);
            setTxFormData({
                amount: "",
                payment_mode: "CASH",
                note: ""
            });
            setTxErrors({});
        }
    };

    const validateTxForm = () => {
        const errors = {};
        const amountNum = Number(txFormData.amount);
        if (!txFormData.amount || isNaN(amountNum) || amountNum <= 0) {
            errors.amount = "Please enter a valid amount greater than 0";
        }

        if (!txFormData.payment_mode) {
            errors.payment_mode = "Payment mode is required";
        }

        setTxErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleTxSubmit = async (e) => {
        e.preventDefault();
        if (!validateTxForm()) return;

        try {
            setSubmittingTx(true);

            const defaultNote = modalType === "CREDIT" ? "Money given" : "Money received";
            const finalNote = txFormData.note.trim() || defaultNote;

            const payload = {
                person_id: id,
                transaction_type: modalType, // "CREDIT" or "DEBIT"
                amount: Number(txFormData.amount),
                payment_mode: txFormData.payment_mode,
                note: finalNote
            };

            const result = await apiRequest("/api/people-transaction", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            toast.success(
                result?.message ||
                (modalType === "CREDIT"
                    ? `Given ₹${formatAmount(payload.amount)} to ${person?.name || "person"} successfully!`
                    : `Received ₹${formatAmount(payload.amount)} from ${person?.name || "person"} successfully!`)
            );

            handleCloseModal();
            await fetchPersonDetails();
        } catch (err) {
            console.error("Create transaction error:", err);
            toast.error(err.message || "Failed to record transaction. Please try again.");
        } finally {
            setSubmittingTx(false);
        }
    };

    // Calculate totals
    const totalCredit = Number(person?.total_credit ?? transactions.filter(t => t.transaction_type === "CREDIT").reduce((acc, t) => acc + Number(t.amount || 0), 0));
    const totalDebit = Number(person?.total_debit ?? transactions.filter(t => t.transaction_type === "DEBIT").reduce((acc, t) => acc + Number(t.amount || 0), 0));
    const balance = person?.balance !== undefined ? Number(person.balance) : totalCredit - totalDebit;

    let statusLabel = "SETTLED";
    let statusClass = "status-settled";
    let amountClass = "amount-settled";

    if (balance > 0) {
        statusLabel = "TO RECEIVE";
        statusClass = "status-receive";
        amountClass = "amount-receive";
    } else if (balance < 0) {
        statusLabel = "TO PAY";
        statusClass = "status-pay";
        amountClass = "amount-pay";
    }

    if (loading && !person) {
        return (
            <div className="pdetail-container">
                <div className="pdetail-loading-box" style={{ minHeight: "400px" }}>
                    <RefreshCw size={28} className="pdetail-spin-icon" />
                    <span style={{ fontSize: "14px", color: "#94a3b8" }}>Loading person ledger details...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="pdetail-container">
            {/* Top Navigation Bar */}
            <div className="pdetail-top-bar">
                <button
                    type="button"
                    className="pdetail-back-btn"
                    onClick={() => navigate("/people")}
                >
                    <ArrowLeft size={16} />
                    <span>Back to People Ledger</span>
                </button>
            </div>

            {/* Hero Profile Header Card */}
            <div className="pdetail-hero-card">
                <div className="pdetail-hero-left">
                    <div className="pdetail-avatar-lg">
                        {getInitials(person?.name)}
                    </div>
                    <div className="pdetail-hero-meta">
                        <h1>{person?.name || "Person Details"}</h1>
                        {person?.mobile ? (
                            <div className="pdetail-phone-tag">
                                <Phone size={13} style={{ color: "#60a5fa" }} />
                                <span>{person.mobile}</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Right Action Buttons */}
                <div className="pdetail-hero-actions">
                    <button
                        type="button"
                        className="pdetail-btn-give"
                        onClick={() => handleOpenModal("CREDIT")}
                    >
                        <ArrowUpRight size={17} />
                        <span>Give Money</span>
                    </button>

                    <button
                        type="button"
                        className="pdetail-btn-receive"
                        onClick={() => handleOpenModal("DEBIT")}
                    >
                        <ArrowDownLeft size={17} />
                        <span>Receive Money</span>
                    </button>
                </div>
            </div>

            {/* 2 Summary Cards Grid (Total Given, Total Received) */}
            <div className="pdetail-stats-grid">
                {/* 1. Total Credit Given */}
                <div className="pdetail-stat-card card-credit">
                    <div className="pdetail-stat-info">
                        <span className="pdetail-stat-title">Total Given (Credit)</span>
                        <span className="pdetail-stat-val" style={{ color: "#34d399" }}>
                            ₹{formatAmount(totalCredit)}
                        </span>
                    </div>
                    <div className="people-card-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#34d399" }}>
                        <TrendingUp size={20} />
                    </div>
                </div>

                {/* 2. Total Debit Returned */}
                <div className="pdetail-stat-card card-debit">
                    <div className="pdetail-stat-info">
                        <span className="pdetail-stat-title">Total Received (Debit)</span>
                        <span className="pdetail-stat-val" style={{ color: "#60a5fa" }}>
                            ₹{formatAmount(totalDebit)}
                        </span>
                    </div>
                    <div className="people-card-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#60a5fa" }}>
                        <TrendingDown size={20} />
                    </div>
                </div>
            </div>

            {/* Transaction History Section */}
            <div className="pdetail-history-card">
                <div className="pdetail-history-header">
                    <div className="pdetail-history-title-wrap">
                        <History size={18} style={{ color: "#60a5fa" }} />
                        <h2>Transaction History</h2>
                    </div>
                    <span className="people-count-pill">
                        {transactions.length} {transactions.length === 1 ? "Record" : "Records"}
                    </span>
                </div>

                {loading ? (
                    <div className="pdetail-loading-box">
                        <RefreshCw size={22} className="pdetail-spin-icon" />
                        <span>Loading history records...</span>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="pdetail-empty-state">
                        <Receipt size={36} style={{ color: "#475569", marginBottom: "6px" }} />
                        <p>No transactions recorded yet for {person?.name}.</p>
                        <span style={{ color: "#64748b", fontSize: "13px" }}>
                            Use "+ Give Money" or "+ Receive Money" above to add the first transaction.
                        </span>
                    </div>
                ) : (
                    <div className="pdetail-tx-table-wrap">
                        <table className="pdetail-tx-table">
                            <thead>
                                <tr>
                                    <th>Date & Time</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Payment Mode</th>
                                    <th>Note / Purpose</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => {
                                    const isCredit = tx.transaction_type === "CREDIT";
                                    const rawDate = tx.createdAt || tx.created_at || tx.transaction_date;

                                    return (
                                        <tr key={tx.id}>
                                            <td>
                                                <div className="pdetail-date-cell">
                                                    <Calendar size={13} style={{ color: "#64748b" }} />
                                                    <span>{formatDate(rawDate)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`pdetail-type-badge ${isCredit ? "type-credit" : "type-debit"}`}
                                                >
                                                    {isCredit ? (
                                                        <ArrowDownLeft size={11} />
                                                    ) : (
                                                        <ArrowUpRight size={11} />
                                                    )}
                                                    <span>{tx.transaction_type}</span>
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`pdetail-amount-cell ${isCredit ? "amount-credit" : "amount-debit"}`}
                                                >
                                                    {isCredit ? "+" : "-"}₹{formatAmount(tx.amount)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="pdetail-mode-badge">
                                                    {tx.payment_mode === "ONLINE" ? (
                                                        <CreditCard size={12} style={{ color: "#60a5fa" }} />
                                                    ) : (
                                                        <Banknote size={12} style={{ color: "#34d399" }} />
                                                    )}
                                                    <span>{tx.payment_mode || "CASH"}</span>
                                                </span>
                                            </td>
                                            <td>
                                                <span className="pdetail-note-cell">
                                                    {tx.note || "-"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Transaction Modal (Give Money / Receive Money) */}
            {modalType && (
                <div className="people-modal-backdrop" onClick={handleCloseModal}>
                    <div className="pdetail-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="people-modal-header">
                            <div className="people-modal-title">
                                {modalType === "CREDIT" ? (
                                    <>
                                        <Wallet size={20} style={{ color: "#34d399" }} />
                                        <h3>Give Money to {person?.name}</h3>
                                    </>
                                ) : (
                                    <>
                                        <Wallet size={20} style={{ color: "#60a5fa" }} />
                                        <h3>Receive Money from {person?.name}</h3>
                                    </>
                                )}
                            </div>
                            <button
                                type="button"
                                className="people-modal-close-btn"
                                disabled={submittingTx}
                                onClick={handleCloseModal}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Transaction Type Indicator Banner */}
                        <div
                            className={`pdetail-modal-banner ${modalType === "CREDIT" ? "banner-credit" : "banner-debit"
                                }`}
                        >
                            {modalType === "CREDIT" ? (
                                <>
                                    <ArrowDownLeft size={16} />
                                    <span>
                                        Recording <strong>CREDIT</strong>: You are giving money. Amount will be added to money to receive.
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ArrowUpRight size={16} />
                                    <span>
                                        Recording <strong>DEBIT</strong>: Person is returning money. Amount will reduce outstanding balance.
                                    </span>
                                </>
                            )}
                        </div>

                        <form onSubmit={handleTxSubmit} noValidate className="people-modal-body">
                            {/* Amount Input */}
                            <div className="people-form-group">
                                <label htmlFor="tx_amount">
                                    Amount (₹) <span className="people-req-star">*</span>
                                </label>
                                <div className={`people-input-box ${txErrors.amount ? "has-error" : ""}`}>
                                    <span style={{ color: "#64748b", fontWeight: 700, fontSize: "15px" }}>₹</span>
                                    <input
                                        id="tx_amount"
                                        type="number"
                                        name="amount"
                                        className="people-real-input"
                                        placeholder="0.00"
                                        min="1"
                                        step="any"
                                        value={txFormData.amount}
                                        onChange={(e) => {
                                            setTxFormData((prev) => ({ ...prev, amount: e.target.value }));
                                            if (txErrors.amount) setTxErrors((prev) => ({ ...prev, amount: "" }));
                                        }}
                                        autoFocus
                                        autoComplete="off"
                                    />
                                </div>
                                {txErrors.amount && (
                                    <span className="people-error-text">{txErrors.amount}</span>
                                )}
                            </div>

                            {/* Payment Mode Selection */}
                            <div className="people-form-group">
                                <label>
                                    Payment Mode <span className="people-req-star">*</span>
                                </label>
                                <div className="pdetail-mode-selector">
                                    <button
                                        type="button"
                                        className={`pdetail-mode-option ${txFormData.payment_mode === "CASH" ? "selected" : ""
                                            }`}
                                        onClick={() =>
                                            setTxFormData((prev) => ({ ...prev, payment_mode: "CASH" }))
                                        }
                                    >
                                        <Banknote size={16} />
                                        <span>CASH</span>
                                    </button>

                                    <button
                                        type="button"
                                        className={`pdetail-mode-option ${txFormData.payment_mode === "ONLINE" ? "selected" : ""
                                            }`}
                                        onClick={() =>
                                            setTxFormData((prev) => ({ ...prev, payment_mode: "ONLINE" }))
                                        }
                                    >
                                        <CreditCard size={16} />
                                        <span>ONLINE</span>
                                    </button>
                                </div>
                            </div>

                            {/* Note Input */}
                            <div className="people-form-group">
                                <label htmlFor="tx_note">
                                    Note / Purpose (Optional)
                                </label>
                                <div className={`people-input-box ${txErrors.note ? "has-error" : ""}`} style={{ alignItems: "flex-start", padding: "8px 14px" }}>
                                    <FileText size={16} className="people-field-icon" style={{ marginTop: "4px" }} />
                                    <textarea
                                        id="tx_note"
                                        rows={2}
                                        className="pdetail-textarea"
                                        placeholder={
                                            modalType === "CREDIT"
                                                ? "e.g. Personal loan given, grocery payment (optional)..."
                                                : "e.g. Previous amount returned, settled (optional)..."
                                        }
                                        value={txFormData.note}
                                        onChange={(e) => {
                                            setTxFormData((prev) => ({ ...prev, note: e.target.value }));
                                            if (txErrors.note) setTxErrors((prev) => ({ ...prev, note: "" }));
                                        }}
                                    />
                                </div>
                                {txErrors.note && (
                                    <span className="people-error-text">{txErrors.note}</span>
                                )}
                            </div>

                            {/* Modal Actions */}
                            <div className="people-modal-actions">
                                <button
                                    type="button"
                                    className="people-btn-cancel"
                                    disabled={submittingTx}
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="people-btn-save"
                                    style={{
                                        background:
                                            modalType === "CREDIT"
                                                ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
                                                : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                                    }}
                                    disabled={submittingTx}
                                >
                                    {submittingTx ? (
                                        <>
                                            <Loader2 size={16} className="people-spin-icon" />
                                            <span>Saving Transaction...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={16} />
                                            <span>Save Transaction</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonDetails;
