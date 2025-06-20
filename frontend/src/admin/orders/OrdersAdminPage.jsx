import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./OrdersAdminPage.module.scss";

const OrdersAdminPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const fetchOrders = () => {
        setLoading(true);
        setError("");
        axios
            .get("/order/all-orders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => setOrders(res.data))
            .catch(() => setError("Failed to fetch orders"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = (id, paymentStatus, orderStatus) => {
        setMsg("");
        setError("");
        axios
            .put(
                `/order/update/${id}`,
                { paymentStatus, orderStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then(() => {
                setMsg("Order updated");
                fetchOrders();
            })
            .catch(() => setError("Failed to update order"));
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this order?")) return;
        setMsg("");
        setError("");
        axios
            .delete(`/order/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(() => {
                setMsg("Order deleted");
                fetchOrders();
            })
            .catch(() => setError("Failed to delete order"));
    };

    return (
        <div className={styles.ordersAdminPage}>
            <h2>Manage Orders</h2>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className={styles.errorMsg}>{error}</div>
            ) : (
                <table className={styles.ordersTable}>
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            <th>User Email</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Payment Status</th>
                            <th>Payment Method</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                {/* <td>{order._id}</td> */}
                                <td>{order.user?.email || "-"}</td>
                                <td>₹{order.totalPrice}</td>
                                <td>
                                    <select
                                        className={styles.statusSelect}
                                        value={order.orderStatus}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                order._id,
                                                order.paymentStatus,
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="new">new</option>
                                        <option value="preparing">
                                            preparing
                                        </option>
                                        <option value="out-for-delivery">
                                            out-for-delivery
                                        </option>
                                        <option value="delivered">
                                            delivered
                                        </option>
                                        <option value="cancelled">
                                            cancelled
                                        </option>
                                    </select>
                                </td>
                                <td>
                                    <select
                                        className={styles.statusSelect}
                                        value={order.paymentStatus}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                order._id,
                                                e.target.value,
                                                order.orderStatus
                                            )
                                        }
                                    >
                                        <option value="pending">pending</option>
                                        <option value="paid">paid</option>
                                        <option value="failed">failed</option>
                                    </select>
                                </td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    {order.deliveryLocation?.title}:{" "}
                                    {order.deliveryLocation?.address}
                                </td>
                                <td>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(order._id)}
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

export default OrdersAdminPage;
