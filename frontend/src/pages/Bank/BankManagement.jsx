import { useEffect, useState } from "react";
import apiRequest from "../../services/api";
import "./BankManagement.css";

const BankManagement = () => {
    const [formData, setFormData] = useState({
        bank_name: "",
        csp_id: ""
    });

    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchBanks = async () => {
        try {
            setFetching(true);
            setError("");

            const result = await apiRequest("/api/bank");

            setBanks(result.data || []);
        } catch (error) {
            console.error("Fetch banks error:", error);
            setError(error.message);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const result = await apiRequest("/api/bank", {
                method: "POST",
                body: JSON.stringify(formData)
            });

            setMessage(result.message);

            setFormData({
                bank_name: "",
                csp_id: ""
            });

            await fetchBanks();

        } catch (error) {
            console.error("Create bank error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    return (
        <div className="management-page">

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Bank Management</h1>
                    <p>
                        Manage banks and CSP accounts
                    </p>
                </div>
            </div>


            {/* Create Bank */}
            <div className="form-card">

                <h2>Add Bank</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Bank Name
                            </label>

                            <input
                                type="text"
                                name="bank_name"
                                value={formData.bank_name}
                                onChange={handleChange}
                                placeholder="Enter bank name"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                CSP ID
                            </label>

                            <input
                                type="text"
                                name="csp_id"
                                value={formData.csp_id}
                                onChange={handleChange}
                                placeholder="Enter CSP ID"
                                required
                            />

                        </div>

                    </div>


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


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Bank"
                        }
                    </button>

                </form>

            </div>


            {/* Bank List */}
            <div className="list-card">

                <div className="list-header">

                    <div>
                        <h2>Banks</h2>
                        <p>
                            Your registered CSP bank accounts
                        </p>
                    </div>

                </div>


                {fetching ? (
                    <p>Loading banks...</p>

                ) : banks.length === 0 ? (

                    <div className="empty-state">
                        No banks found.
                    </div>

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


                                <div className="bank-balance">

                                    <span>
                                        Online Balance
                                    </span>

                                    <strong>
                                        ₹{Number(
                                            bank.online_balance
                                        ).toLocaleString("en-IN")}
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

export default BankManagement;