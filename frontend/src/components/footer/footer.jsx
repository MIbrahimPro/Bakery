import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./footer.scss";

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

const Footer = () => {
    const [data, setData] = useState(null);
    const location = useLocation();
    const footerColor = NAVBAR_COLORS[location.pathname] || "#6Cfff";

    useEffect(() => {
        axios
            .get("/general")
            .then((res) => setData(res.data))
            .catch(() => setData(null));
    }, []);

    return (
        <div
            id="footer"
            style={{
                backgroundColor: ` ${footerColor} `,
            }}
        >
            <div id="social-container">
                <div className="footer__contact">
                    <i>{data?.contactNumber || "+92 99999 88888"}</i>
                </div>
                <div className="footer__social">
                    <ul className="horizontal-list text-center social-icons">
                        <li>
                            <a href="#">
                                <i className="fa fa-pinterest fa-4x"></i>
                            </a>
                        </li>
                        <li>
                            <a
                                href={data?.instagramLink || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fa fa-instagram"></i>
                            </a>
                        </li>
                        <li>
                            <a
                                href={data?.twitterLink || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fa fa-twitter"></i>
                            </a>
                        </li>
                        <li>
                            <a
                                href={data?.youtubeLink || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fa fa-youtube"></i>
                            </a>
                        </li>
                        <li>
                            <a
                                href={data?.facebookLink || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fa fa-facebook"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer__mail">
                    <i>{data?.contactEmail || "tresbakery@gmail.com"}</i>
                </div>
            </div>
        </div>
    );
};

export default Footer;
