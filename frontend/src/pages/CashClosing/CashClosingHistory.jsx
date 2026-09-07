import { useEffect, useState, useCallback } from "react";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
    FileSpreadsheet,
    Banknote,
    Calendar,
    Eye,
    X,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    ShieldAlert,
    RefreshCw
} from "lucide-react";
import "./CashClosingHistory.css";

const notes = [
    { name: "note_500", label: "₹500 Note", value: 500, color: "#34d399" },
    { name: "note_200", label: "₹200 Note", value: 200, color: "#fb923c" },
    { name: "note_100", label: "₹100 Note", value: 100, color: "#818cf8" },
    { name: "note_50",  label: "₹50 Note",  value: 50,  color: "#22d3ee" },
    { name: "note_20",  label: "₹20 Note",  value: 20,  color: "#f472b6" },
    { name: "note_10",  label: "₹10 Note",  value: 10,  color: "#a78bfa" }
];

const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const CashClosingHistory = () => {
    const toast = useToast();

    const [closings, setClosings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClosing, setSelectedClosing] = useState(null);

    const fetchClosings = useCallback(async () => {
        try {
            setLoading(true);
            const result = await apiRequest("/api/closing?page=1&limit=20");
            setClosings(result?.data || []);
        } catch (err) {
            console.error("Cash closing history error:", err);
            toast.error(err.message || "Failed to load cash closing history.");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchClosings();
    }, [fetchClosings]);

    return (
        <div className="cch-page-container">
            {/* Header with Logo Badge */}
            <div className="cch-page-header">
                <div className="cch-header-logo-badge">
                    <FileSpreadsheet size={24} />
                </div>
                <div className="cch-header-titles">
                    <h1>Closing History</h1>
                </div>
            </div>

            {/* History Table Card */}
            <div className="cch-dark-card">
                <div className="cch-table-header-row">
                    <div className="cch-table-title-wrap">
                        <FileSpreadsheet size={18} style={{ color: "#38bdf8" }} />
                        <h2>Daily Register Closing Records</h2>
                    </div>
                    <span className="cch-records-pill">
                        {closings.length} Closings Logged
                    </span>
                </div>

                {loading ? (
                    <div className="cch-loading-box">
                        <RefreshCw size={22} className="cch-spin-icon" />
                        <span>Loading closing audit history...</span>
                    </div>
                ) : closings.length === 0 ? (
                    <div className="cch-empty-state">
                        <FileSpreadsheet size={36} style={{ color: "#475569", marginBottom: "8px" }} />
                        <p>No closing records found.</p>
                        <span>Daily register closings performed at shift end will appear here.</span>
                    </div>
                ) : (
                    <div className="cch-table-wrapper">
                        <table className="cch-table">
                            <thead>
                                <tr>
                                    <th>Closing Date</th>
                                    <th>Expected Cash</th>
                                    <th>Actual Cash</th>
                                    <th>Difference</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: "center" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {closings.map((c) => {
                                    const diff = Number(c.difference || 0);
                                    const statusClass = c.status?.toLowerCase() || "matched";

                                    return (
                                        <tr key={c.id}>
                                            <td>
                                                <div className="cch-date-cell">
                                                    <Calendar size={13} style={{ color: "#64748b" }} />
                                                    <strong>{c.closing_date}</strong>
                                                </div>
                                            </td>
                                            <td className="cch-num-cell">
                                                ₹{formatAmount(c.expected_cash)}
                                            </td>
                                            <td className="cch-num-cell emerald">
                                                ₹{formatAmount(c.actual_cash)}
                                            </td>
                                            <td className="cch-num-cell">
                                                <span
                                                    className={`cch-diff-tag ${diff === 0 ? "emerald" : diff < 0 ? "rose" : "amber"}`}
                                                >
                                                    {diff < 0 ? `-₹${formatAmount(Math.abs(diff))}` : `₹${formatAmount(diff)}`}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`cch-status-pill ${statusClass}`}>
                                                    {c.status === "MATCHED" ? (
                                                        <CheckCircle2 size={12} />
                                                    ) : (
                                                        <ShieldAlert size={12} />
                                                    )}
                                                    <span>{c.status}</span>
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <button
                                                    className="cch-btn-view"
                                                    onClick={() => setSelectedClosing(c)}
                                                    title="View note breakdown and closing audit"
                                                >
                                                    <Eye size={13} />
                                                    <span>View Details</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Selected Closing Details Card / Modal */}
            {selectedClosing && (
                <div className="cch-modal-backdrop" onClick={() => setSelectedClosing(null)}>
                    <div className="cch-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="cch-modal-header">
                            <div className="cch-modal-title">
                                <FileSpreadsheet size={20} style={{ color: "#38bdf8" }} />
                                <div>
                                    <h3>Closing Audit Details</h3>
                                    <span className="cch-modal-date-sub">
                                        Date: {selectedClosing.closing_date}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="cch-modal-close-btn"
                                onClick={() => setSelectedClosing(null)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="cch-modal-body">
                            {/* Summary 4-box grid */}
                            <div className="cch-summary-grid">
                                <div className="cch-sum-box">
                                    <span className="cch-sum-label">Expected Cash</span>
                                    <strong className="cch-sum-val">
                                        ₹{formatAmount(selectedClosing.expected_cash)}
                                    </strong>
                                </div>

                                <div className="cch-sum-box">
                                    <span className="cch-sum-label">Actual Counted</span>
                                    <strong className="cch-sum-val emerald">
                                        ₹{formatAmount(selectedClosing.actual_cash)}
                                    </strong>
                                </div>

                                <div className="cch-sum-box">
                                    <span className="cch-sum-label">Audit Difference</span>
                                    <strong
                                        className={`cch-sum-val ${Number(selectedClosing.difference) === 0 ? "emerald" : Number(selectedClosing.difference) < 0 ? "rose" : "amber"}`}
                                    >
                                        {Number(selectedClosing.difference) < 0
                                            ? `-₹${formatAmount(Math.abs(selectedClosing.difference))}`
                                            : `₹${formatAmount(selectedClosing.difference)}`
                                        }
                                    </strong>
                                </div>

                                <div className="cch-sum-box">
                                    <span className="cch-sum-label">Status</span>
                                    <span className={`cch-status-pill ${selectedClosing.status?.toLowerCase()}`}>
                                        {selectedClosing.status}
                                    </span>
                                </div>
                            </div>

                            {/* Denominations breakdown */}
                            <div className="cch-notes-breakdown-section">
                                <h4>
                                    <Banknote size={16} style={{ color: "#34d399" }} />
                                    <span>Denomination Note Breakdown</span>
                                </h4>

                                <div className="cch-notes-grid">
                                    {notes.map((n) => {
                                        const count = Number(selectedClosing.denominations?.[n.name]) || 0;
                                        const subtotal = count * n.value;

                                        return (
                                            <div className="cch-note-box" key={n.name}>
                                                <div className="cch-note-top">
                                                    <span className="cch-note-tag" style={{ color: n.color, borderColor: `${n.color}40`, background: `${n.color}15` }}>
                                                        {n.label}
                                                    </span>
                                                    <span className="cch-note-count">
                                                        × {count} pcs
                                                    </span>
                                                </div>
                                                <div className="cch-note-subtotal">
                                                    ₹{subtotal.toLocaleString("en-IN")}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CashClosingHistory;