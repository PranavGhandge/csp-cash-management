import { useState } from "react";
import apiRequest from "../../services/api";
import "./PhysicalCashOpening.css";

const PhysicalCashOpening = () => {
    const [formData, setFormData] = useState({
        note_500: "",
        note_200: "",
        note_100: "",
        note_50: "",
        note_20: "",
        note_10: ""
    });

    const [loading, setLoading] = useState(false);
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateTotal = () => {
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

            const result = await apiRequest(
                "/api/physical-cash-opening",
                {
                    method: "POST",
                    body: JSON.stringify({
                        note_500: Number(formData.note_500) || 0,
                        note_200: Number(formData.note_200) || 0,
                        note_100: Number(formData.note_100) || 0,
                        note_50: Number(formData.note_50) || 0,
                        note_20: Number(formData.note_20) || 0,
                        note_10: Number(formData.note_10) || 0
                    })
                }
            );

            setMessage(result.message);

            setFormData({
                note_500: "",
                note_200: "",
                note_100: "",
                note_50: "",
                note_20: "",
                note_10: ""
            });

        } catch (error) {
            console.error(
                "Physical cash opening error:",
                error
            );

            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    const total = calculateTotal();

    return (
        <div className="physical-cash-page">

            <div className="page-header">
                <div>
                    <h1>Physical Cash Opening</h1>

                    <p>
                        Enter today's opening physical cash
                        denomination
                    </p>
                </div>
            </div>


            <div className="cash-opening-card">

                <h2>Opening Cash</h2>

                <form onSubmit={handleSubmit}>

                    <div className="notes-grid">

                        {notes.map((note) => {

                            const count =
                                Number(formData[note.name]) || 0;

                            const amount =
                                count * note.value;

                            return (
                                <div
                                    className="note-row"
                                    key={note.name}
                                >

                                    <div className="note-info">
                                        <strong>
                                            {note.label}
                                        </strong>

                                        <span>
                                            × {count}
                                        </span>
                                    </div>

                                    <input
                                        type="number"
                                        name={note.name}
                                        value={formData[note.name]}
                                        onChange={handleChange}
                                        min="0"
                                        step="1"
                                        placeholder="0"
                                    />

                                    <div className="note-amount">
                                        ₹
                                        {amount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </div>

                                </div>
                            );
                        })}

                    </div>


                    <div className="total-section">

                        <span>
                            Total Opening Cash
                        </span>

                        <strong>
                            ₹{total.toLocaleString("en-IN")}
                        </strong>

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
                            ? "Saving..."
                            : "Save Opening Cash"
                        }
                    </button>

                </form>

            </div>

        </div>
    );
};

export default PhysicalCashOpening;