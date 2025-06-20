import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.scss";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const res = await axios.post("/auth/login", form);
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                setSuccess("Login successful!");
                setTimeout(() => navigate("/Profile"), 800);
            } else {
                setError("No token received");
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <div
                    className="signup-title"
                    style={{
                        fontSize: "10vh",
                        fontFamily: "'Great Vibes', cursive",
                    }}
                >
                    Welcome Back!
                </div>
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    className="signup-form"
                >
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
                        {loading ? "Logging In..." : "Login"}
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
                        Don't have an account?{" "}
                        <a href="/signup" className="login">
                            <u>Click here to sign up!</u>
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
