import React, { useEffect, useState } from "react";
import { useCart } from "../../CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CheckoutPage.scss";

export default function CheckoutPage() {
    const { items, clearCart } = useCart();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/Login");
            return;
        }
        axios
            .get("/users/me/addresses", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setAddresses(res.data);
                if (res.data.length > 0) setSelectedAddress(res.data[0]._id);
            })
            .catch(() => setAddresses([]));
    }, [navigate]);

    const handlePlaceOrder = async () => {
        setError("");
        setSuccess("");
        if (!selectedAddress) {
            setError("Please select a delivery address.");
            return;
        }
        if (items.length === 0) {
            setError("Your cart is empty.");
            return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            // Get userId from /auth/me
            const userRes = await axios.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userId = userRes.data._id;
            const addressObj = addresses.find((a) => a._id === selectedAddress);
            const orderItems = items.map((i) => ({
                itemId: i.id,
                quantity: i.quantity,
            }));
            await axios.post(
                "/order",
                {
                    userId,
                    items: orderItems,
                    deliveryLocation: addressObj,
                    paymentMethod,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess("Order placed successfully!");
            clearCart();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to place order. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <h2>Checkout</h2>
            <div className="checkout-section">
                <h3>Order Summary</h3>
                <ul className="checkout-items">
                    {items.map((item) => (
                        <li key={item.id}>
                            {item.name} x {item.quantity} = ${" "}
                            {(item.price * item.quantity).toFixed(2)}
                        </li>
                    ))}
                </ul>
                <div className="checkout-total">Total: ${total.toFixed(2)}</div>
            </div>
            <div className="checkout-section">
                <h3>Delivery Address</h3>
                {addresses.length === 0 ? (
                    <div>
                        <p>No addresses found.</p>
                        <button
                            className="checkout-btn"
                            onClick={() => navigate("/Profile")}
                        >
                            Add Address
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="checkout-address-list">
                            {addresses.map((addr) => (
                                <label
                                    key={addr._id}
                                    className="checkout-address-item"
                                >
                                    <input
                                        type="radio"
                                        name="address"
                                        value={addr._id}
                                        checked={selectedAddress === addr._id}
                                        onChange={() =>
                                            setSelectedAddress(addr._id)
                                        }
                                    />
                                    <span>
                                        <b>{addr.title}:</b> {addr.address}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <button
                            className="checkout-btn"
                            onClick={() => navigate("/Profile")}
                        >
                            Add Address
                        </button>
                    </>
                )}
            </div>
            <div className="checkout-section">
                <h3>Payment Method</h3>
                <div className="checkout-payment-methods">
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="cash"
                            checked={paymentMethod === "cash"}
                            onChange={() => setPaymentMethod("cash")}
                        />
                        Cash on Delivery
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="card"
                            checked={paymentMethod === "card"}
                            onChange={() => setPaymentMethod("card")}
                        />
                        Card
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="payment"
                            value="online"
                            checked={paymentMethod === "online"}
                            onChange={() => setPaymentMethod("online")}
                        />
                        Online
                    </label>
                </div>
            </div>
            {(error || success) && (
                <div className={error ? "checkout-error" : "checkout-success"}>
                    {error || success}
                </div>
            )}
            <button
                className="checkout-btn checkout-placeorder"
                onClick={handlePlaceOrder}
                disabled={loading || addresses.length === 0}
            >
                {loading ? "Placing Order..." : "Place Order"}
            </button>
        </div>
    );
}
