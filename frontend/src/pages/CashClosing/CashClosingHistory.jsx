import { useEffect, useState } from "react";
import apiRequest from "../../services/api";
import "./CashClosingHistory.css";

const CashClosingHistory = () => {
    const [closings, setClosings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedClosing, setSelectedClosing] = useState(null);

    const fetchClosings = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await apiRequest(
                "/api/closing?page=1&limit=10"
            );

            setClosings(result.data || []);
        } catch (error) {
            console.error("Cash closing history error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClosings();
    }, []);

    if (loading) {
        return (
            <div className="cash-closing-history-page">
                <p>Loading closing history...</p>
            </div>
        );
    }

    return (
        <div className="cash-closing-history-page">

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Cash Closing History</h1>
                    <p>
                        View previous cash closing records
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* History Table */}
            <div className="closing-history-card">

                <table>
                    <thead>
                        <tr>
                            <th>Closing Date</th>
                            <th>Expected Cash</th>
                            <th>Actual Cash</th>
                            <th>Difference</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {closings.length === 0 ? (
                            <tr>
                                <td colSpan="6">
                                    No closing records found
                                </td>
                            </tr>
                        ) : (
                            closings.map((closing) => (
                                <tr key={closing.id}>

                                    <td>
                                        {closing.closing_date}
                                    </td>

                                    <td>
                                        ₹
                                        {Number(
                                            closing.expected_cash
                                        ).toLocaleString("en-IN")}
                                    </td>

                                    <td>
                                        ₹
                                        {Number(
                                            closing.actual_cash
                                        ).toLocaleString("en-IN")}
                                    </td>

                                    <td>
                                        ₹
                                        {Number(
                                            closing.difference
                                        ).toLocaleString("en-IN")}
                                    </td>

                                    <td>
                                        <span
                                            className={`status-badge ${closing.status?.toLowerCase()}`}
                                        >
                                            {closing.status}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="view-details-btn"
                                            onClick={() =>
                                                setSelectedClosing(
                                                    closing
                                                )
                                            }
                                        >
                                            View Details
                                        </button>
                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>
                </table>

            </div>

            {/* Closing Details */}
            {selectedClosing && (
                <div className="closing-details-card">

                    <div className="closing-details-header">

                        <div>
                            <h2>Closing Details</h2>

                            <p>
                                Closing Date:{" "}
                                <strong>
                                    {selectedClosing.closing_date}
                                </strong>
                            </p>
                        </div>

                        <button
                            className="close-details-btn"
                            onClick={() =>
                                setSelectedClosing(null)
                            }
                        >
                            Close
                        </button>

                    </div>

                    {/* Summary */}
                    <div className="closing-details-summary">

                        <div className="detail-summary-item">
                            <span>Expected Cash</span>

                            <strong>
                                ₹
                                {Number(
                                    selectedClosing.expected_cash
                                ).toLocaleString("en-IN")}
                            </strong>
                        </div>

                        <div className="detail-summary-item">
                            <span>Actual Cash</span>

                            <strong>
                                ₹
                                {Number(
                                    selectedClosing.actual_cash
                                ).toLocaleString("en-IN")}
                            </strong>
                        </div>

                        <div className="detail-summary-item">
                            <span>Difference</span>

                            <strong>
                                ₹
                                {Number(
                                    selectedClosing.difference
                                ).toLocaleString("en-IN")}
                            </strong>
                        </div>

                        <div className="detail-summary-item">
                            <span>Status</span>

                            <strong
                                className={`status-text ${selectedClosing.status?.toLowerCase()}`}
                            >
                                {selectedClosing.status}
                            </strong>
                        </div>

                    </div>

                    {/* Denominations */}
                    <div className="denomination-section">

                        <h3>Denominations</h3>

                        <div className="denomination-grid">

                            <div className="denomination-item">
                                <span>₹500</span>
                                <strong>
                                    ×{" "}
                                    {selectedClosing.denominations
                                        ?.note_500 || 0}
                                </strong>
                            </div>

                            <div className="denomination-item">
                                <span>₹200</span>
                                <strong>
                                    ×{" "}
                                    {selectedClosing.denominations
                                        ?.note_200 || 0}
                                </strong>
                            </div>

                            <div className="denomination-item">
                                <span>₹100</span>
                                <strong>
                                    ×{" "}
                                    {selectedClosing.denominations
                                        ?.note_100 || 0}
                                </strong>
                            </div>

                            <div className="denomination-item">
                                <span>₹50</span>
                                <strong>
                                    ×{" "}
                                    {selectedClosing.denominations
                                        ?.note_50 || 0}
                                </strong>
                            </div>

                            <div className="denomination-item">
                                <span>₹20</span>
                                <strong>
                                    ×{" "}
                                    {selectedClosing.denominations
                                        ?.note_20 || 0}
                                </strong>
                            </div>

                            <div className="denomination-item">
                                <span>₹10</span>
                                <strong>
                                    ×{" "}
                                    {selectedClosing.denominations
                                        ?.note_10 || 0}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default CashClosingHistory;