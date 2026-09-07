import { useEffect, useState, useCallback } from "react";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
    History,
    Search,
    RotateCcw,
    Eye,
    X,
    Banknote,
    Landmark,
    User,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    Loader2,
    RefreshCw,
    Shield
} from "lucide-react";
import "./TransactionHistory.css";

const notes = [
    { name: "note_500", label: "₹500 Note", value: 500, color: "#34d399" },
    { name: "note_200", label: "₹200 Note", value: 200, color: "#fb923c" },
    { name: "note_100", label: "₹100 Note", value: 100, color: "#818cf8" },
    { name: "note_50", label: "₹50 Note", value: 50, color: "#22d3ee" },
    { name: "note_20", label: "₹20 Note", value: 20, color: "#f472b6" },
    { name: "note_10", label: "₹10 Note", value: 10, color: "#a78bfa" }
];

const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const TransactionHistory = () => {
    const toast = useToast();

    const [transactions, setTransactions] = useState([]);
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [bankId, setBankId] = useState("");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const fetchBanks = useCallback(async () => {
        try {
            const result = await apiRequest("/api/bank");
            setBanks(result?.data || []);
        } catch (err) {
            console.error("Fetch banks error:", err);
        }
    }, []);

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();
            params.append("page", page);
            params.append("limit", limit);

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (transactionType) {
                params.append("transaction_type", transactionType);
            }

            if (bankId) {
                params.append("bank_id", bankId);
            }

            const result = await apiRequest(`/api/transaction?${params.toString()}`);
            setTransactions(result?.data || []);
            const count = result?.data?.length || 0;
            setTotalPages(Math.max(1, Math.ceil(count / limit)));

        } catch (err) {
            console.error("Fetch transactions error:", err);
            toast.error(err.message || "Failed to load transactions.");
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, transactionType, bankId, toast]);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchTransactions();
    };

    const handleReset = () => {
        setSearch("");
        setTransactionType("");
        setBankId("");
        setPage(1);
    };

    const handleViewDetails = async (id) => {
        try {
            setDetailsLoading(true);
            const result = await apiRequest(`/api/transaction/${id}`);
            setSelectedTransaction(result?.data);
        } catch (err) {
            console.error("Fetch transaction details error:", err);
            toast.error(err.message || "Failed to load transaction details.");
        } finally {
            setDetailsLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    return (
        <div className="txh-page-container">
            {/* Header with Logo Badge */}
            <div className="txh-page-header">
                <div className="txh-header-logo-badge">
                    <History size={24} />
                </div>
                <div className="txh-header-titles">
                    <h1>Transaction History</h1>
                </div>
            </div>

            {/* Filter Bar Card */}
            <div className="txh-dark-card txh-filter-card">
                <form onSubmit={handleSearch} className="txh-filter-form">
                    {/* Search Field */}
                    <div className="txh-filter-group">
                        <label htmlFor="txh_search">Search</label>
                        <div className="txh-input-box">
                            <Search size={15} className="txh-field-icon" />
                            <input
                                id="txh_search"
                                type="text"
                                className="txh-real-input"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Customer name or ref..."
                            />
                        </div>
                    </div>

                    {/* Transaction Type Filter */}
                    <div className="txh-filter-group">
                        <label htmlFor="txh_type">Transaction Type</label>
                        <div className="txh-input-box">
                            <select
                                id="txh_type"
                                className="txh-real-select"
                                value={transactionType}
                                onChange={(e) => {
                                    setTransactionType(e.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="">All Types</option>
                                <option value="WITHDRAWAL">Withdrawal (Cash Out)</option>
                                <option value="DEPOSIT">Deposit (Cash In)</option>
                            </select>
                        </div>
                    </div>

                    {/* Bank Filter */}
                    <div className="txh-filter-group">
                        <label htmlFor="txh_bank">Bank</label>
                        <div className="txh-input-box">
                            <Landmark size={15} className="txh-field-icon" />
                            <select
                                id="txh_bank"
                                className="txh-real-select"
                                value={bankId}
                                onChange={(e) => {
                                    setBankId(e.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="">All Banks</option>
                                {banks.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.bank_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="txh-filter-actions">
                        <button type="submit" className="txh-btn-search">
                            <Search size={14} />
                            <span>Filter</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="txh-btn-reset"
                            title="Reset all filters"
                        >
                            <RotateCcw size={14} />
                            <span>Reset</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Table Card */}
            <div className="txh-dark-card">
                <div className="txh-table-header-row">
                    <div className="txh-table-title-wrap">
                        <History size={18} style={{ color: "#38bdf8" }} />
                        <h2>Audit Records</h2>
                    </div>
                    <span className="txh-records-pill">
                        {transactions.length} Records Found
                    </span>
                </div>

                {loading ? (
                    <div className="txh-loading-box">
                        <RefreshCw size={22} className="txh-spin-icon" />
                        <span>Loading transaction audit records...</span>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="txh-empty-state">
                        <History size={36} style={{ color: "#475569", marginBottom: "8px" }} />
                        <p>No transaction records found.</p>
                        <span>Transactions processed at the counter will appear here in real time.</span>
                    </div>
                ) : (
                    <div className="txh-table-wrapper">
                        <table className="txh-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Bank</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Operator</th>
                                    <th>Date & Time</th>
                                    <th style={{ textAlign: "center" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id}>
                                        <td>
                                            <div className="txh-customer-cell">
                                                <div className="txh-user-avatar">
                                                    <User size={13} />
                                                </div>
                                                <strong className="txh-customer-name">
                                                    {tx.customer_name}
                                                </strong>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="txh-bank-cell">
                                                <span className="txh-bank-name">{tx.bank?.bank_name}</span>
                                                <small className="txh-csp-sub">{tx.bank?.csp_id}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`txh-type-badge ${tx.transaction_type === "WITHDRAWAL" ? "type-withdrawal" : "type-deposit"}`}
                                            >
                                                {tx.transaction_type === "WITHDRAWAL" ? (
                                                    <ArrowUpRight size={12} />
                                                ) : (
                                                    <ArrowDownLeft size={12} />
                                                )}
                                                <span>{tx.transaction_type}</span>
                                            </span>
                                        </td>
                                        <td className="txh-amount-cell">
                                            <strong
                                                style={{
                                                    color: tx.transaction_type === "WITHDRAWAL" ? "#f87171" : "#34d399"
                                                }}
                                            >
                                                ₹{formatAmount(tx.amount)}
                                            </strong>
                                        </td>
                                        <td>
                                            <span className="txh-operator-name">
                                                {tx.operator?.first_name} {tx.operator?.last_name || ""}
                                            </span>
                                        </td>
                                        <td className="txh-date-cell">
                                            <div className="txh-date-wrap">
                                                <Calendar size={13} style={{ color: "#64748b" }} />
                                                <span>{formatDate(tx.transaction_date)}</span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <button
                                                className="txh-btn-view"
                                                onClick={() => handleViewDetails(tx.id)}
                                                title="View Denominations & Audit Details"
                                            >
                                                <Eye size={13} />
                                                <span>View</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && transactions.length > 0 && (
                    <div className="txh-pagination">
                        <button
                            className="txh-page-btn"
                            disabled={page <= 1}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            Previous
                        </button>
                        <span className="txh-page-info">
                            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                        </span>
                        <button
                            className="txh-page-btn"
                            disabled={page >= totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {(selectedTransaction || detailsLoading) && (
                <div className="txh-modal-backdrop" onClick={() => setSelectedTransaction(null)}>
                    <div className="txh-modal-card" onClick={(e) => e.stopPropagation()}>
                        {detailsLoading ? (
                            <div className="txh-modal-loading">
                                <Loader2 size={24} className="txh-spin-icon" />
                                <span>Loading details...</span>
                            </div>
                        ) : (
                            <>
                                <div className="txh-modal-header">
                                    <div className="txh-modal-title">
                                        <Shield size={20} style={{ color: "#38bdf8" }} />
                                        <h3>Transaction Details</h3>
                                    </div>
                                    <button
                                        className="txh-modal-close-btn"
                                        onClick={() => setSelectedTransaction(null)}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="txh-modal-body">
                                    {/* Meta grid */}
                                    <div className="txh-meta-grid">
                                        <div className="txh-meta-item">
                                            <span className="txh-meta-label">Customer Name</span>
                                            <strong className="txh-meta-val">{selectedTransaction.customer_name}</strong>
                                        </div>

                                        <div className="txh-meta-item">
                                            <span className="txh-meta-label">Bank & CSP</span>
                                            <strong className="txh-meta-val">{selectedTransaction.bank?.bank_name} ({selectedTransaction.bank?.csp_id})</strong>
                                        </div>

                                        <div className="txh-meta-item">
                                            <span className="txh-meta-label">Type</span>
                                            <span
                                                className={`txh-type-badge ${selectedTransaction.transaction_type === "WITHDRAWAL" ? "type-withdrawal" : "type-deposit"}`}
                                                style={{ display: "inline-flex", width: "fit-content" }}
                                            >
                                                {selectedTransaction.transaction_type}
                                            </span>
                                        </div>

                                        <div className="txh-meta-item">
                                            <span className="txh-meta-label">Total Amount</span>
                                            <strong
                                                className="txh-meta-val"
                                                style={{
                                                    fontSize: "18px",
                                                    color: selectedTransaction.transaction_type === "WITHDRAWAL" ? "#f87171" : "#34d399"
                                                }}
                                            >
                                                ₹{formatAmount(selectedTransaction.amount)}
                                            </strong>
                                        </div>

                                        <div className="txh-meta-item">
                                            <span className="txh-meta-label">Processed By</span>
                                            <strong className="txh-meta-val">
                                                {selectedTransaction.operator?.first_name} {selectedTransaction.operator?.last_name || ""}
                                            </strong>
                                        </div>

                                        <div className="txh-meta-item">
                                            <span className="txh-meta-label">Timestamp</span>
                                            <strong className="txh-meta-val">{formatDate(selectedTransaction.transaction_date)}</strong>
                                        </div>
                                    </div>

                                    {/* Denominations */}
                                    <div className="txh-modal-notes-section">
                                        <h4>
                                            <Banknote size={16} style={{ color: "#34d399" }} />
                                            <span>Note Denomination Breakdown</span>
                                        </h4>

                                        {selectedTransaction.denominations ? (
                                            <div className="txh-modal-notes-grid">
                                                {notes.map((n) => {
                                                    const count = Number(selectedTransaction.denominations[n.name]) || 0;
                                                    if (count === 0) return null;
                                                    const subtotal = count * n.value;

                                                    return (
                                                        <div className="txh-modal-note-box" key={n.name}>
                                                            <span className="txh-modal-note-tag" style={{ color: n.color, borderColor: `${n.color}40`, background: `${n.color}15` }}>
                                                                {n.label}
                                                            </span>
                                                            <span className="txh-modal-note-count">
                                                                × {count} pcs
                                                            </span>
                                                            <strong className="txh-modal-note-sub">
                                                                ₹{subtotal.toLocaleString("en-IN")}
                                                            </strong>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="txh-no-notes">No denomination data attached to this record.</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;