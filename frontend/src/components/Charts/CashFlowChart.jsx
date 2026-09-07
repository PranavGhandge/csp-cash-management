import { ArrowDownLeft, ArrowUpRight, TrendingUp, Layers } from "lucide-react";
import "./Charts.css";

const CashFlowChart = ({ deposit = 0, withdrawal = 0 }) => {
    const depositNum = Number(deposit || 0);
    const withdrawalNum = Number(withdrawal || 0);
    const totalVolume = depositNum + withdrawalNum;

    const depositPct = totalVolume > 0 ? Math.round((depositNum / totalVolume) * 100) : 50;
    const withdrawalPct = totalVolume > 0 ? 100 - depositPct : 50;

    const netFlow = depositNum - withdrawalNum;

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
                    <div className="chart-icon-box emerald">
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <h3 className="chart-title">Today's Cash Flow Breakdown</h3>
                        <p className="chart-subtitle">Real-time Inflow vs Outflow ratio</p>
                    </div>
                </div>
                <div className={`chart-header-badge ${netFlow >= 0 ? "badge-success" : "badge-danger"}`}>
                    Net: {netFlow >= 0 ? `+₹${formatINR(netFlow)}` : `-₹${formatINR(Math.abs(netFlow))}`}
                </div>
            </div>

            {/* Inflow / Outflow Stat Boxes */}
            <div className="cash-flow-stats">
                <div className="flow-stat-box deposit">
                    <span className="flow-stat-label">
                        <ArrowDownLeft size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                        INFLOW (DEPOSIT)
                    </span>
                    <strong className="flow-stat-val">₹{formatINR(depositNum)}</strong>
                    <span className="flow-stat-pct deposit-pct">
                        {depositPct}% of volume
                    </span>
                </div>

                <div className="flow-stat-box withdrawal">
                    <span className="flow-stat-label">
                        <ArrowUpRight size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                        OUTFLOW (WITHDRAWAL)
                    </span>
                    <strong className="flow-stat-val">₹{formatINR(withdrawalNum)}</strong>
                    <span className="flow-stat-pct withdrawal-pct">
                        {withdrawalPct}% of volume
                    </span>
                </div>
            </div>

            {/* Combined Comparative Segmented Bar */}
            <div className="segmented-flow-wrap">
                <div className="flow-bar-info">
                    <span style={{ color: "#34d399", fontWeight: 700 }}>● Deposits {depositPct}%</span>
                    <span style={{ color: "#f87171", fontWeight: 700 }}>Withdrawals {withdrawalPct}% ●</span>
                </div>
                <div className="segmented-flow-bar">
                    <div
                        className="segment-fill deposit"
                        style={{ width: `${depositPct}%` }}
                        title={`Deposits: ${depositPct}%`}
                    />
                    <div
                        className="segment-fill withdrawal"
                        style={{ width: `${withdrawalPct}%` }}
                        title={`Withdrawals: ${withdrawalPct}%`}
                    />
                </div>
            </div>

            {/* Detailed Volume Breakdown */}
            <div className="flow-bars-container">
                <div className="flow-bar-row">
                    <div className="flow-bar-info">
                        <span>Deposits Share</span>
                        <span>₹{formatINR(depositNum)}</span>
                    </div>
                    <div className="flow-bar-track">
                        <div
                            className="flow-bar-fill deposit"
                            style={{ width: `${depositPct}%` }}
                        />
                    </div>
                </div>

                <div className="flow-bar-row">
                    <div className="flow-bar-info">
                        <span>Withdrawals Share</span>
                        <span>₹{formatINR(withdrawalNum)}</span>
                    </div>
                    <div className="flow-bar-track">
                        <div
                            className="flow-bar-fill withdrawal"
                            style={{ width: `${withdrawalPct}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Footer Summary Pill */}
            <div className="chart-footer-pill">
                <Layers size={14} style={{ color: "#3b82f6" }} />
                <span>Total Turnover: <strong>₹{formatINR(totalVolume)}</strong></span>
            </div>
        </div>
    );
};

export default CashFlowChart;
