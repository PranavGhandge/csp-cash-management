import { useState } from "react";
import apiRequest from "../../services/api";

const AdminManagement = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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

            const result = await apiRequest("/api/admin", {
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
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Admin Management</h1>

            <h2>Create Admin</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Admin"}
                </button>

            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminManagement;