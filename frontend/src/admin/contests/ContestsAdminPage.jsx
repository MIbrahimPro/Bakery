import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ContestsAdminPage.module.scss";

const emptyContest = {
    title: "",
    description: "",
    imageUrl: null,
    userId: "",
};

const ContestsAdminPage = () => {
    const [contests, setContests] = useState([]);
    const [form, setForm] = useState(emptyContest);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const fetchContests = () => {
        setLoading(true);
        setError("");
        axios
            .get("/contests/get", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => setContests(res.data))
            .catch(() => setError("Failed to fetch contests"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchContests();
    }, []);

    const handleEdit = (c) => {
        setEditing(c._id);
        setForm({
            title: c.title,
            description: c.description || "",
            imageUrl: null,
            userId: c.user?._id || "",
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this contest?")) return;
        setMsg("");
        setError("");
        axios
            .delete(`/contests/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(() => {
                setMsg("Contest deleted");
                fetchContests();
            })
            .catch(() => setError("Failed to delete contest"));
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "imageUrl") {
            setForm({ ...form, imageUrl: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setMsg("");
        setError("");
        const data = new FormData();
        data.append("title", form.title);
        data.append("description", form.description);
        if (form.imageUrl) data.append("image", form.imageUrl);
        if (form.userId) data.append("userId", form.userId);
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
            },
        };
        if (editing) {
            axios
                .put(`/contests/update/${editing}`, data, config)
                .then(() => {
                    setMsg("Contest updated");
                    setEditing(null);
                    setForm(emptyContest);
                    fetchContests();
                })
                .catch(() => setError("Failed to update contest"));
        } else {
            axios
                .post("/contests/post", data, config)
                .then(() => {
                    setMsg("Contest added");
                    setForm(emptyContest);
                    fetchContests();
                })
                .catch(() => setError("Failed to add contest"));
        }
    };

    return (
        <div className={styles.contestsAdminPage}>
            <h2>Manage Contests</h2>
            <form className={styles.contestForm} onSubmit={handleFormSubmit}>
                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
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
                    name="imageUrl"
                    type="file"
                    accept="image/*"
                    onChange={handleFormChange}
                />
                <button type="submit">
                    {editing ? "Update" : "Add"} Contest
                </button>
                {editing && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditing(null);
                            setForm(emptyContest);
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
                <table className={styles.contestTable}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>User</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contests.map((c) => (
                            <tr key={c._id}>
                                <td>{c.title}</td>
                                <td>{c.description}</td>
                                <td>
                                    {c.imageUrl && (
                                        <img
                                            src={c.imageUrl}
                                            alt={c.title}
                                            className={styles.contestImg}
                                        />
                                    )}
                                </td>
                                <td>{c.user?.name || "-"}</td>
                                <td>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() => handleEdit(c)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(c._id)}
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

export default ContestsAdminPage;
