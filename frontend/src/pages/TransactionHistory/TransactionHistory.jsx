import { useEffect, useState } from "react";
import apiRequest from "../../services/api";
import "./TransactionHistory.css";

const notes = [
    { name: "note_500", label: "₹500", value: 500 },
    { name: "note_200", label: "₹200", value: 200 },
    { name: "note_100", label: "₹100", value: 100 },
    { name: "note_50", label: "₹50", value: 50 },
    { name: "note_20", label: "₹20", value: 20 },
    { name: "note_10", label: "₹10", value: 10 }
];

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);

    const [banks, setBanks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [bankId, setBankId] = useState("");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [totalPages, setTotalPages] = useState(1);

    const [selectedTransaction, setSelectedTransaction] =
        useState(null);

    const [detailsLoading, setDetailsLoading] =
        useState(false);

    const fetchBanks = async () => {
        try {
            const result = await apiRequest("/api/bank");

            setBanks(result.data || []);
        } catch (error) {
            console.error("Fetch banks error:", error);
        }
    };

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            params.append("page", page);
            params.append("limit", limit);

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (transactionType) {
                params.append(
                    "transaction_type",
                    transactionType
                );
            }

            if (bankId) {
                params.append("bank_id", bankId);
            }

            const result = await apiRequest(
                `/api/transaction?${params.toString()}`
            );

            setTransactions(result.data || []);

            const count = result.data?.length || 0;

            setTotalPages(
                Math.max(1, Math.ceil(count / limit))
            );

        } catch (error) {
            console.error(
                "Fetch transactions error:",
                error
            );

            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [page, transactionType, bankId]);

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
            setError("");

            const result = await apiRequest(
                `/api/transaction/${id}`
            );

            setSelectedTransaction(result.data);

        } catch (error) {
            console.error(
                "Fetch transaction details error:",
                error
            );

            setError(error.message);

        } finally {
            setDetailsLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString(
            "en-IN"
        );
    };

    return (
        <div className="transaction-history-page">

            {/* Header */}

            <div className="page-header">

                <div>
                    <h1>
                        Transaction History
                    </h1>

                    <p>
                        View all transactions and
                        denomination details
                    </p>
                </div>

            </div>


            {/* Filters */}

            <div className="filter-card">

                <form
                    onSubmit={handleSearch}
                    className="filter-form"
                >

                    <div className="filter-group">

                        <label>
                            Search
                        </label>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Customer / transaction number"
                        />

                    </div>


                    <div className="filter-group">

                        <label>
                            Transaction Type
                        </label>

                        <select
                            value={transactionType}
                            onChange={(e) => {
                                setTransactionType(
                                    e.target.value
                                );
                                setPage(1);
                            }}
                        >

                            <option value="">
                                All
                            </option>

                            <option value="WITHDRAWAL">
                                Withdrawal
                            </option>

                            <option value="DEPOSIT">
                                Deposit
                            </option>

                        </select>

                    </div>


                    <div className="filter-group">

                        <label>
                            Bank
                        </label>

                        <select
                            value={bankId}
                            onChange={(e) => {
                                setBankId(e.target.value);
                                setPage(1);
                            }}
                        >

                            <option value="">
                                All Banks
                            </option>

                            {banks.map((bank) => (

                                <option
                                    key={bank.id}
                                    value={bank.id}
                                >
                                    {bank.bank_name}
                                </option>

                            ))}

                        </select>

                    </div>


                    <div className="filter-actions">

                        <button type="submit">
                            Search
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="reset-button"
                        >
                            Reset
                        </button>

                    </div>

                </form>

            </div>


            {/* Error */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* Table */}

            <div className="table-card">

                {loading ? (

                    <div className="loading">
                        Loading transactions...
                    </div>

                ) : transactions.length === 0 ? (

                    <div className="empty-state">
                        No transactions found.
                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>
                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Bank
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Operator
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Action
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {transactions.map(
                                    (transaction) => (

                                        <tr
                                            key={
                                                transaction.id
                                            }
                                        >

                                            <td>
                                                {
                                                    transaction.customer_name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    transaction.bank
                                                        ?.bank_name
                                                }
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        transaction.transaction_type ===
                                                            "WITHDRAWAL"
                                                            ? "type-withdrawal"
                                                            : "type-deposit"
                                                    }
                                                >
                                                    {
                                                        transaction.transaction_type
                                                    }
                                                </span>

                                            </td>

                                            <td className="amount">

                                                ₹
                                                {Number(
                                                    transaction.amount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </td>

                                            <td>
                                                {
                                                    transaction.operator
                                                        ?.first_name
                                                }{" "}
                                                {
                                                    transaction.operator
                                                        ?.last_name
                                                }
                                            </td>

                                            <td>
                                                {formatDate(
                                                    transaction.transaction_date
                                                )}
                                            </td>

                                            <td>

                                                <button
                                                    className="view-button"
                                                    onClick={() =>
                                                        handleViewDetails(
                                                            transaction.id
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* Pagination */}

            {!loading &&
                transactions.length > 0 && (

                    <div className="pagination">

                        <button
                            disabled={page <= 1}
                            onClick={() =>
                                setPage((prev) =>
                                    prev - 1
                                )
                            }
                        >
                            Previous
                        </button>

                        <span>
                            Page {page} of{" "}
                            {totalPages}
                        </span>

                        <button
                            disabled={
                                page >= totalPages
                            }
                            onClick={() =>
                                setPage((prev) =>
                                    prev + 1
                                )
                            }
                        >
                            Next
                        </button>

                    </div>
                )}


            {/* Details Modal */}

            {(selectedTransaction ||
                detailsLoading) && (

                    <div className="modal-overlay">

                        <div className="transaction-modal">

                            {detailsLoading ? (

                                <p>
                                    Loading details...
                                </p>

                            ) : (

                                <>
                                    <div className="modal-header">

                                        <h2>
                                            Transaction Details
                                        </h2>

                                        <button
                                            onClick={() =>
                                                setSelectedTransaction(
                                                    null
                                                )
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>


                                    <div className="details-grid">

                                        <div>
                                            <span>
                                                Customer
                                            </span>

                                            <strong>
                                                {
                                                    selectedTransaction.customer_name
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Bank
                                            </span>

                                            <strong>
                                                {
                                                    selectedTransaction.bank
                                                        ?.bank_name
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                CSP ID
                                            </span>

                                            <strong>
                                                {
                                                    selectedTransaction.bank
                                                        ?.csp_id
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Type
                                            </span>

                                            <strong>
                                                {
                                                    selectedTransaction.transaction_type
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Amount
                                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    selectedTransaction.amount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Operator
                                            </span>

                                            <strong>
                                                {
                                                    selectedTransaction.operator
                                                        ?.first_name
                                                }{" "}
                                                {
                                                    selectedTransaction.operator
                                                        ?.last_name
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Date
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    selectedTransaction.transaction_date
                                                )}
                                            </strong>
                                        </div>

                                    </div>


                                    {/* Denominations */}

                                    <div className="modal-denominations">

                                        <h3>
                                            Denominations
                                        </h3>

                                        {selectedTransaction.denominations ? (

                                            <div className="modal-note-list">

                                                {notes.map((note) => {

                                                    const count =
                                                        Number(
                                                            selectedTransaction
                                                                .denominations[
                                                            note.name
                                                            ]
                                                        ) || 0;

                                                    if (count === 0) {
                                                        return null;
                                                    }

                                                    return (
                                                        <div
                                                            key={
                                                                note.name
                                                            }
                                                            className="modal-note-row"
                                                        >

                                                            <span>
                                                                {note.label}
                                                            </span>

                                                            <span>
                                                                × {count}
                                                            </span>

                                                            <strong>
                                                                ₹
                                                                {(
                                                                    count *
                                                                    note.value
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </strong>

                                                        </div>
                                                    );

                                                })}

                                            </div>

                                        ) : (

                                            <p>
                                                No denomination
                                                details available.
                                            </p>

                                        )}

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