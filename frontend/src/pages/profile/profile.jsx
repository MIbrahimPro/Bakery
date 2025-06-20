import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.scss";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editName, setEditName] = useState(false);
    const [name, setName] = useState("");
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
    });
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({ title: "", address: "" });
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        axios
            .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                setUser(res.data);
                setName(res.data.name);
            });
        axios
            .get("/users/me/addresses", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setAddresses(res.data));
    }, []);

    const handleNameUpdate = async (e) => {
        e.preventDefault();
        setMsg("");
        setErr("");
        const token = localStorage.getItem("token");
        try {
            const res = await axios.put(
                "/users/me/update-name",
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(res.data.user);
            setEditName(false);
            setMsg(res.data.message);
        } catch (error) {
            setErr(error.response?.data?.message || "Error updating name");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMsg("");
        setErr("");
        const token = localStorage.getItem("token");
        if (!passwords.oldPassword || !passwords.newPassword) {
            setErr("Old and new password are required");
            return;
        }
        try {
            const res = await axios.put(
                "/users/me/change-password",
                {
                    oldPassword: passwords.oldPassword,
                    newPassword: passwords.newPassword,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMsg(res.data.message);
            setPasswords({ oldPassword: "", newPassword: "" });
        } catch (error) {
            setErr(error.response?.data?.message || "Error changing password");
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setMsg("");
        setErr("");
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post("/users/me/address", newAddress, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAddresses(res.data);
            setNewAddress({ title: "", address: "" });
            setMsg("Address added");
        } catch (error) {
            setErr(error.response?.data?.message || "Error adding address");
        }
    };

    const handleDeleteAddress = async (id) => {
        setMsg("");
        setErr("");
        const token = localStorage.getItem("token");
        try {
            const res = await axios.delete(`/users/me/address/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAddresses(res.data);
            setMsg("Address deleted");
        } catch (error) {
            setErr(error.response?.data?.message || "Error deleting address");
        }
    };

    if (!user) return <div className="profile-page">Loading...</div>;

    return (
        <div className="profile-page">
            <div className="profile-container">
                <h1 className="profile-title">Profile</h1>
                <div className="profile-section">
                    <label className="profile-label">Name:</label>
                    {editName ? (
                        <form
                            onSubmit={handleNameUpdate}
                            className="profile-inline-form"
                        >
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="profile-input"
                                required
                            />
                            <button type="submit" className="profile-btn">
                                Save
                            </button>
                            <button
                                type="button"
                                className="profile-btn"
                                onClick={() => {
                                    setEditName(false);
                                    setName(user.name);
                                }}
                            >
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <span className="profile-value">
                            {user.name}{" "}
                            <button
                                className="profile-btn"
                                onClick={() => setEditName(true)}
                            >
                                Edit
                            </button>
                        </span>
                    )}
                </div>
                <div className="profile-section">
                    <label className="profile-label">Email:</label>
                    <span className="profile-value">{user.email}</span>
                </div>
                <div className="profile-section">
                    <form
                        onSubmit={handlePasswordChange}
                        className="profile-inline-form"
                    >
                        <label className="profile-label">
                            Change Password:
                        </label>
                        <input
                            type="password"
                            placeholder="Old Password"
                            className="profile-input"
                            required
                            value={passwords.oldPassword}
                            onChange={(e) =>
                                setPasswords({
                                    ...passwords,
                                    oldPassword: e.target.value,
                                })
                            }
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            className="profile-input"
                            required
                            value={passwords.newPassword}
                            onChange={(e) =>
                                setPasswords({
                                    ...passwords,
                                    newPassword: e.target.value,
                                })
                            }
                        />
                        <button type="submit" className="profile-btn">
                            Change
                        </button>
                    </form>
                </div>
                <div className="profile-section">
                    <h2 className="profile-subtitle">Addresses</h2>
                    <ul className="profile-address-list">
                        {addresses.map((addr) => (
                            <li key={addr._id} className="profile-address-item">
                                <b>{addr.title}:</b> {addr.address}
                                <button
                                    className="profile-btn"
                                    onClick={() =>
                                        handleDeleteAddress(addr._id)
                                    }
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                    <form
                        onSubmit={handleAddAddress}
                        className="profile-inline-form"
                    >
                        <input
                            type="text"
                            placeholder="Title"
                            className="profile-input"
                            required
                            value={newAddress.title}
                            onChange={(e) =>
                                setNewAddress({
                                    ...newAddress,
                                    title: e.target.value,
                                })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            className="profile-input"
                            required
                            value={newAddress.address}
                            onChange={(e) =>
                                setNewAddress({
                                    ...newAddress,
                                    address: e.target.value,
                                })
                            }
                        />
                        <button type="submit" className="profile-btn">
                            Add
                        </button>
                    </form>
                </div>
                {(msg || err) && (
                    <div className={msg ? "profile-success" : "profile-error"}>
                        {msg || err}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
