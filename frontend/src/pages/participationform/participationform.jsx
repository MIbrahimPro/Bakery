import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./participationform.scss";

const ParticipationForm = () => {
    const [form, setForm] = useState({
        title: "",
        description: "",
    });
    const [image, setImage] = useState(null);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef();

    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/SignUp%20Page");
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setErr("");
        setLoading(true);
        const token = localStorage.getItem("token");
        const userId = JSON.parse(atob(token.split(".")[1])).id;
        const data = new FormData();
        data.append("title", form.title);
        data.append("description", form.description);
        data.append("userId", userId);
        if (image) data.append("image", image);
        try {
            await axios.post("/contests/post", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setMsg("Participation submitted! Good luck!");
            setForm({ title: "", description: "" });
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            setErr(error.response?.data?.message || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="participation-whole">
            <img
                src="https://i.pinimg.com/564x/c0/69/8f/c0698faf591fc743fddefe9e06537f2c.jpg"
                id="image"
                alt="dessert"
            />
            <div className="participation-form">
                <form onSubmit={handleSubmit}>
                    <p className="text1">CONTEST PARTICIPATION</p>
                    <p className="text">
                        <u>Dessert's Name:</u>&nbsp;
                        <input
                            type="text"
                            name="title"
                            className="text2"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </p>
                    <p className="text">
                        <u>Complete Recipe</u> :&nbsp;
                        <textarea
                            name="description"
                            className="text2"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={6}
                            style={{ resize: "vertical", width: "80%" }}
                        />
                    </p>
                    <p className="text">
                        <u>Image of the Dessert </u>:&nbsp;
                        <input
                            type="file"
                            name="image"
                            className="text2"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                    </p>
                    <button
                        type="submit"
                        className="participation-btn"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                    {msg && <div className="participation-success">{msg}</div>}
                    {err && <div className="participation-error">{err}</div>}
                </form>
            </div>
        </div>
    );
};

export default ParticipationForm;
