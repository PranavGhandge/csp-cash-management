import { useEffect, useState, useCallback } from "react";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
    Lock,
    Banknote,
    Calculator,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Sparkles,
    ShieldAlert,
    TrendingUp,
    TrendingDown,
    ArrowRightLeft
} from "lucide-react";
import "./CashClosing.css";

const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const notes = [
    { name: "note_500", label: "₹500 Note", value: 500, color: "#34d399" },
    { name: "note_200", label: "₹200 Note", value: 200, color: "#fb923c" },
    { name: "note_100", label: "₹100 Note", value: 100, color: "#818cf8" },
    { name: "note_50",  label: "₹50 Note",  value: 50,  color: "#22d3ee" },
    { name: "note_20",  label: "₹20 Note",  value: 20,  color: "#f472b6" },
    { name: "note_10",  label: "₹10 Note",  value: 10,  color: "#a78bfa" }
];

const CashClosing = () => {
    const toast = useToast();

    const [formData, setFormData] = useState({
        note_500: "",
        note_200: "",
        note_100: "",
        note_50: "",
        note_20: "",
        note_10: ""
    });

    const [expectedCash, setExpectedCash] = useState(0);
    const [actualCash, setActualCash] = useState(0);
    const [difference, setDifference] = useState(0);
    const [status, setStatus] = useState("MATCHED");

    const [loading, setLoading] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(true);

    const fetchClosingSummary = useCallback(async () => {
        try {
            setSummaryLoading(true);
            const result = await apiRequest("/api/closing/summary");
            setExpectedCash(Number(result.data?.expected_cash || 0));
        } catch (err) {
            console.error("Closing summary error:", err);
            toast.error(err.message || "Failed to load closing summary");
        } finally {
            setSummaryLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchClosingSummary();
    }, [fetchClosingSummary]);

    useEffect(() => {
        const total = notes.reduce((sum, note) => {
            return sum + (Number(formData[note.name]) || 0) * note.value;
        }, 0);
        setActualCash(total);
    }, [formData]);

    useEffect(() => {
        const diff = actualCash - Number(expectedCash || 0);
        setDifference(diff);

        if (diff === 0) {
            setStatus("MATCHED");
        } else if (diff < 0) {
            setStatus("SHORT");
        } else {
            setStatus("EXCESS");
        }
    }, [actualCash, expectedCash]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value === "" || Number(value) >= 0) {
            setFormData((prev) => ({
                ...prev,
                [name]: value === "" ? "" : Math.floor(Number(value))
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (actualCash <= 0 && expectedCash > 0) {
            toast.error("Please enter physical notes count for closing.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                note_500: Number(formData.note_500) || 0,
                note_200: Number(formData.note_200) || 0,
                note_100: Number(formData.note_100) || 0,
                note_50:  Number(formData.note_50) || 0,
                note_20:  Number(formData.note_20) || 0,
                note_10:  Number(formData.note_10) || 0
            };

            const result = await apiRequest("/api/closing", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            toast.success(result?.message || "Cash closing recorded successfully! 🎉");

            setFormData({
                note_500: "",
                note_200: "",
                note_100: "",
                note_50: "",
                note_20: "",
                note_10: ""
            });

            await fetchClosingSummary();

        } catch (err) {
            console.error("Cash closing error:", err);
            toast.error(err.message || "Failed to complete cash closing.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cc-page-container">
            {/* Header with Logo Badge */}
            <div className="cc-page-header">
                <div className="cc-header-logo-badge">
                    <Lock size={24} />
                </div>
                <div className="cc-header-titles">
                    <h1>Cash Closing</h1>
                </div>
            </div>

            {/* Top 4 KPI Metrics */}
            <div className="cc-kpi-grid">
                {/* Expected Cash */}
                <div className="cc-kpi-card">
                    <div className="cc-kpi-header">
                        <span className="cc-kpi-label">Expected Physical Cash</span>
                        <div className="cc-kpi-icon blue">
                            <ArrowRightLeft size={16} />
                        </div>
                    </div>
                    <div className="cc-kpi-value">
                        {summaryLoading ? "..." : `₹${formatAmount(expectedCash)}`}
                    </div>
                    <span className="cc-kpi-meta">Calculated ledger balance</span>
                </div>

                {/* Actual Cash */}
                <div className="cc-kpi-card">
                    <div className="cc-kpi-header">
                        <span className="cc-kpi-label">Actual Physical Cash</span>
                        <div className="cc-kpi-icon emerald">
                            <Banknote size={16} />
                        </div>
                    </div>
                    <div className="cc-kpi-value emerald">
                        ₹{formatAmount(actualCash)}
                    </div>
                    <span className="cc-kpi-meta">Real-time counted notes</span>
                </div>

                {/* Difference */}
                <div className="cc-kpi-card">
                    <div className="cc-kpi-header">
                        <span className="cc-kpi-label">Audit Difference</span>
                        <div className={`cc-kpi-icon ${difference === 0 ? "emerald" : difference < 0 ? "rose" : "amber"}`}>
                            {difference < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                        </div>
                    </div>
                    <div className={`cc-kpi-value ${difference === 0 ? "emerald" : difference < 0 ? "rose" : "amber"}`}>
                        {difference < 0 ? `-₹${formatAmount(Math.abs(difference))}` : `₹${formatAmount(difference)}`}
                    </div>
                    <span className="cc-kpi-meta">Actual - Expected cash</span>
                </div>

                {/* Status */}
                <div className="cc-kpi-card">
                    <div className="cc-kpi-header">
                        <span className="cc-kpi-label">Closing Status</span>
                        <div className={`cc-kpi-icon ${status === "MATCHED" ? "emerald" : status === "SHORT" ? "rose" : "amber"}`}>
                            {status === "MATCHED" ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                        </div>
                    </div>
                    <div className="cc-status-wrap">
                        <span className={`cc-status-pill ${status.toLowerCase()}`}>
                            {status === "MATCHED" ? "✓ PERFECT MATCH" : status === "SHORT" ? "⚠ SHORT CASH" : "⚠ EXCESS CASH"}
                        </span>
                    </div>
                    <span className="cc-kpi-meta">Register balance status</span>
                </div>
            </div>

            {/* Main Physical Cash Count Form Card */}
            <div className="cc-dark-card">
                <div className="cc-card-header">
                    <div className="cc-card-icon-box">
                        <Banknote size={20} />
                    </div>
                    <div className="cc-card-title-group">
                        <h2>Physical Cash Denomination Count</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="cc-form">
                    {/* Denominations Grid */}
                    <div className="cc-notes-grid">
                        {notes.map((note) => {
                            const count = Number(formData[note.name]) || 0;
                            const subtotal = count * note.value;

                            return (
                                <div className="cc-note-card" key={note.name}>
                                    <div className="cc-note-top">
                                        <span className="cc-note-badge" style={{ color: note.color, borderColor: `${note.color}40`, background: `${note.color}15` }}>
                                            {note.label}
                                        </span>
                                        <span className="cc-multiplier-text">
                                            × {note.value}
                                        </span>
                                    </div>

                                    <div className="cc-input-box">
                                        <input
                                            type="number"
                                            name={note.name}
                                            className="cc-real-input"
                                            value={formData[note.name]}
                                            onChange={handleChange}
                                            min="0"
                                            step="1"
                                            placeholder="0 pcs"
                                        />
                                    </div>

                                    <div className="cc-note-subtotal">
                                        <span>Subtotal:</span>
                                        <strong style={{ color: count > 0 ? note.color : "#64748b" }}>
                                            ₹{subtotal.toLocaleString("en-IN")}
                                        </strong>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Total Summary Banner */}
                    <div className="cc-grand-total-banner">
                        <div className="cc-total-label-wrap">
                            <Calculator size={22} className="cc-calc-icon" />
                            <div>
                                <span className="cc-total-title">Total Counted Physical Cash</span>
                                <span className="cc-total-hint">Sum of all note counts verified in drawer</span>
                            </div>
                        </div>

                        <div className="cc-total-figure">
                            ₹{formatAmount(actualCash)}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="cc-actions-wrap">
                        <button
                            type="submit"
                            className="cc-btn-submit"
                            disabled={loading || summaryLoading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={17} className="cc-spin-icon" />
                                    <span>Submitting Cash Closing...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    <span>Complete Cash Closing</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CashClosing;