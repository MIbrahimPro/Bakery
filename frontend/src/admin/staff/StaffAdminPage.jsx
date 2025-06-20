import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./StaffAdminPage.module.scss";

const emptyStaff = {
    name: "",
    role: "",
    description: "",
    pictureUrl: null,
};

const StaffAdminPage = () => {
    const [staff, setStaff] = useState([]);
    const [form, setForm] = useState(emptyStaff);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const fetchStaff = () => {
        setLoading(true);
        setError("");
        axios
            .get("/staff/all")
            .then((res) => setStaff(res.data))
            .catch(() => setError("Failed to fetch staff"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleEdit = (s) => {
        setEditing(s._id);
        setForm({
            name: s.name,
            role: s.role,
            description: s.description || "",
            pictureUrl: null,
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this staff member?")) return;
        setMsg("");
        setError("");
        axios
            .delete(`/staff/admin/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(() => {
                setMsg("Staff deleted");
                fetchStaff();
            })
            .catch(() => setError("Failed to delete staff"));
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "pictureUrl") {
            setForm({ ...form, pictureUrl: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setMsg("");
        setError("");
        const data = new FormData();
        data.append("name", form.name);
        data.append("role", form.role);
        data.append("description", form.description);
        if (form.pictureUrl) data.append("image", form.pictureUrl);
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
            },
        };
        if (editing) {
            axios
                .put(`/staff/admin/change/${editing}`, data, config)
                .then(() => {
                    setMsg("Staff updated");
                    setEditing(null);
                    setForm(emptyStaff);
                    fetchStaff();
                })
                .catch(() => setError("Failed to update staff"));
        } else {
            axios
                .post("/staff/admin/add", data, config)
                .then(() => {
                    setMsg("Staff added");
                    setForm(emptyStaff);
                    fetchStaff();
                })
                .catch(() => setError("Failed to add staff"));
        }
    };

    return (
        <div className={styles.staffAdminPage}>
            <h2>Manage Kitchen Staff</h2>
            <form className={styles.staffForm} onSubmit={handleFormSubmit}>
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                />
                <input
                    name="role"
                    placeholder="Role (e.g. Chef, Baker)"
                    value={form.role}
                    onChange={handleFormChange}
                    required
                />
                <input
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleFormChange}
                />
                <input
                    name="pictureUrl"
                    type="file"
                    accept="image/*"
                    onChange={handleFormChange}
                />
                <button type="submit">
                    {editing ? "Update" : "Add"} Staff
                </button>
                {editing && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditing(null);
                            setForm(emptyStaff);
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className={styles.errorMsg}>{error}</div>
            ) : (
                <table className={styles.staffTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Description</th>
                            <th>Picture</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map((s) => (
                            <tr key={s._id}>
                                <td>{s.name}</td>
                                <td>{s.role}</td>
                                <td>{s.description}</td>
                                <td>
                                    {s.pictureUrl && (
                                        <img
                                            src={
                                                s.pictureUrl.startsWith(
                                                    "/uploads/"
                                                )
                                                    ? s.pictureUrl
                                                    : `/uploads/staff/${s.pictureUrl}`
                                            }
                                            alt={s.name}
                                            className={styles.staffImg}
                                        />
                                    )}
                                </td>
                                <td>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() => handleEdit(s)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(s._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {msg && <div className={styles.successMsg}>{msg}</div>}
        </div>
    );
};

export default StaffAdminPage;
