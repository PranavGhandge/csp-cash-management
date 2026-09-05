import { useEffect, useState } from "react";
import apiRequest from "../services/api";
import "./Dashboard.css";
import Sidebar from "../components/Sidebar";

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

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiRequest("/api/dashboard");

            setDashboard(result.data);

        } catch (error) {
            console.error("Dashboard error:", error);
            setError(error.message || "Failed to load dashboard");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    /* ---------------- Loading ---------------- */

    if (loading) {
        return (
            <div className="app-layout">

                <Sidebar />

                <main className="dashboard">

                    <div className="dashboard-loading">
                        <h2>Loading dashboard...</h2>
                    </div>

                </main>

            </div>
        );
    }

    /* ---------------- Error ---------------- */

    if (error) {
        return (
            <div className="app-layout">

                <Sidebar />

                <main className="dashboard">

                    <div className="dashboard-error">

                        <h2>
                            Something went wrong
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button onClick={fetchDashboard}>
                            Retry
                        </button>

                    </div>

                </main>

            </div>
        );
    }

    if (!dashboard) {
        return null;
    }

    const physicalCash = dashboard.physical_cash || {};

    const banks = dashboard.banks || [];

    const today = dashboard.today || {};

    const lastClosing = dashboard.last_closing;

    return (
        <div className="app-layout">

            {/* ================= Sidebar ================= */}

            <Sidebar />


            {/* ================= Main Dashboard ================= */}

            <main className="dashboard">

                {/* ================= Header ================= */}

                <div className="dashboard-header">

                    <div>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Welcome {user?.first_name || "User"} 👋
                        </p>

                        <small>
                            Role: {user?.role || "N/A"}
                        </small>

                    </div>

                    <button
                        className="dashboard-refresh-btn"
                        onClick={fetchDashboard}
                    >
                        Refresh
                    </button>

                </div>


                {/* ================= Quick Summary ================= */}

                <section>

                    <h2>
                        Today's Overview
                    </h2>

                    <div className="summary-grid">

                        {/* Deposit */}

                        <div className="summary-card">

                            <span>
                                Total Deposit
                            </span>

                            <strong>
                                ₹{formatAmount(today.total_deposit)}
                            </strong>

                        </div>


                        {/* Withdrawal */}

                        <div className="summary-card">

                            <span>
                                Total Withdrawal
                            </span>

                            <strong>
                                ₹{formatAmount(today.total_withdrawal)}
                            </strong>

                        </div>


                        {/* Transactions */}

                        <div className="summary-card">

                            <span>
                                Transactions
                            </span>

                            <strong>
                                {Number(today.transaction_count || 0)}
                            </strong>

                        </div>


                        {/* Expected Cash */}

                        <div className="summary-card">

                            <span>
                                Expected Cash
                            </span>

                            <strong>
                                ₹{formatAmount(today.expected_cash)}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* ================= Physical Cash ================= */}

                <section>

                    <h2>
                        Physical Cash
                    </h2>

                    <div className="cash-card">

                        <div className="cash-card-header">

                            <div>

                                <span>
                                    Current Physical Cash
                                </span>

                                <h3>
                                    ₹{formatAmount(physicalCash.total_amount)}
                                </h3>

                            </div>

                        </div>


                        <div className="denominations">

                            <div className="denomination-item">

                                <span>
                                    ₹500
                                </span>

                                <strong>
                                    × {Number(physicalCash.note_500 || 0)}
                                </strong>

                            </div>


                            <div className="denomination-item">

                                <span>
                                    ₹200
                                </span>

                                <strong>
                                    × {Number(physicalCash.note_200 || 0)}
                                </strong>

                            </div>


                            <div className="denomination-item">

                                <span>
                                    ₹100
                                </span>

                                <strong>
                                    × {Number(physicalCash.note_100 || 0)}
                                </strong>

                            </div>


                            <div className="denomination-item">

                                <span>
                                    ₹50
                                </span>

                                <strong>
                                    × {Number(physicalCash.note_50 || 0)}
                                </strong>

                            </div>


                            <div className="denomination-item">

                                <span>
                                    ₹20
                                </span>

                                <strong>
                                    × {Number(physicalCash.note_20 || 0)}
                                </strong>

                            </div>


                            <div className="denomination-item">

                                <span>
                                    ₹10
                                </span>

                                <strong>
                                    × {Number(physicalCash.note_10 || 0)}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================= Bank Balances ================= */}

                <section>

                    <div className="section-header">

                        <div>

                            <h2>
                                Bank Balances
                            </h2>

                            <p>
                                Current online CSP balance
                            </p>

                        </div>

                    </div>


                    {banks.length === 0 ? (

                        <div className="empty-state">

                            <p>
                                No banks found.
                            </p>

                        </div>

                    ) : (

                        <div className="bank-grid">

                            {banks.map((bank) => (

                                <div
                                    className="bank-card"
                                    key={bank.id}
                                >

                                    <div className="bank-card-header">

                                        <h3>
                                            {bank.bank_name}
                                        </h3>

                                    </div>

                                    <p>
                                        CSP ID: {bank.csp_id}
                                    </p>

                                    <strong>
                                        ₹{formatAmount(bank.online_balance)}
                                    </strong>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* ================= Last Closing ================= */}

                <section>

                    <h2>
                        Last Closing
                    </h2>


                    {!lastClosing ? (

                        <div className="empty-state">

                            <p>
                                No cash closing found yet.
                            </p>

                        </div>

                    ) : (

                        <div className="closing-card">

                            <div className="closing-info">

                                <span>
                                    Closing Date
                                </span>

                                <strong>
                                    {lastClosing.closing_date}
                                </strong>

                            </div>


                            <div className="closing-info">

                                <span>
                                    Expected Cash
                                </span>

                                <strong>
                                    ₹{formatAmount(
                                        lastClosing.expected_cash
                                    )}
                                </strong>

                            </div>


                            <div className="closing-info">

                                <span>
                                    Actual Cash
                                </span>

                                <strong>
                                    ₹{formatAmount(
                                        lastClosing.actual_cash
                                    )}
                                </strong>

                            </div>


                            <div className="closing-info">

                                <span>
                                    Difference
                                </span>

                                <strong>
                                    {formatDifference(
                                        lastClosing.difference
                                    )}
                                </strong>

                            </div>


                            <div className="closing-info">

                                <span>
                                    Status
                                </span>

                                <strong
                                    className={`closing-status ${
                                        lastClosing.status?.toLowerCase() || ""
                                    }`}
                                >
                                    {lastClosing.status || "N/A"}
                                </strong>

                            </div>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};

export default Dashboard;