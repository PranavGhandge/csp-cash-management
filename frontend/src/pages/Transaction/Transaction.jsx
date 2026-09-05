import { useEffect, useState } from "react";
import apiRequest from "../../services/api";
import "./Transaction.css";

const Transaction = () => {
    const [banks, setBanks] = useState([]);

    const [formData, setFormData] = useState({
        bank_id: "",
        customer_name: "",
        transaction_type: "WITHDRAWAL",
        amount: "",
        note_500: "",
        note_200: "",
        note_100: "",
        note_50: "",
        note_20: "",
        note_10: ""
    });

    const [loading, setLoading] = useState(false);
    const [fetchingBanks, setFetchingBanks] = useState(true);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const notes = [
        { name: "note_500", label: "₹500", value: 500 },
        { name: "note_200", label: "₹200", value: 200 },
        { name: "note_100", label: "₹100", value: 100 },
        { name: "note_50", label: "₹50", value: 50 },
        { name: "note_20", label: "₹20", value: 20 },
        { name: "note_10", label: "₹10", value: 10 }
    ];

    const fetchBanks = async () => {
        try {
            setFetchingBanks(true);
            setError("");

            const result = await apiRequest("/api/bank");

            setBanks(result.data || []);
        } catch (error) {
            console.error("Fetch banks error:", error);
            setError(error.message);
        } finally {
            setFetchingBanks(false);
        }
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateDenominationTotal = () => {
        return notes.reduce((total, note) => {
            const count = Number(formData[note.name]) || 0;

            return total + count * note.value;
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");
            setError("");

            const amount = Number(formData.amount) || 0;
            const denominationTotal =
                calculateDenominationTotal();

            if (!formData.bank_id) {
                setError("Please select a bank");
                return;
            }

            if (!formData.customer_name.trim()) {
                setError("Customer name is required");
                return;
            }

            if (amount <= 0) {
                setError("Amount must be greater than 0");
                return;
            }

            if (denominationTotal !== amount) {
                setError(
                    `Amount ₹${amount.toLocaleString(
                        "en-IN"
                    )} and denomination total ₹${denominationTotal.toLocaleString(
                        "en-IN"
                    )} do not match`
                );
                return;
            }

            const result = await apiRequest(
                "/api/transaction",
                {
                    method: "POST",
                    body: JSON.stringify({
                        bank_id: formData.bank_id,
                        customer_name:
                            formData.customer_name.trim(),
                        transaction_type:
                            formData.transaction_type,
                        amount: amount,
                        note_500:
                            Number(formData.note_500) || 0,
                        note_200:
                            Number(formData.note_200) || 0,
                        note_100:
                            Number(formData.note_100) || 0,
                        note_50:
                            Number(formData.note_50) || 0,
                        note_20:
                            Number(formData.note_20) || 0,
                        note_10:
                            Number(formData.note_10) || 0
                    })
                }
            );

            setMessage(result.message);

            setFormData({
                bank_id: "",
                customer_name: "",
                transaction_type: "WITHDRAWAL",
                amount: "",
                note_500: "",
                note_200: "",
                note_100: "",
                note_50: "",
                note_20: "",
                note_10: ""
            });

            await fetchBanks();

        } catch (error) {
            console.error(
                "Create transaction error:",
                error
            );

            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    const denominationTotal =
        calculateDenominationTotal();

    return (
        <div className="transaction-page">

            {/* Header */}

            <div className="page-header">

                <div>
                    <h1>Transactions</h1>

                    <p>
                        Create withdrawal and deposit
                        transactions
                    </p>
                </div>

            </div>


            {/* Form */}

            <div className="transaction-card">

                <h2>
                    Create Transaction
                </h2>

                <form onSubmit={handleSubmit}>

                    {/* Bank */}

                    <div className="form-group">

                        <label>
                            Bank
                        </label>

                        <select
                            name="bank_id"
                            value={formData.bank_id}
                            onChange={handleChange}
                            disabled={fetchingBanks}
                        >

                            <option value="">
                                {fetchingBanks
                                    ? "Loading banks..."
                                    : "Select Bank"
                                }
                            </option>

                            {banks.map((bank) => (

                                <option
                                    key={bank.id}
                                    value={bank.id}
                                >
                                    {bank.bank_name}
                                    {" - "}
                                    {bank.csp_id}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* Customer */}

                    <div className="form-group">

                        <label>
                            Customer Name
                        </label>

                        <input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            placeholder="Enter customer name"
                        />

                    </div>


                    {/* Transaction Type */}

                    <div className="form-group">

                        <label>
                            Transaction Type
                        </label>

                        <select
                            name="transaction_type"
                            value={formData.transaction_type}
                            onChange={handleChange}
                        >

                            <option value="WITHDRAWAL">
                                Withdrawal
                            </option>

                            <option value="DEPOSIT">
                                Deposit
                            </option>

                        </select>

                    </div>


                    {/* Amount */}

                    <div className="form-group">

                        <label>
                            Amount
                        </label>

                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            min="1"
                            step="0.01"
                        />

                    </div>


                    {/* Denominations */}

                    <div className="denomination-section">

                        <h3>
                            Denominations
                        </h3>

                        <p className="section-info">
                            Enter the number of notes
                        </p>

                        <div className="denomination-list">

                            {notes.map((note) => {

                                const count =
                                    Number(
                                        formData[
                                            note.name
                                        ]
                                    ) || 0;

                                const noteAmount =
                                    count * note.value;

                                return (
                                    <div
                                        className="denomination-row"
                                        key={note.name}
                                    >

                                        <div className="note-name">
                                            <strong>
                                                {note.label}
                                            </strong>
                                        </div>

                                        <input
                                            type="number"
                                            name={note.name}
                                            value={
                                                formData[
                                                    note.name
                                                ]
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            min="0"
                                            step="1"
                                            placeholder="0"
                                        />

                                        <div className="note-total">
                                            ₹
                                            {noteAmount.toLocaleString(
                                                "en-IN"
                                            )}
                                        </div>

                                    </div>
                                );
                            })}

                        </div>


                        <div className="denomination-total">

                            <span>
                                Denomination Total
                            </span>

                            <strong>
                                ₹
                                {denominationTotal.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* Messages */}

                    {message && (
                        <div className="success-message">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}


                    {/* Submit */}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Transaction"
                        }
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Transaction;