import { useEffect, useState } from "react";
import apiRequest from "../../services/api";
import "./OpeningBalance.css";

const OpeningBalance = () => {
    const [banks, setBanks] = useState([]);

    const [formData, setFormData] = useState({
        bank_id: "",
        opening_balance: ""
    });

    const [loading, setLoading] = useState(false);
    const [fetchingBanks, setFetchingBanks] = useState(true);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");
            setError("");

            if (!formData.bank_id) {
                setError("Please select a bank");
                return;
            }

            if (!formData.opening_balance) {
                setError("Please enter opening balance");
                return;
            }

            const result = await apiRequest(
                "/api/opening-balance",
                {
                    method: "POST",
                    body: JSON.stringify({
                        bank_id: formData.bank_id,
                        opening_balance: Number(
                            formData.opening_balance
                        )
                    })
                }
            );

            setMessage(result.message);

            setFormData({
                bank_id: "",
                opening_balance: ""
            });

            await fetchBanks();

        } catch (error) {
            console.error(
                "Create opening balance error:",
                error
            );

            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="management-page">

            {/* Header */}

            <div className="page-header">

                <div>

                    <h1>
                        Opening Balance
                    </h1>

                    <p>
                        Set daily online opening balance
                        for each bank
                    </p>

                </div>

            </div>


            {/* Form */}

            <div className="form-card">

                <h2>
                    Set Opening Balance
                </h2>

                <form onSubmit={handleSubmit}>

                    {/* Bank */}

                    <div className="form-group">

                        <label>
                            Select Bank
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


                    {/* Opening Balance */}

                    <div className="form-group">

                        <label>
                            Opening Balance
                        </label>

                        <input
                            type="number"
                            name="opening_balance"
                            value={formData.opening_balance}
                            onChange={handleChange}
                            placeholder="Enter opening balance"
                            min="0"
                            step="0.01"
                        />

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
                        disabled={loading || fetchingBanks}
                    >
                        {loading
                            ? "Saving..."
                            : "Set Opening Balance"
                        }
                    </button>

                </form>

            </div>


            {/* Current Bank Balances */}

            <div className="list-card">

                <h2>
                    Current Bank Balances
                </h2>

                {fetchingBanks ? (

                    <p>
                        Loading...
                    </p>

                ) : banks.length === 0 ? (

                    <p className="empty-state">
                        No banks found.
                    </p>

                ) : (

                    <div className="bank-list">

                        {banks.map((bank) => (

                            <div
                                className="bank-item"
                                key={bank.id}
                            >

                                <div>

                                    <h3>
                                        {bank.bank_name}
                                    </h3>

                                    <p>
                                        CSP ID: {bank.csp_id}
                                    </p>

                                </div>


                                <div className="balance">

                                    <span>
                                        Current Balance
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            bank.online_balance
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default OpeningBalance;