import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ItemsAdminPage.module.scss";

const emptyItem = {
    name: "",
    price: "",
    description: "",
    category: "",
    image: null,
};

const ItemsAdminPage = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyItem);

    const fetchItems = () => {
        setLoading(true);
        setError("");
        axios
            .get("/items/all")
            .then((res) => setItems(res.data))
            .catch(() => setError("Failed to fetch items"))
            .finally(() => setLoading(false));
    };
    const fetchCategories = () => {
        axios.get("/categories/all").then((res) => setCategories(res.data));
    };

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    const handleEdit = (item) => {
        setEditing(item._id);
        setForm({
            name: item.name,
            price: item.price,
            description: item.description,
            category: item.category?._id || item.category,
            image: null,
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this item?")) return;
        setMsg("");
        setError("");
        axios
            .delete(`/items/admin/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(() => {
                setMsg("Item deleted");
                fetchItems();
            })
            .catch(() => setError("Failed to delete item"));
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setForm({ ...form, image: files[0] });
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
        data.append("price", form.price);
        data.append("description", form.description);
        data.append("category", form.category);
        if (form.image) data.append("image", form.image);
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
            },
        };
        if (editing) {
            axios
                .put(`/items/admin/change/${editing}`, data, config)
                .then(() => {
                    setMsg("Item updated");
                    setEditing(null);
                    setForm(emptyItem);
                    fetchItems();
                })
                .catch(() => setError("Failed to update item"));
        } else {
            axios
                .post("/items/admin/add", data, config)
                .then(() => {
                    setMsg("Item added");
                    setForm(emptyItem);
                    fetchItems();
                })
                .catch(() => setError("Failed to add item"));
        }
    };

    return (
        <div className={styles.itemsAdminPage}>
            <h2>Manage Items</h2>
            <form
                onSubmit={handleFormSubmit}
                style={{
                    marginBottom: 24,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    alignItems: "center",
                    background: "#fff8f2",
                    borderRadius: 8,
                    padding: 16,
                }}
            >
                <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    required
                    style={{ minWidth: 120 }}
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    style={{ minWidth: 120 }}
                />
                <input
                    name="price"
                    placeholder="Price"
                    type="number"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                    style={{ minWidth: 80 }}
                />
                <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFormChange}
                    style={{ minWidth: 180 }}
                />
                <input
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleFormChange}
                    style={{ minWidth: 180 }}
                />
                <button className={styles.addBtn} type="submit">
                    {editing ? "Update" : "Add"} Item
                </button>
                {editing && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditing(null);
                            setForm(emptyItem);
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
                <table className={styles.itemsTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.description}</td>
                                <td>{item.category?.name || "-"}</td>
                                <td>
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: 60,
                                                height: 40,
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}
                                </td>
                                <td>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() => handleEdit(item)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(item._id)}
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

export default ItemsAdminPage;
