import React from "react";
import { useCart } from "../../CartContext";
import { useNavigate } from "react-router-dom";
import "./CartPage.scss";

export default function CartPage() {
    const { items, increaseQty, decreaseQty, removeFromCart, clearCart } =
        useCart();
    const navigate = useNavigate();
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <div className="cart-page">
            <h2>Your Cart</h2>
            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            width={50}
                                        />
                                        {item.name}
                                    </td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>
                                        <button
                                            onClick={() => decreaseQty(item.id)}
                                        >
                                            -
                                        </button>
                                        {item.quantity}
                                        <button
                                            onClick={() => increaseQty(item.id)}
                                        >
                                            +
                                        </button>
                                    </td>
                                    <td>
                                        $
                                        {(item.price * item.quantity).toFixed(
                                            2
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                removeFromCart(item.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="cart-summary">
                        <h3>Total: ${total.toFixed(2)}</h3>
                        <button onClick={() => navigate("/checkout")}>
                            Proceed to Checkout
                        </button>
                        {/* <button onClick={clearCart}>Clear Cart</button> */}
                    </div>
                </>
            )}
        </div>
    );
}
