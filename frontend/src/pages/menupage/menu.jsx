import React, { useEffect, useState } from "react";
import axios from "axios";
import "./menu.scss";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../../CartContext";

const Menu = () => {
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("category");
    const [category, setCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        if (!categoryId) return;
        setLoading(true);
        setError(null);
        // Fetch category info
        axios
            .get(`/categories/${categoryId}`)
            .then((res) => setCategory(res.data))
            .catch(() => setCategory(null));
        // Fetch items in category
        axios
            .get(`/items/category/${categoryId}`)
            .then((res) => {
                console.log(res.data);
                setItems(res.data);
            })
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, [categoryId]);

    if (!categoryId)
        return <div style={{ padding: 32 }}>No category selected.</div>;
    if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
    if (error)
        return <div style={{ padding: 32, color: "red" }}>Error: {error}</div>;

    return (
        <>
            <div id="heading">
                <h1>{category?.name || "Category"}</h1>
                <h4>{category?.description || ""}</h4>
            </div>
            <div id="main">
                {items.length === 0 && (
                    <div>No items found in this category.</div>
                )}
                {items.map((item) => (
                    <div className="card" key={item._id}>
                        <img
                            src={item.image}
                            className="item-img"
                            alt={item.name}
                        />
                        <h1>{item.name}</h1>
                        <p className="item-price">₹{item.price}</p>
                        <p className="description">{item.description}</p>
                        <p>
                            <button
                                onClick={() =>
                                    addToCart({
                                        id: item._id,
                                        name: item.name,
                                        price: item.price,
                                        imageUrl: item.image || item.imageUrl,
                                    })
                                }
                            >
                                Add to Cart
                            </button>
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Menu;
