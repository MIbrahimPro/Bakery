import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useCart } from "../../CartContext";
import "./SearchResultPage.scss";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchResultPage = () => {
    const query = useQuery().get("q") || "";
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        if (!query) return;
        setLoading(true);
        axios
            .get(`/search?q=${encodeURIComponent(query)}`)
            .then((res) => setItems(res.data))
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <>
            <div id="heading">
                <h1>Search Results</h1>
                <h4>Searching for "{query}"</h4>
            </div>
            <div id="main">
                {loading ? (
                    <div>Loading...</div>
                ) : items.length === 0 ? (
                    <div>No items found.</div>
                ) : (
                    items.map((item) => (
                        <div key={item._id} className="card">
                            {item.image && (
                                <img
                                    src={item.image}
                                    className="item-img"
                                    alt={item.name}
                                />
                            )}
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
                                            imageUrl:
                                                item.image || item.imageUrl,
                                        })
                                    }
                                >
                                    Add to Cart
                                </button>
                            </p>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default SearchResultPage;
