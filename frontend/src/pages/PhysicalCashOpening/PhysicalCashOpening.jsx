import { useState, useEffect, useCallback } from "react";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
    Coins,
    Banknote,
    Sparkles,
    Loader2,
    Calculator,
    Lock,
    CheckCircle2
} from "lucide-react";
import "./PhysicalCashOpening.css";

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

const isDateToday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
};

const PhysicalCashOpening = () => {
    const toast = useToast();

    const [formData, setFormData] = useState({
        note_500: "",
        note_200: "",
        note_100: "",
        note_50: "",
        note_20: "",
        note_10: ""
    });

    const [loading, setLoading] = useState(false);
    const [isSubmittedToday, setIsSubmittedToday] = useState(false);
    const [submittedDate, setSubmittedDate] = useState("");

    const notes = [
        { name: "note_500", label: "₹500 Note", value: 500, color: "#34d399" },
        { name: "note_200", label: "₹200 Note", value: 200, color: "#fb923c" },
        { name: "note_100", label: "₹100 Note", value: 100, color: "#818cf8" },
        { name: "note_50", label: "₹50 Note", value: 50, color: "#22d3ee" },
        { name: "note_20", label: "₹20 Note", value: 20, color: "#f472b6" },
        { name: "note_10", label: "₹10 Note", value: 10, color: "#a78bfa" }
    ];

    const checkDailyStatus = useCallback(async () => {
        const todayStr = getTodayDateStr();
        const savedDate = localStorage.getItem("physical_cash_opening_date");

        if (savedDate === todayStr) {
            setIsSubmittedToday(true);
            setSubmittedDate(todayStr);
        }

        try {
            const res = await apiRequest("/api/dashboard");
            const physicalCash = res?.data?.physical_cash;

            if (physicalCash) {
                setFormData({
                    note_500: physicalCash.note_500 || "",
                    note_200: physicalCash.note_200 || "",
                    note_100: physicalCash.note_100 || "",
                    note_50: physicalCash.note_50 || "",
                    note_20: physicalCash.note_20 || "",
                    note_10: physicalCash.note_10 || ""
                });

                const cashDate = physicalCash.updatedAt || physicalCash.updated_at || physicalCash.createdAt || physicalCash.created_at || physicalCash.date;
                const totalAmt = Number(physicalCash.total_amount || 0);

                if ((cashDate && isDateToday(cashDate) && totalAmt > 0) || savedDate === todayStr) {
                    setIsSubmittedToday(true);
                    setSubmittedDate(todayStr);
                    localStorage.setItem("physical_cash_opening_date", todayStr);
                }
            }
        } catch (err) {
            console.error("Check physical cash status error:", err);
        }
    }, []);

    useEffect(() => {
        checkDailyStatus();
    }, [checkDailyStatus]);

    const handleChange = (e) => {
        if (isSubmittedToday) return;

        const { name, value } = e.target;
        if (value === "" || Number(value) >= 0) {
            setFormData((prev) => ({
                ...prev,
                [name]: value === "" ? "" : Math.floor(Number(value))
            }));
        }
    };

    const calculateTotal = () => {
        return notes.reduce((total, note) => {
            const count = Number(formData[note.name]) || 0;
            return total + count * note.value;
        }, 0);
    };

    const total = calculateTotal();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmittedToday) {
            toast.error("Physical cash opening has already been recorded for today.");
            return;
        }

        if (total <= 0) {
            toast.error("Please enter at least one denomination count greater than 0.");
            return;
        }

        try {
            setLoading(true);

            const result = await apiRequest("/api/physical-cash-opening", {
                method: "POST",
                body: JSON.stringify({
                    note_500: Number(formData.note_500) || 0,
                    note_200: Number(formData.note_200) || 0,
                    note_100: Number(formData.note_100) || 0,
                    note_50: Number(formData.note_50) || 0,
                    note_20: Number(formData.note_20) || 0,
                    note_10: Number(formData.note_10) || 0
                })
            });

            toast.success(result?.message || "Physical cash opening recorded successfully! 🎉");

            const todayStr = getTodayDateStr();
            localStorage.setItem("physical_cash_opening_date", todayStr);
            setIsSubmittedToday(true);
            setSubmittedDate(todayStr);

        } catch (err) {
            console.error("Physical cash opening error:", err);
            toast.error(err.message || "Failed to save physical cash opening.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pco-page-container">
            {/* Header with Logo Badge */}
            <div className="pco-page-header">
                <div className="pco-header-logo-badge">
                    <Coins size={24} />
                </div>
                <div className="pco-header-titles">
                    <h1>Physical Cash Opening</h1>
                </div>
            </div>

            {/* Daily Lock / Completion Banner */}
            {isSubmittedToday && (
                <div className="pco-lock-banner">
                    <div className="pco-lock-icon-wrap">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="pco-lock-text-content">
                        <h4>Physical Cash Opening Completed for Today ({submittedDate || getTodayDateStr()})</h4>
                        <p>
                            Thank you! Your vault opening cash denominations have been recorded successfully.
                        </p>
                    </div>
                    <div className="pco-lock-badge">
                        <Lock size={13} />
                        <span>COMPLETED & LOCKED</span>
                    </div>
                </div>
            )}

            {/* Main Form Card */}
            <div className={`pco-dark-card ${isSubmittedToday ? "pco-card-locked" : ""}`}>
                <div className="pco-card-header">
                    <div className="pco-card-icon-box">
                        <Banknote size={20} />
                    </div>
                    <div className="pco-card-title-group pco-header-flex">
                        <h2>Vault Cash Denominations</h2>
                        <div className="pco-total-preview-pill">
                            Total: ₹{formatAmount(total)}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="pco-form">
                    <div className="pco-notes-grid">
                        {notes.map((note) => {
                            const count = Number(formData[note.name]) || 0;
                            const amount = count * note.value;

                            return (
                                <div className={`pco-note-card ${isSubmittedToday ? "pco-item-disabled" : ""}`} key={note.name}>
                                    <div className="pco-note-top">
                                        <span className="pco-note-badge" style={{ color: note.color, borderColor: `${note.color}40`, background: `${note.color}15` }}>
                                            {note.label}
                                        </span>
                                        <span className="pco-multiplier-tag">
                                            × {note.value}
                                        </span>
                                    </div>

                                    <div className="pco-input-box">
                                        <input
                                            type="number"
                                            name={note.name}
                                            className="pco-real-input"
                                            value={formData[note.name]}
                                            onChange={handleChange}
                                            disabled={isSubmittedToday}
                                            min="0"
                                            step="1"
                                            placeholder="0 pcs"
                                        />
                                    </div>

                                    <div className="pco-note-subtotal">
                                        <span>Subtotal:</span>
                                        <strong style={{ color: count > 0 ? note.color : "#64748b" }}>
                                            ₹{amount.toLocaleString("en-IN")}
                                        </strong>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Total Summary Banner */}
                    <div className="pco-grand-total-banner">
                        <div className="pco-total-label-wrap">
                            <Calculator size={22} className="pco-calc-icon" />
                            <div>
                                <span className="pco-total-title">Total Vault Opening Cash</span>
                                <span className="pco-total-hint">Sum of all physical note denominations entered above</span>
                            </div>
                        </div>

                        <div className="pco-total-figure">
                            ₹{formatAmount(total)}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pco-actions-wrap">
                        <button
                            type="submit"
                            className={`pco-btn-submit ${isSubmittedToday ? "disabled-locked" : ""}`}
                            disabled={loading || total <= 0 || isSubmittedToday}
                        >
                            {isSubmittedToday ? (
                                <>
                                    <Lock size={16} />
                                    <span>Already Submitted for Today (Locked)</span>
                                </>
                            ) : loading ? (
                                <>
                                    <Loader2 size={17} className="pco-spin-icon" />
                                    <span>Saving Physical Cash...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    <span>Save Opening Cash</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PhysicalCashOpening;