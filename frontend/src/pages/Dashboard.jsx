import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../services/api";
import { useToast } from "../context/ToastContext";
import CashFlowChart from "../components/Charts/CashFlowChart";
import BankBalanceChart from "../components/Charts/BankBalanceChart";
import {
    ArrowDownLeft,
    ArrowUpRight,
    Wallet,
    Banknote,
    RefreshCw,
    Landmark,
    Lock,
    ShieldCheck,
    AlertCircle,
    Coins,
    ArrowLeftRight,
    CheckCircle2
} from "lucide-react";
import "./Dashboard.css";

const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const formatDifference = (amount) => {
    const value = Number(amount || 0);
    if (value < 0) {
        return `-₹${Math.abs(value).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }
    return `₹${value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const toast = useToast();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );
    const role = user?.role || "ADMIN";

    const fetchDashboard = useCallback(async (isManualRefresh = false) => {
        try {
            if (isManualRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError("");

            const result = await apiRequest("/api/dashboard");
            setDashboard(result.data);

            if (isManualRefresh) {
                toast.success("Dashboard data synchronized successfully!");
            }
        } catch (err) {
            console.error("Dashboard error:", err);
            const msg = err.message || "Failed to load dashboard";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard(false);
    }, [fetchDashboard]);

    if (loading) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "450px",
                gap: "16px",
                color: "#94a3b8"
            }}>
                <RefreshCw size={36} style={{ animation: "dashSpin 1s linear infinite", color: "#3b82f6" }} />
                <h3 style={{ color: "#ffffff", fontWeight: 700, margin: 0 }}>
                    Loading Financial Overview...
                </h3>
                <p style={{ margin: 0, fontSize: "13px" }}>Connecting to CSP core banking database</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                background: "#111827",
                border: "1px solid #ef444450",
                borderRadius: "12px",
                padding: "36px",
                textAlign: "center",
                maxWidth: "500px",
                margin: "40px auto"
            }}>
                <AlertCircle size={44} style={{ color: "#ef4444", marginBottom: "12px" }} />
                <h3 style={{ color: "#ffffff", fontWeight: 700, margin: 0 }}>Unable to Load Dashboard</h3>
                <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: "8px 0 20px" }}>{error}</p>
                <button
                    className="btn btn-primary"
                    onClick={() => fetchDashboard(false)}
                >
                    <RefreshCw size={16} />
                    <span>Retry Connection</span>
                </button>
            </div>
        );
    }

    if (!dashboard) return null;

    const physicalCash = dashboard.physical_cash || {};
    const banks = dashboard.banks || [];
    const today = dashboard.today || {};
    const lastClosing = dashboard.last_closing;

    const noteCards = [
        { label: "₹500 Note", key: "note_500", val: 500, color: "#34d399" },
        { label: "₹200 Note", key: "note_200", val: 200, color: "#fb923c" },
        { label: "₹100 Note", key: "note_100", val: 100, color: "#818cf8" },
        { label: "₹50 Note",  key: "note_50",  val: 50,  color: "#22d3ee" },
        { label: "₹20 Note",  key: "note_20",  val: 20,  color: "#f472b6" },
        { label: "₹10 Note",  key: "note_10",  val: 10,  color: "#a78bfa" }
    ];

    const isOperator = role === "OPERATOR";

    return (
        <div className="dashboard-container">
            {/* 1. Top Hero Header */}
            <div className="dashboard-top-hero">
                <div className="hero-welcome-wrap">
                    <h1 className="hero-welcome-title">
                        Welcome{" "}
                        <span className="hero-name-gradient">
                            {user?.first_name || "Pranav"} {user?.last_name || "Ghandge"}
                        </span>
                    </h1>
                </div>

                <button
                    className="btn-sync-live"
                    onClick={() => fetchDashboard(true)}
                    disabled={refreshing}
                    title="Sync live ledger data"
                >
                    <RefreshCw
                        size={15}
                        style={{ animation: refreshing ? "dashSpin 1s linear infinite" : "none" }}
                    />
                    <span>{refreshing ? "Syncing..." : "Sync Live Data"}</span>
                </button>
            </div>

            {/* 2. Quick Actions Bar */}
            <div className="quick-actions-bar">
                <div className="quick-actions-label">
                    <span style={{ fontSize: "15px", lineHeight: 1 }}>⊕</span>
                    <span>QUICK ACTIONS</span>
                </div>

                {!isOperator && (
                    <button
                        className="qa-btn purple"
                        onClick={() => navigate("/admin/opening-balance")}
                    >
                        <Wallet size={15} />
                        <span>Set Opening Balance</span>
                    </button>
                )}

                {!isOperator && (
                    <button
                        className="qa-btn green"
                        onClick={() => navigate("/admin/physical-cash-opening")}
                    >
                        <Coins size={15} />
                        <span>Physical Cash Opening</span>
                    </button>
                )}

                <button
                    className="qa-btn dark"
                    onClick={() => navigate(isOperator ? "/operator/transactions" : "/admin/transactions")}
                >
                    <ArrowLeftRight size={15} />
                    <span>Record Transaction</span>
                </button>

                <button
                    className="qa-btn amber"
                    onClick={() => navigate(isOperator ? "/operator/closing" : "/admin/closing")}
                >
                    <CheckCircle2 size={15} />
                    <span>Cash Closing</span>
                </button>
            </div>

            {/* 3. Top 3 KPI Metric Cards */}
            <section className="kpi-grid-top">
                {/* Today's Deposits */}
                <div className="kpi-card-dark accent-green">
                    <div className="kpi-top-row">
                        <span>Today's Deposits</span>
                        <div className="kpi-icon-chip green">
                            <ArrowDownLeft size={18} />
                        </div>
                    </div>
                    <div className="kpi-amount-val">₹{formatAmount(today.total_deposit)}</div>
                </div>

                {/* Today's Withdrawals */}
                <div className="kpi-card-dark accent-amber">
                    <div className="kpi-top-row">
                        <span>Today's Withdrawals</span>
                        <div className="kpi-icon-chip amber">
                            <ArrowUpRight size={18} />
                        </div>
                    </div>
                    <div className="kpi-amount-val">₹{formatAmount(today.total_withdrawal)}</div>
                </div>

                {/* Expected Physical Cash */}
                <div className="kpi-card-dark accent-blue">
                    <div className="kpi-top-row">
                        <span>Expected Physical Cash</span>
                        <div className="kpi-icon-chip blue">
                            <Wallet size={18} />
                        </div>
                    </div>
                    <div className="kpi-amount-val">₹{formatAmount(today.expected_cash)}</div>
                </div>
            </section>

            {/* 4. Physical Vault Cash & Note Inventory */}
            <section className="vault-inventory-container">
                <div className="vault-inventory-header">
                    <div className="vault-header-title">
                        <Banknote size={22} style={{ color: "#34d399" }} />
                        <div>
                            <h3>Physical Vault Cash & Note Inventory</h3>
                        </div>
                    </div>
                    <div className="vault-total-pill">
                        Total Vault Cash: ₹{formatAmount(physicalCash.total_amount)}
                    </div>
                </div>

                <div className="vault-notes-grid">
                    {noteCards.map((n) => {
                        const count = Number(physicalCash[n.key] || 0);
                        const subtotal = count * n.val;

                        return (
                            <div key={n.key} className="note-box-dark">
                                <div className="note-top-meta">
                                    <span className="note-badge-tag" style={{ color: n.color }}>
                                        {n.label}
                                    </span>
                                    <span className="note-pcs-pill">
                                        {count.toLocaleString("en-IN")} pcs
                                    </span>
                                </div>
                                <div className="note-amount-bold">
                                    ₹{formatAmount(subtotal)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 5. Connected Bank Accounts (Moved directly below Note Inventory as requested!) */}
            <section>
                <div className="dash-section-header">
                    <h2>
                        <Landmark size={18} style={{ color: "#3b82f6" }} />
                        <span>Connected Bank Accounts</span>
                    </h2>
                </div>

                {banks.length === 0 ? (
                    <div style={{
                        background: "#111827",
                        border: "1px dashed #1e293b",
                        borderRadius: "12px",
                        padding: "36px",
                        textAlign: "center",
                        color: "#64748b"
                    }}>
                        No active bank accounts found.
                    </div>
                ) : (
                    <div className="bank-cards-grid">
                        {banks.map((bank) => (
                            <div className="bank-passbook-card" key={bank.id || bank.csp_id}>
                                <div className="bank-card-top">
                                    <div>
                                        <h4 className="bank-brand-title">{bank.bank_name}</h4>
                                        <span className="bank-csp-badge">
                                            CSP ID: {bank.csp_id}
                                        </span>
                                    </div>
                                    <span className="badge badge-success">Online</span>
                                </div>

                                <div className="bank-balance-highlight">
                                    <span>Available Balance</span>
                                    <strong>₹{formatAmount(bank.online_balance)}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 6. Analytics & Fund Distribution (Moved after Connected Bank Accounts as requested!) */}
            <section>
                <div className="dash-section-header">
                    <h2>
                        <ShieldCheck size={18} style={{ color: "#3b82f6" }} />
                        <span>Analytics & Fund Distribution</span>
                    </h2>
                </div>

                <div className="charts-grid-layout">
                    <CashFlowChart
                        deposit={today.total_deposit}
                        withdrawal={today.total_withdrawal}
                    />
                    <BankBalanceChart banks={banks} />
                </div>
            </section>

            {/* 7. Last Cash Closing Audit (At the very bottom as requested!) */}
            <section>
                <div className="dash-section-header">
                    <h2>
                        <Lock size={18} style={{ color: "#3b82f6" }} />
                        <span>Last Cash Closing Audit</span>
                    </h2>
                </div>

                {!lastClosing ? (
                    <div style={{
                        background: "#111827",
                        border: "1px dashed #1e293b",
                        borderRadius: "12px",
                        padding: "36px",
                        textAlign: "center",
                        color: "#64748b"
                    }}>
                        No cash closing record found yet.
                    </div>
                ) : (
                    <div className="closing-summary-card">
                        <div className="closing-data-item">
                            <label>Closing Date</label>
                            <strong>{lastClosing.closing_date}</strong>
                        </div>

                        <div className="closing-data-item">
                            <label>Expected Cash</label>
                            <strong>₹{formatAmount(lastClosing.expected_cash)}</strong>
                        </div>

                        <div className="closing-data-item">
                            <label>Actual Cash</label>
                            <strong>₹{formatAmount(lastClosing.actual_cash)}</strong>
                        </div>

                        <div className="closing-data-item">
                            <label>Discrepancy</label>
                            <strong style={{
                                color: Number(lastClosing.difference || 0) < 0
                                    ? "#f87171"
                                    : Number(lastClosing.difference || 0) > 0
                                    ? "#fbbf24"
                                    : "#34d399"
                            }}>
                                {formatDifference(lastClosing.difference)}
                            </strong>
                        </div>

                        <div className="closing-data-item">
                            <label>Audit Status</label>
                            <div>
                                <span className={`badge ${
                                    (lastClosing.status || "").toLowerCase() === "matched"
                                        ? "badge-success"
                                        : (lastClosing.status || "").toLowerCase() === "short"
                                        ? "badge-danger"
                                        : "badge-warning"
                                }`}>
                                    {lastClosing.status || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;