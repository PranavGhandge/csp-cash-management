import { useEffect, useState } from "react";
import apiRequest from "../../services/api";
import "./CashClosing.css";

const notes = [
    { name: "note_500", label: "₹500", value: 500 },
    { name: "note_200", label: "₹200", value: 200 },
    { name: "note_100", label: "₹100", value: 100 },
    { name: "note_50", label: "₹50", value: 50 },
    { name: "note_20", label: "₹20", value: 20 },
    { name: "note_10", label: "₹10", value: 10 }
];

const CashClosing = () => {

    const [formData, setFormData] = useState({
        note_500: 0,
        note_200: 0,
        note_100: 0,
        note_50: 0,
        note_20: 0,
        note_10: 0
    });

    const [expectedCash, setExpectedCash] = useState(0);
    const [actualCash, setActualCash] = useState(0);
    const [difference, setDifference] = useState(0);
    const [status, setStatus] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==============================
    // CALCULATE ACTUAL CASH
    // ==============================

    useEffect(() => {

        const total = notes.reduce(
            (sum, note) => {

                return (
                    sum +
                    Number(formData[note.name] || 0) *
                    note.value
                );

            },
            0
        );

        setActualCash(total);

    }, [formData]);


    // ==============================
    // CALCULATE DIFFERENCE
    // ==============================

    useEffect(() => {

        const diff =
            actualCash - Number(expectedCash || 0);

        setDifference(diff);


        if (diff === 0) {

            setStatus("MATCHED");

        } else if (diff < 0) {

            setStatus("SHORT");

        } else {

            setStatus("EXCESS");

        }

    }, [actualCash, expectedCash]);


    // ==============================
    // INPUT CHANGE
    // ==============================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: Number(value) || 0
        }));

    };


    // ==============================
    // SUBMIT CLOSING
    // ==============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");
            setSuccess("");

            const payload = {
                note_500: Number(formData.note_500),
                note_200: Number(formData.note_200),
                note_100: Number(formData.note_100),
                note_50: Number(formData.note_50),
                note_20: Number(formData.note_20),
                note_10: Number(formData.note_10)
            };


            const result = await apiRequest(
                "/api/closing",
                {
                    method: "POST",
                    body: JSON.stringify(payload)
                }
            );


            setSuccess(
                result.message ||
                "Cash closing created successfully"
            );


        } catch (error) {

            console.error(
                "Cash closing error:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="cash-closing-page">


            {/* ================= HEADER ================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Cash Closing
                    </h1>

                    <p>
                        Count physical cash and complete
                        today's closing
                    </p>

                </div>

            </div>


            {/* ================= ERROR ================= */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* ================= SUCCESS ================= */}

            {success && (

                <div className="success-message">
                    {success}
                </div>

            )}


            {/* ================= SUMMARY ================= */}

            <div className="closing-summary">


                <div className="summary-card">

                    <span>
                        Expected Cash
                    </span>

                    <strong>
                        ₹
                        {Number(
                            expectedCash
                        ).toLocaleString("en-IN")}
                    </strong>

                </div>


                <div className="summary-card">

                    <span>
                        Actual Cash
                    </span>

                    <strong>
                        ₹
                        {Number(
                            actualCash
                        ).toLocaleString("en-IN")}
                    </strong>

                </div>


                <div className="summary-card">

                    <span>
                        Difference
                    </span>

                    <strong>
                        ₹
                        {Number(
                            difference
                        ).toLocaleString("en-IN")}
                    </strong>

                </div>


                <div className="summary-card">

                    <span>
                        Status
                    </span>

                    <strong>
                        {status || "-"}
                    </strong>

                </div>


            </div>


            {/* ================= CASH COUNT ================= */}

            <div className="closing-card">

                <div className="card-header">

                    <h2>
                        Physical Cash Count
                    </h2>

                    <p>
                        Enter the number of notes
                        available at closing.
                    </p>

                </div>


                <form onSubmit={handleSubmit}>


                    <div className="notes-grid">

                        {notes.map((note) => (

                            <div
                                className="note-input-group"
                                key={note.name}
                            >

                                <label>
                                    {note.label}
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    name={note.name}
                                    value={
                                        formData[note.name]
                                    }
                                    onChange={handleChange}
                                />

                                <span>

                                    ₹
                                    {(
                                        Number(
                                            formData[
                                                note.name
                                            ] || 0
                                        ) *
                                        note.value
                                    ).toLocaleString(
                                        "en-IN"
                                    )}

                                </span>

                            </div>

                        ))}

                    </div>


                    {/* ================= TOTAL ================= */}

                    <div className="cash-total">

                        <span>
                            Actual Cash
                        </span>

                        <strong>
                            ₹
                            {Number(
                                actualCash
                            ).toLocaleString("en-IN")}
                        </strong>

                    </div>


                    {/* ================= SUBMIT ================= */}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Closing..."
                            : "Complete Cash Closing"}

                    </button>


                </form>

            </div>

        </div>

    );

};

export default CashClosing;