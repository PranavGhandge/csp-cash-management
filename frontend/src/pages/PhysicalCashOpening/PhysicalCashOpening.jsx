import { useState } from "react";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
    Coins,
    Banknote,
    Sparkles,
    Loader2,
    Calculator
} from "lucide-react";
import "./PhysicalCashOpening.css";

const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
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

    const notes = [
        { name: "note_500", label: "₹500 Note", value: 500, color: "#34d399" },
        { name: "note_200", label: "₹200 Note", value: 200, color: "#fb923c" },
        { name: "note_100", label: "₹100 Note", value: 100, color: "#818cf8" },
        { name: "note_50",  label: "₹50 Note",  value: 50,  color: "#22d3ee" },
        { name: "note_20",  label: "₹20 Note",  value: 20,  color: "#f472b6" },
        { name: "note_10",  label: "₹10 Note",  value: 10,  color: "#a78bfa" }
    ];

    const handleChange = (e) => {
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

            setFormData({
                note_500: "",
                note_200: "",
                note_100: "",
                note_50: "",
                note_20: "",
                note_10: ""
            });

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

            {/* Main Form Card */}
            <div className="pco-dark-card">
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
                                <div className="pco-note-card" key={note.name}>
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
                            className="pco-btn-submit"
                            disabled={loading || total <= 0}
                        >
                            {loading ? (
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