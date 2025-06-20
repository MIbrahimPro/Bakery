import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../CartContext";
import { useAdmin } from "../../AdminContext";
import "./navbar.scss"; // Adjust the path if needed

const NAVBAR_COLORS = {
    "/Homepage": "#e8a49e",
    "/Cakes": "#cb997e",
    "/Pastries": "#ee0e98",
    "/Cupcakes": "#f38e1a",
    "/BiscuitsAndCookies": "#e5989b",
    "/Donut": "#40916C",
    "/Waffles": "#01497c",
    "/Breads": "#cb997e",
    "/Others": "#ee0e98",
    "/Gallery": "#cb997e",
    "/KitchenPage": "#40916C",
    "/PartyProps": "#159494",
    "/Checkout": "#5390d9",
    // Add more as needed
};

const BODY_COLORS = {
    "/Homepage": "#f5deda",
    "/Cakes": "#ddbea9",
    "/Pastries": "#f3c4fb",
    "/Cupcakes": "#fca76e",
    "/BiscuitsAndCookies": "#EEBCBE",
    "/Donut": "#74C69D",
    "/Waffles": "#2c7da0",
    "/Breads": "#ddbea9",
    "/Others": "#eea9d7",
    "/Gallery": "#e2cfc3",
    "/KitchenPage": "#74C69D",
    "/PartyProps": "#249eaa",
    "/Checkout": "#64dfdf",
    // Add more as needed
};

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNav, setShowNav] = useState(false);
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [showProps, setShowProps] = useState(false);
    const [propsId, setPropsId] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { items } = useCart();
    const { isAdmin } = useAdmin();

    // Set navbar and body color based on route
    const navbarColor = NAVBAR_COLORS[location.pathname] || "#ee0e98";
    const bodyColor = BODY_COLORS[location.pathname] || "#f3c4fb";

    React.useEffect(() => {
        document.body.style.background = bodyColor;
        return () => {
            document.body.style.background = "";
        };
    }, [bodyColor]);

    useEffect(() => {
        axios
            .get("/categories/all")
            .then((res) => setCategories(res.data))
            .catch(() => setCategories([]));
    }, []);

    useEffect(() => {
        axios
            .get("/categories/propcheck")
            .then((res) => {
                if (res.data && res.data.exists && res.data.exists._id)
                    setPropsId(res.data.exists._id);
                else setPropsId(null);
            })
            .catch(() => setPropsId(null));
    }, []);

    const handleDropdown = () => setShowDropdown((prev) => !prev);
    const handleNavToggle = () => setShowNav((prev) => !prev);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?q=${encodeURIComponent(search)}`);
        }
    };

    const handleDropdownLink = (cat) => {
        navigate(`/${encodeURIComponent(cat.name)}?category=${cat._id}`);
        setShowDropdown(false);
    };

    return (
        <div
            className={`navtop${showNav ? " responsive" : ""}`}
            id="mynavTop"
            style={{ backgroundColor: navbarColor }}
        >
            <a href="/Homepage">Home</a>
            <div
                className="drop_down"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
            >
                <button
                    className="dropdown_btn"
                    type="button"
                    onClick={handleDropdown}
                    aria-haspopup="true"
                    aria-expanded={showDropdown}
                >
                    Items <i className="fa fa-caret-down"></i>
                </button>
                <div
                    className="drop-content"
                    style={{ display: showDropdown ? "block" : "none" }}
                >
                    {categories.map((cat) => (
                        <a
                            key={cat._id}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDropdownLink(cat);
                            }}
                        >
                            {cat.name}
                        </a>
                    ))}
                </div>
            </div>
            {/* Admin Dropdown */}
            {isAdmin && (
                <div className="drop_down" style={{ display: "inline-block" }}>
                    <button className="dropdown_btn" type="button">
                        Admin <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="drop-content">
                        <a href="/admin/items">Manage Items</a>
                        <a href="/admin/orders">Manage Orders</a>
                        <a href="/admin/users">Manage Users</a>
                        <a href="/admin/staff">Manage Kitchen</a>
                        <a href="/admin/gallery">Manage Gallery</a>
                        <a href="/admin/general">General Info Editor</a>
                        <a href="/admin/cooking-videos">
                            Manage Cooking Videos
                        </a>
                        <a href="/admin/contests">Manage Contests</a>
                    </div>
                </div>
            )}
            <a href="/KitchenPage">Our Kitchen</a>
            {propsId && <a href="/PartyProps">Props</a>}
            <a href="/Gallery">Gallery</a>
            <a href="/FAQ" target="_blank" rel="noopener noreferrer">
                FAQ
            </a>
            <a href="/Cart" style={{ float: "right" }}>
                <i className="fa fa-shopping-cart"></i>
                <span className="cart-items">
                    ( {items.reduce((sum, i) => sum + i.quantity, 0)} )
                </span>
            </a>
            <a
                href={
                    localStorage.getItem("token") ? "/Profile" : "/SignUp Page"
                }
                style={{ float: "right" }}
            >
                <i className="fa fa-user"></i>
            </a>
            <button
                className="icon"
                style={{ fontSize: "15px" }}
                onClick={handleNavToggle}
                aria-label="Toggle navigation"
            >
                &#9776;
            </button>
            <div className="search-container">
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search"
                        name="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">
                        <i className="fa fa-search"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Navbar;
