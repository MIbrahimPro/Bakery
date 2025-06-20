import React, { useState } from "react";
import axios from "axios";
import "./signup.scss";

const Signup = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const res = await axios.post("/auth/signup", form);
            setSuccess(res.data.message || "Signup successful!");
            setForm({ name: "", email: "", password: "" });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Signup failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div id="signUp" className="signup-container">
                <div
                    id="letsGo"
                    className="signup-title"
                    style={{
                        fontSize: "10vh",
                        fontFamily: "'Great Vibes', cursive",
                    }}
                >
                    Let's Go!!
                </div>
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    className="signup-form"
                >
                    <label htmlFor="name" className="field">
                        <b>Name</b>
                        <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                        className="inp"
                        type="text"
                        name="name"
                        id="name"
                        pattern="[A-Za-z ]+"
                        title="Can only contain alphabets and spaces."
                        placeholder="Enter your Name"
                        size="35"
                        required
                        value={form.name}
                        onChange={handleChange}
                    />
                    <label htmlFor="email" className="field">
                        <b>Email</b>
                        <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                        className="inp"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your Email id"
                        size="35"
                        required
                        value={form.email}
                        onChange={handleChange}
                    />
                    <label htmlFor="password" className="field">
                        <b>Password</b>
                        <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                        className="inp"
                        type="password"
                        name="password"
                        id="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="At least 8 characters, one uppercase, one lowercase, and one number."
                        placeholder="Enter your Password"
                        size="35"
                        required
                        value={form.password}
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="btn signup-btn"
                        style={{
                            fontSize: "2.7vh",
                            alignSelf: "stretch",
                            marginBottom: "0.6rem",
                        }}
                        disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                    {error && (
                        <div
                            className="signup-error"
                            style={{ marginBottom: "1rem" }}
                        >
                            {error}
                        </div>
                    )}
                    {success && (
                        <div
                            className="signup-success"
                            style={{ marginBottom: "1rem" }}
                        >
                            {success}
                        </div>
                    )}
                    <div style={{ marginTop: "1rem" }}>
                        Already have an account?{" "}
                        <a href="/login" className="login">
                            <u>Click here to login!</u>
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
