import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./UserAdminPage.module.scss";

const UsersAdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const fetchUsers = () => {
        setLoading(true);
        setError("");
        axios
            .get("/users/admin/users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => setUsers(res.data))
            .catch(() => setError("Failed to fetch users"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = (id, newRole) => {
        setMsg("");
        setError("");
        axios
            .put(
                `/users/admin/user/${id}`,
                { role: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then(() => {
                setMsg("Role updated");
                fetchUsers();
            })
            .catch(() => setError("Failed to update role"));
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this user?")) return;
        setMsg("");
        setError("");
        axios
            .delete(`/users/admin/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(() => {
                setMsg("User deleted");
                fetchUsers();
            })
            .catch(() => setError("Failed to delete user"));
    };

    return (
        <div className={styles.usersAdminPage}>
            <h2>Manage Users</h2>
            {loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : error ? (
                <div className={styles.errorMsg}>{error}</div>
            ) : (
                <table className={styles.usersTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td className={styles.idCol}>{u._id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>
                                    <select
                                        className={styles.roleSelect}
                                        value={u.role}
                                        onChange={(e) =>
                                            handleRoleChange(
                                                u._id,
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="customer">
                                            customer
                                        </option>
                                        <option value="admin">admin</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(u._id)}
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

export default UsersAdminPage;
