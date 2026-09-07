import { Landmark, CheckCircle } from "lucide-react";
import "./Charts.css";

const BANK_COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#ec4899"  // Pink
];

const BankBalanceChart = ({ banks = [] }) => {
    const totalOnlineBalance = banks.reduce((sum, b) => sum + Number(b.online_balance || 0), 0);

    const formatINR = (val) => {
        return Number(val || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className="chart-card">
            {/* Header with Anti-Collision Layout */}
            <div className="chart-header">
                <div className="chart-title-wrap">
                    <div className="chart-icon-box blue">
                        <Landmark size={18} />
                    </div>
                    <div>
                        <h3 className="chart-title">Online Bank Balance Share</h3>
                        <p className="chart-subtitle">Digital fund allocations across accounts</p>
                    </div>
                </div>
                <div className="chart-header-badge badge-primary">
                    Total: ₹{formatINR(totalOnlineBalance)}
                </div>
            </div>

            {/* Visual Proportional Segmented Bank Allocation Bar */}
            {banks.length > 0 && totalOnlineBalance > 0 && (
                <div className="segmented-flow-wrap" style={{ marginBottom: "14px" }}>
                    <div className="segmented-flow-bar" style={{ height: "10px" }}>
                        {banks.map((b, idx) => {
                            const bal = Number(b.online_balance || 0);
                            const pct = Math.round((bal / totalOnlineBalance) * 100);
                            if (pct <= 0) return null;
                            return (
                                <div
                                    key={b.id || idx}
                                    style={{
                                        width: `${pct}%`,
                                        backgroundColor: BANK_COLORS[idx % BANK_COLORS.length],
                                        height: "100%"
                                    }}
                                    title={`${b.bank_name}: ${pct}% (₹${formatINR(bal)})`}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Banks List with Clean 2-Tier Anti-Collision Layout */}
            {banks.length === 0 ? (
                <div style={{ textAlign: "center", color: "#64748b", padding: "40px 0", fontSize: "13px" }}>
                    No bank accounts connected yet.
                </div>
            ) : (
                <div className="bank-chart-list">
                    {banks.map((b, idx) => {
                        const balance = Number(b.online_balance || 0);
                        const pct = totalOnlineBalance > 0 ? Math.round((balance / totalOnlineBalance) * 100) : 0;
                        const color = BANK_COLORS[idx % BANK_COLORS.length];

                        return (
                            <div key={b.id || b.csp_id} className="bank-chart-item">
                                {/* Top Row: Bank Name and Amount */}
                                <div className="bank-row-top">
                                    <div className="bank-name-group">
                                        <span
                                            style={{
                                                width: "8px",
                                                height: "8px",
                                                borderRadius: "50%",
                                                backgroundColor: color,
                                                display: "inline-block",
                                                flexShrink: 0
                                            }}
                                        />
                                        <span className="bank-name-text" title={b.bank_name}>
                                            {b.bank_name}
                                        </span>
                                    </div>
                                    <span className="bank-chart-amount">₹{formatINR(balance)}</span>
                                </div>

                                {/* Bottom Row: CSP ID and Progress Bar with Percentage */}
                                <div className="bank-row-bottom">
                                    <span className="bank-chart-csp">CSP: {b.csp_id}</span>
                                    <div className="bank-progress-group">
                                        <div className="denom-progress-track">
                                            <div
                                                className="denom-progress-fill"
                                                style={{
                                                    width: `${pct}%`,
                                                    backgroundColor: pct > 0 ? color : "#1e293b"
                                                }}
                                            />
                                        </div>
                                        <span className="bank-pct-chip">{pct}% share</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Footer Summary Pill */}
            <div className="chart-footer-pill">
                <CheckCircle size={14} style={{ color: "#3b82f6" }} />
                <span>Synchronized: <strong>{banks.length} Connected Accounts</strong></span>
            </div>
        </div>
    );
};

export default BankBalanceChart;
