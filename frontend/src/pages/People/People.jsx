import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
    UsersRound,
    UserPlus,
    Search,
    Eye,
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle2,
    RotateCcw,
    X,
    User,
    Phone,
    Loader2,
    RefreshCw,
    WalletCards,
    TrendingUp,
    TrendingDown,
    Scale
} from "lucide-react";
import "./People.css";

const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const formatSignedAmount = (amount) => {
    const num = Number(amount || 0);
    const formatted = Math.abs(num).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    if (num > 0) return `+₹${formatted}`;
    if (num < 0) return `-₹${formatted}`;
    return `₹${formatted}`;
};

const getInitials = (name) => {
    if (!name) return "P";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const People = () => {
    const navigate = useNavigate();
    const toast = useToast();

    // State for People list & Summary
    const [people, setPeople] = useState([]);
    const [summary, setSummary] = useState({
        total_to_receive: 0,
        total_to_pay: 0,
        net_balance: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, TO_RECEIVE, TO_PAY, SETTLED

    // Add Person Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        mobile: ""
    });
    const [formErrors, setFormErrors] = useState({
        name: "",
        mobile: ""
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch Summary & People List
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            // Fetch people and summary in parallel
            const [peopleRes, summaryRes] = await Promise.allSettled([
                apiRequest("/api/people"),
                apiRequest("/api/people-transaction/summary")
            ]);

            let peopleList = [];
            if (peopleRes.status === "fulfilled" && peopleRes.value?.data) {
                peopleList = Array.isArray(peopleRes.value.data) ? peopleRes.value.data : [];
            }
            setPeople(peopleList);

            // Calculate fallback summary if needed
            let calculatedToReceive = 0;
            let calculatedToPay = 0;
            let calculatedNet = 0;

            peopleList.forEach((person) => {
                const totalCredit = Number(person.total_credit || 0);
                const totalDebit = Number(person.total_debit || 0);
                // balance = credit - debit
                const balance = person.balance !== undefined ? Number(person.balance) : totalCredit - totalDebit;

                if (balance > 0) {
                    calculatedToReceive += balance;
                } else if (balance < 0) {
                    calculatedToPay += Math.abs(balance);
                }
            });
            calculatedNet = calculatedToReceive - calculatedToPay;

            if (summaryRes.status === "fulfilled" && summaryRes.value?.data) {
                const s = summaryRes.value.data;
                setSummary({
                    total_to_receive: s.total_to_receive !== undefined ? Number(s.total_to_receive) : calculatedToReceive,
                    total_to_pay: s.total_to_pay !== undefined ? Number(s.total_to_pay) : calculatedToPay,
                    net_balance: s.net_balance !== undefined ? Number(s.net_balance) : calculatedNet
                });
            } else {
                setSummary({
                    total_to_receive: calculatedToReceive,
                    total_to_pay: calculatedToPay,
                    net_balance: calculatedNet
                });
            }
        } catch (err) {
            console.error("Error fetching people ledger data:", err);
            toast.error(err.message || "Failed to load People Ledger records.");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle Form Inputs for Add Person
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = "Person name is required";
        } else if (formData.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters";
        }

        if (formData.mobile.trim()) {
            const cleanMobile = formData.mobile.replace(/\D/g, "");
            if (cleanMobile.length > 0 && cleanMobile.length !== 10) {
                errors.mobile = "Mobile number must be 10 digits";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddPersonSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            const payload = {
                name: formData.name.trim(),
                mobile: formData.mobile.trim() || undefined
            };

            const result = await apiRequest("/api/people", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            toast.success(result?.message || "Person added successfully to ledger!");
            setShowAddModal(false);
            setFormData({ name: "", mobile: "" });
            setFormErrors({ name: "", mobile: "" });
            await fetchData();
        } catch (err) {
            console.error("Create person error:", err);
            toast.error(err.message || "Failed to create person record.");
        } finally {
            setSubmitting(false);
        }
    };

    // Filter & Search Logic
    const filteredPeople = useMemo(() => {
        return people.filter((p) => {
            // Search Match
            const nameMatch = p.name?.toLowerCase().includes(searchQuery.toLowerCase().trim());
            const mobileMatch = p.mobile?.includes(searchQuery.trim());
            const matchesSearch = !searchQuery.trim() || nameMatch || mobileMatch;

            if (!matchesSearch) return false;

            // Status Filter
            const credit = Number(p.total_credit || 0);
            const debit = Number(p.total_debit || 0);
            const balance = p.balance !== undefined ? Number(p.balance) : credit - debit;

            if (activeFilter === "TO_RECEIVE") return balance > 0;
            if (activeFilter === "TO_PAY") return balance < 0;
            if (activeFilter === "SETTLED") return balance === 0;

            return true;
        });
    }, [people, searchQuery, activeFilter]);

    return (
        <div className="people-page-container">
            {/* Top Section */}
            <div className="people-page-header">
                <div className="people-header-left">
                    <div className="people-header-icon-badge">
                        <UsersRound size={24} />
                    </div>
                    <div className="people-header-titles">
                        <h1>People Ledger</h1>
                        <p>Track money to receive and money to pay.</p>
                    </div>
                </div>

                <button
                    type="button"
                    className="people-btn-add-primary"
                    onClick={() => setShowAddModal(true)}
                >
                    <UserPlus size={17} />
                    <span>Add Person</span>
                </button>
            </div>

            {/* 3 Summary Cards */}
            <div className="people-summary-grid">
                {/* 1. Total to Receive */}
                <div className="people-summary-card card-receive">
                    <div className="people-card-header-flex">
                        <span className="card-label">Total to Receive</span>
                        <div className="people-card-icon-wrap">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="people-card-value">
                        ₹{formatAmount(summary.total_to_receive)}
                    </div>
                    <div className="people-card-footer">
                        <ArrowDownLeft size={14} style={{ color: "#34d399" }} />
                        <span>Money owed back to you by others</span>
                    </div>
                </div>

                {/* 2. Total to Pay */}
                <div className="people-summary-card card-pay">
                    <div className="people-card-header-flex">
                        <span className="card-label">Total to Pay</span>
                        <div className="people-card-icon-wrap">
                            <TrendingDown size={20} />
                        </div>
                    </div>
                    <div className="people-card-value">
                        ₹{formatAmount(summary.total_to_pay)}
                    </div>
                    <div className="people-card-footer">
                        <ArrowUpRight size={14} style={{ color: "#f87171" }} />
                        <span>Money you owe to other people</span>
                    </div>
                </div>

                {/* 3. Net Position */}
                <div
                    className={`people-summary-card card-net ${
                        summary.net_balance > 0
                            ? "net-positive"
                            : summary.net_balance < 0
                            ? "net-negative"
                            : "net-neutral"
                    }`}
                >
                    <div className="people-card-header-flex">
                        <span className="card-label">Net Position</span>
                        <div className="people-card-icon-wrap">
                            <Scale size={20} />
                        </div>
                    </div>
                    <div className="people-card-value">
                        {formatSignedAmount(summary.net_balance)}
                    </div>
                    <div className="people-card-footer">
                        {summary.net_balance >= 0 ? (
                            <>
                                <CheckCircle2 size={14} style={{ color: "#60a5fa" }} />
                                <span>Net positive financial position</span>
                            </>
                        ) : (
                            <>
                                <ArrowUpRight size={14} style={{ color: "#fbbf24" }} />
                                <span>Net payable financial balance</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="people-filter-card">
                <div className="people-search-box">
                    <Search size={16} className="people-search-icon" />
                    <input
                        type="text"
                        className="people-search-input"
                        placeholder="Search person by name or mobile..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className="people-filter-tabs">
                    <button
                        type="button"
                        className={`people-tab-btn ${activeFilter === "ALL" ? "active" : ""}`}
                        onClick={() => setActiveFilter("ALL")}
                    >
                        All ({people.length})
                    </button>
                    <button
                        type="button"
                        className={`people-tab-btn ${activeFilter === "TO_RECEIVE" ? "active" : ""}`}
                        onClick={() => setActiveFilter("TO_RECEIVE")}
                    >
                        To Receive
                    </button>
                    <button
                        type="button"
                        className={`people-tab-btn ${activeFilter === "TO_PAY" ? "active" : ""}`}
                        onClick={() => setActiveFilter("TO_PAY")}
                    >
                        To Pay
                    </button>
                    <button
                        type="button"
                        className={`people-tab-btn ${activeFilter === "SETTLED" ? "active" : ""}`}
                        onClick={() => setActiveFilter("SETTLED")}
                    >
                        Settled
                    </button>
                </div>
            </div>

            {/* People List Table */}
            <div className="people-table-card">
                <div className="people-table-header-row">
                    <div className="people-table-title-group">
                        <WalletCards size={19} style={{ color: "#60a5fa" }} />
                        <h2>People Directory & Balances</h2>
                    </div>
                    <span className="people-count-pill">
                        {filteredPeople.length} {filteredPeople.length === 1 ? "Person" : "People"}
                    </span>
                </div>

                {loading ? (
                    <div className="people-loading-box">
                        <RefreshCw size={24} className="people-spin-icon" />
                        <span>Loading People Ledger...</span>
                    </div>
                ) : filteredPeople.length === 0 ? (
                    <div className="people-empty-state">
                        <UsersRound size={36} style={{ color: "#475569", marginBottom: "6px" }} />
                        {people.length === 0 ? (
                            <>
                                <p>No people in your ledger yet.</p>
                                <span>Click "+ Add Person" above to start tracking personal loans and receivables.</span>
                            </>
                        ) : (
                            <>
                                <p>No matching people found.</p>
                                <span>Try adjusting your search query or filter criteria.</span>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="people-table-wrap">
                        <table className="people-table">
                            <thead>
                                <tr>
                                    <th>Person</th>
                                    <th>Mobile</th>
                                    <th>Total Credit</th>
                                    <th>Total Debit</th>
                                    <th>Balance</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: "center" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPeople.map((person) => {
                                    const totalCredit = Number(person.total_credit || 0);
                                    const totalDebit = Number(person.total_debit || 0);
                                    const balance =
                                        person.balance !== undefined
                                            ? Number(person.balance)
                                            : totalCredit - totalDebit;

                                    let statusLabel = "SETTLED";
                                    let statusClass = "status-settled";
                                    let balanceClass = "val-zero";

                                    if (balance > 0) {
                                        statusLabel = "TO RECEIVE";
                                        statusClass = "status-receive";
                                        balanceClass = "val-positive";
                                    } else if (balance < 0) {
                                        statusLabel = "TO PAY";
                                        statusClass = "status-pay";
                                        balanceClass = "val-negative";
                                    }

                                    return (
                                        <tr key={person.id}>
                                            <td>
                                                <div className="people-cell-person">
                                                    <div className="people-avatar">
                                                        {getInitials(person.name)}
                                                    </div>
                                                    <span className="people-person-name">
                                                        {person.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="people-cell-mobile">
                                                    {person.mobile || "-"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="people-cell-amount">
                                                    ₹{formatAmount(totalCredit)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="people-cell-amount">
                                                    ₹{formatAmount(totalDebit)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`people-balance-val ${balanceClass}`}>
                                                    {formatSignedAmount(balance)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${statusClass}`}>
                                                    {balance > 0 ? (
                                                        <ArrowDownLeft size={11} />
                                                    ) : balance < 0 ? (
                                                        <ArrowUpRight size={11} />
                                                    ) : (
                                                        <CheckCircle2 size={11} />
                                                    )}
                                                    <span>{statusLabel}</span>
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <button
                                                    type="button"
                                                    className="people-btn-view"
                                                    onClick={() => navigate(`/people/${person.id}`)}
                                                    title={`View ${person.name}'s transactions and details`}
                                                >
                                                    <Eye size={13} />
                                                    <span>View</span>
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

            {/* Add Person Modal */}
            {showAddModal && (
                <div className="people-modal-backdrop" onClick={() => !submitting && setShowAddModal(false)}>
                    <div className="people-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="people-modal-header">
                            <div className="people-modal-title">
                                <UserPlus size={20} style={{ color: "#60a5fa" }} />
                                <h3>Add New Person</h3>
                            </div>
                            <button
                                type="button"
                                className="people-modal-close-btn"
                                disabled={submitting}
                                onClick={() => setShowAddModal(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleAddPersonSubmit} noValidate className="people-modal-body">
                            {/* Name Field */}
                            <div className="people-form-group">
                                <label htmlFor="person_name">
                                    Full Name <span className="people-req-star">*</span>
                                </label>
                                <div className={`people-input-box ${formErrors.name ? "has-error" : ""}`}>
                                    <User size={16} className="people-field-icon" />
                                    <input
                                        id="person_name"
                                        type="text"
                                        name="name"
                                        className="people-real-input"
                                        placeholder="e.g. Rahul Patil"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        autoFocus
                                        autoComplete="off"
                                    />
                                </div>
                                {formErrors.name && (
                                    <span className="people-error-text">
                                        {formErrors.name}
                                    </span>
                                )}
                            </div>

                            {/* Mobile Field */}
                            <div className="people-form-group">
                                <label htmlFor="person_mobile">
                                    Mobile Number
                                </label>
                                <div className={`people-input-box ${formErrors.mobile ? "has-error" : ""}`}>
                                    <Phone size={16} className="people-field-icon" />
                                    <input
                                        id="person_mobile"
                                        type="text"
                                        name="mobile"
                                        className="people-real-input"
                                        placeholder="e.g. 9876543210"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        maxLength={10}
                                        autoComplete="off"
                                    />
                                </div>
                                {formErrors.mobile && (
                                    <span className="people-error-text">
                                        {formErrors.mobile}
                                    </span>
                                )}
                            </div>

                            {/* Modal Actions */}
                            <div className="people-modal-actions">
                                <button
                                    type="button"
                                    className="people-btn-cancel"
                                    disabled={submitting}
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="people-btn-save"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={16} className="people-spin-icon" />
                                            <span>Adding Person...</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={16} />
                                            <span>Add Person</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default People;
