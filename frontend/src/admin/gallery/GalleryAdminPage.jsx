import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./GalleryAdminPage.module.scss";

const emptyGallery = {
    title: "",
    description: "",
    imageUrl: null,
};

const GalleryAdminPage = () => {
    const [gallery, setGallery] = useState([]);
    const [form, setForm] = useState(emptyGallery);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const fetchGallery = () => {
        setLoading(true);
        setError("");
        axios
            .get("/gallery/all")
            .then((res) => setGallery(res.data))
            .catch(() => setError("Failed to fetch gallery"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const handleEdit = (g) => {
        setEditing(g._id);
        setForm({ title: g.title, description: g.description, imageUrl: null });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this gallery item?")) return;
        setMsg("");
        setError("");
        axios
            .delete(`/gallery/admin/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(() => {
                setMsg("Gallery item deleted");
                fetchGallery();
            })
            .catch(() => setError("Failed to delete gallery item"));
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
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
            },
        };
        if (editing) {
            axios
                .put(`/gallery/admin/change/${editing}`, data, config)
                .then(() => {
                    setMsg("Gallery item updated");
                    setEditing(null);
                    setForm(emptyGallery);
                    fetchGallery();
                })
                .catch(() => setError("Failed to update gallery item"));
        } else {
            axios
                .post("/gallery/admin/add", data, config)
                .then(() => {
                    setMsg("Gallery item added");
                    setForm(emptyGallery);
                    fetchGallery();
                })
                .catch(() => setError("Failed to add gallery item"));
        }
    };

    return (
        <div className={styles.galleryAdminPage}>
            <h2>Manage Gallery</h2>
            <form className={styles.galleryForm} onSubmit={handleFormSubmit}>
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
                    {editing ? "Update" : "Add"} Gallery Item
                </button>
                {editing && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditing(null);
                            setForm(emptyGallery);
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
                <table className={styles.galleryTable}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gallery.map((g) => (
                            <tr key={g._id}>
                                <td>{g.title}</td>
                                <td>{g.description}</td>
                                <td>
                                    {g.imageUrl && (
                                        <img
                                            src={
                                                // g.imageUrl.startsWith(
                                                // "/uploads/"
                                                // )
                                                // ?
                                                g.imageUrl
                                                // : `/uploads/gallery/${g.imageUrl}`
                                            }
                                            alt={g.title}
                                            className={styles.galleryImg}
                                        />
                                    )}
                                </td>
                                <td>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() => handleEdit(g)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(g._id)}
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

export default GalleryAdminPage;
