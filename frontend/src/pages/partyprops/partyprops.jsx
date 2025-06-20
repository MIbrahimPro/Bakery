import React, { useEffect, useState } from "react";
import axios from "axios";
import "./partyprops.scss";
import { useNavigate } from "react-router-dom";

const PartyProps = () => {
    const [category, setCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("/categories/partyprops")
            .then((res) => {
                if (res.data && res.data._id) {
                    setCategory(res.data);
                    axios
                        .get(`/items/category/${res.data._id}`)
                        .then((itemsRes) => setItems(itemsRes.data))
                        .catch(() => setItems([]))
                        .finally(() => setLoading(false));
                } else {
                    navigate("/Homepage");
                }
            })
            .catch(() => {
                navigate("/Homepage");
            });
    }, [navigate]);

    if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
    if (!category) return null;

    return (
        <>
            <div id="heading">
                <h1>Party Props</h1>
                <h4>
                    <u>"LET'S PARTY LIKE GATSBY."</u>
                </h4>
            </div>
            <div id="main">
                {items.map((item, idx) => (
                    <div className="props" key={item._id || idx}>
                        <div className="pic">
                            <img
                                className="image"
                                src={item.image}
                                alt={item.name}
                            />
                        </div>
                        <div className="text">
                            <div className="name">
                                {item.name}
                                <br />
                            </div>
                            <br />
                            <div>
                                Price of 1 piece : {item.price}rs <br />
                                Quantity :&nbsp;&nbsp;&nbsp;
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    style={{
                                        borderRadius: "4px",
                                        color: "#5bb6bf",
                                        height: "33px",
                                        width: "90px",
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PartyProps;
