import { Banknote, ShieldCheck } from "lucide-react";
import "./Charts.css";

const DenominationChart = ({ physicalCash = {} }) => {
    const denominations = [
        { label: "₹500", key: "note_500", value: 500, bgClass: "note-500-bg" },
        { label: "₹200", key: "note_200", value: 200, bgClass: "note-200-bg" },
        { label: "₹100", key: "note_100", value: 100, bgClass: "note-100-bg" },
        { label: "₹50",  key: "note_50",  value: 50,  bgClass: "note-50-bg" },
        { label: "₹20",  key: "note_20",  value: 20,  bgClass: "note-20-bg" },
        { label: "₹10",  key: "note_10",  value: 10,  bgClass: "note-10-bg" }
    ];

    const totalCash = Number(physicalCash?.total_amount || 0);

    const totalNotesCount = denominations.reduce((sum, d) => {
        return sum + Number(physicalCash?.[d.key] || 0);
    }, 0);

    const formatINR = (val) => {
        return Number(val || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    return (
        <div className="chart-card">
            {/* Header */}
            <div className="chart-header">
                <div className="chart-title-wrap">
                    <div className="chart-icon-box purple">
                        <Banknote size={18} />
                    </div>
                    <div>
                        <h3 className="chart-title">Denomination Distribution</h3>
                        <p className="chart-subtitle">Vault composition by note value</p>
                    </div>
                </div>
                <span className="badge badge-info">
                    Total: ₹{Number(totalCash).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
            </div>

            {/* List of Denominations with sleek compact progress */}
            <div className="denom-chart-list">
                {denominations.map((denom) => {
                    const count = Number(physicalCash?.[denom.key] || 0);
                    const subtotal = count * denom.value;
                    const pct = totalCash > 0 ? Math.min(Math.round((subtotal / totalCash) * 100), 100) : 0;

                    return (
                        <div key={denom.key} className="denom-chart-row">
                            <div className={`denom-badge-pill ${denom.bgClass}`}>
                                {denom.label}
                            </div>
                            <div className="denom-progress-track">
                                <div
                                    className={`denom-progress-fill ${denom.bgClass}`}
                                    style={{ width: `${pct}%` }}
                                    title={`${pct}% of vault cash`}
                                />
                            </div>
                            <div className="denom-row-value">
                                <span>₹{formatINR(subtotal)}</span>
                                <span className="denom-row-count">({count} pcs)</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Summary Pill */}
            <div className="chart-footer-pill">
                <ShieldCheck size={14} style={{ color: "#7c3aed" }} />
                <span>Physical Inventory: <strong>{totalNotesCount.toLocaleString("en-IN")} pcs</strong> in vault</span>
            </div>
        </div>
    );
};

export default DenominationChart;
