import { useState } from "react";
import apiRequest from "../../services/api";
import "./operatorManagement.css";

const OperatorManagement = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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

            const result = await apiRequest("/api/operator", {
                method: "POST",
                body: JSON.stringify(formData)
            });

            setMessage(result.message);

            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                password: ""
            });

        } catch (error) {
            console.error("Create operator error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="management-page">

            <div className="page-header">

                <div>
                    <h1>Operator Management</h1>

                    <p>
                        Create and manage operators
                    </p>
                </div>

            </div>


            <div className="form-card">

                <h2>Create Operator</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                First Name
                            </label>

                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                required
                            />

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />

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
                            : "Create Operator"
                        }
                    </button>

                </form>

            </div>

        </div>
    );
};

export default OperatorManagement;