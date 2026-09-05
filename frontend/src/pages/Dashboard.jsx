import { useEffect, useState } from "react";
import apiRequest from "../services/api";
import "./Dashboard.css";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiRequest("/api/dashboard");

            setDashboard(result.data);

        } catch (error) {
            console.error("Dashboard error:", error);
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <h2>Loading dashboard...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">

                <h2>Something went wrong</h2>

                <p>{error}</p>

                <button onClick={fetchDashboard}>
                    Retry
                </button>

            </div>
        );
    }

    return (
        <div className="app-layout">

            {/* Sidebar */}
            <Sidebar />


            {/* Main Dashboard */}
            <main className="dashboard">

                {/* Header */}
                <div className="dashboard-header">

                    <div>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Welcome {user?.first_name} 👋
                        </p>

                        <small>
                            Role: {user?.role}
                        </small>

                    </div>

                </div>


                {/* Physical Cash */}
                <section>

                    <h2>
                        Physical Cash
                    </h2>

                    <div className="cash-card">

                        <h3>
                            ₹{dashboard.physical_cash.total_amount}
                        </h3>

                        <div className="denominations">

                            <p>
                                ₹500 × {dashboard.physical_cash.note_500}
                            </p>

                            <p>
                                ₹200 × {dashboard.physical_cash.note_200}
                            </p>

                            <p>
                                ₹100 × {dashboard.physical_cash.note_100}
                            </p>

                            <p>
                                ₹50 × {dashboard.physical_cash.note_50}
                            </p>

                            <p>
                                ₹20 × {dashboard.physical_cash.note_20}
                            </p>

                            <p>
                                ₹10 × {dashboard.physical_cash.note_10}
                            </p>

                        </div>

                    </div>

                </section>


                {/* Bank Balances */}
                <section>

                    <h2>
                        Bank Balances
                    </h2>

                    <div className="bank-grid">

                        {dashboard.banks.map((bank) => (

                            <div
                                className="bank-card"
                                key={bank.id}
                            >

                                <h3>
                                    {bank.bank_name}
                                </h3>

                                <p>
                                    CSP ID: {bank.csp_id}
                                </p>

                                <strong>
                                    ₹{bank.online_balance}
                                </strong>

                            </div>

                        ))}

                    </div>

                </section>


                {/* Today's Summary */}
                <section>

                    <h2>
                        Today's Summary
                    </h2>

                    <div className="summary-grid">

                        <div className="summary-card">

                            <span>
                                Total Deposit
                            </span>

                            <strong>
                                ₹{dashboard.today.total_deposit}
                            </strong>

                        </div>


                        <div className="summary-card">

                            <span>
                                Total Withdrawal
                            </span>

                            <strong>
                                ₹{dashboard.today.total_withdrawal}
                            </strong>

                        </div>


                        <div className="summary-card">

                            <span>
                                Transactions
                            </span>

                            <strong>
                                {dashboard.today.transaction_count}
                            </strong>

                        </div>


                        <div className="summary-card">

                            <span>
                                Expected Cash
                            </span>

                            <strong>
                                ₹{dashboard.today.expected_cash}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* Last Closing */}
                <section>

                    <h2>
                        Last Closing
                    </h2>

                    <div className="closing-card">

                        <p>
                            Date:{" "}

                            <strong>
                                {dashboard.last_closing?.closing_date || "N/A"}
                            </strong>
                        </p>


                        <p>
                            Expected Cash:{" "}

                            <strong>
                                ₹{dashboard.last_closing?.expected_cash ?? 0}
                            </strong>
                        </p>


                        <p>
                            Actual Cash:{" "}

                            <strong>
                                ₹{dashboard.last_closing?.actual_cash ?? 0}
                            </strong>
                        </p>


                        <p>
                            Difference:{" "}

                            <strong>
                                ₹{dashboard.last_closing?.difference ?? 0}
                            </strong>
                        </p>


                        <p>
                            Status:{" "}

                            <strong>
                                {dashboard.last_closing?.status || "N/A"}
                            </strong>
                        </p>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default Dashboard;