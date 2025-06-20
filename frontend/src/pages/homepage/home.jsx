import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.scss";
import { useNavigate } from "react-router-dom";

const SLIDES = [
    "/static/p1.jpg",
    "/static/p2.jpg",
    "/static/p3.jpg",
    "/static/p4.jpg",
    "/static/p5.jpg",
    "/static/p6.jpg",
];

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [propsCategory, setPropsCategory] = useState(null);
    const [poll, setPoll] = useState([]);
    const [specials, setSpecials] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [mapUrl, setMapUrl] = useState("");
    const [slide, setSlide] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("/categories/all")
            .then((res) => setCategories(res.data || []));
        axios
            .get("/categories/partyprops")
            .then((res) => setPropsCategory(res.data))
            .catch(() => setPropsCategory(null));
        axios
            .get("/categories/stats/today")
            .then((res) => setPoll(res.data || []));
        axios.get("/items/random2").then((res) => setSpecials(res.data || []));
        axios.get("/gallery/limited").then((res) => setGallery(res.data || []));
        axios.get("/general").then((res) => {
            setAnalytics(res.data.analytics);
            setMapUrl(res.data.mapEmbedUrl);
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(
            () => setSlide((s) => (s + 1) % SLIDES.length),
            4000
        );
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="homepage-root">
            <div id="bakery-name">
                <img src="/logo.jpg" alt="Bakery Logo" />
            </div>

            {/* Slideshow */}
            <div className="slider">
                <div className="slides">
                    {SLIDES.map((src, idx) => (
                        <div
                            className="slide"
                            key={src}
                            style={{
                                display: idx === slide ? "block" : "none",
                            }}
                        >
                            <img src={src} alt={`slide${idx + 1}`} />
                        </div>
                    ))}
                </div>
                <div className="navigation-manual">
                    {SLIDES.map((_, idx) => (
                        <label
                            key={idx}
                            className="manual-btn"
                            style={{
                                background: idx === slide ? "grey" : undefined,
                            }}
                            onClick={() => setSlide(idx)}
                        ></label>
                    ))}
                </div>
            </div>

            {/* Items Container */}
            <div id="items-container">
                {categories.map((cat) => (
                    <div
                        key={cat._id}
                        className="items"
                        onClick={() =>
                            navigate(`/${cat.name}?category=${cat._id}`)
                        }
                        style={{ cursor: "pointer" }}
                    >
                        <img
                            src={cat.image || "/images/item1.jpg"}
                            alt={cat.name}
                        />
                        <p className="item-names">{cat.name}</p>
                    </div>
                ))}
            </div>
            {/* Party Props */}
            {propsCategory && (
                <div id="props">
                    <img src={propsCategory.image} alt={propsCategory.name} />
                    <div id="props-text">
                        <a href="/PartyProps">
                            <h3>Party Props</h3>
                        </a>
                    </div>
                </div>
            )}
            {/* Poll Chart */}
            <div className="flex-container">
                <div className="flex-child">
                    <h1 className="blink">Today's Poll!</h1>
                    <p style={{ fontSize: 20 }}>
                        Check the customer's opinion on our top items and select
                        the perfect one for you!
                    </p>
                    <div className="poll1">
                        {poll.map((item, idx) => (
                            <div
                                key={item._id}
                                id={`div${idx + 1}`}
                                className="poll"
                                style={{
                                    height: `${Math.max(
                                        50,
                                        item.count * 20
                                    )}px`,
                                }}
                            >
                                <span className="poll-label">{item.name}</span>
                                <span className="poll-count">{item.count}</span>
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: 18 }}>
                        <i>
                            Order our top 3 rated items now and get{" "}
                            <b>20% off</b>!
                        </i>
                    </p>
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                            document
                                .getElementById("items-container")
                                .scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        Order Now
                    </button>
                    {/* Specials/New Items */}
                    <div id="new-item-container">
                        <h1 className="blink">SPECIALS!</h1>
                        <p style={{ fontSize: 20 }}>
                            We're always excited to serve our customers the
                            latest in the trend and best in the quality. So,
                            here we bring two new mouth watering special
                            desserts for you!
                        </p>
                        {specials.map((item) => (
                            <div className="newitem" key={item._id}>
                                <h1 id="special-heading">{item.name}</h1>
                                <p style={{ fontSize: 20 }}>
                                    {item.description}
                                </p>
                                <img
                                    src={item.image}
                                    className="special-image"
                                    alt={item.name}
                                />
                                <br />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                >
                                    Order Now
                                </button>
                            </div>
                        ))}
                    </div>
                    <div id="new-item-container">
                        <h1 className="blink">Participate and Earn!</h1>
                        <i>
                            <p style={{ fontSize: 22 }}>
                                "Find something you're passionate about and keep
                                yourself tremendously interested in it."
                                <br />
                                -Julia Child
                            </p>
                        </i>
                        <p style={{ fontSize: 20 }}>
                            Make any of the item found in a bakery and upload
                            its recipe and picture; along with some other
                            necessary personal details and send it to us to win
                            exciting prizes!
                            <br />
                            <a
                                href="/ParticipationForm"
                                className="participate"
                                style={{
                                    textDecoration: "none",
                                    color: "blue",
                                }}
                                target="_blank"
                            >
                                <i>Click here for the participation form!</i>
                            </a>
                        </p>
                        <img
                            src="https://i.pinimg.com/474x/4d/4b/c6/4d4bc6763ed4769d202dfe3ccb8498ac.jpg"
                            className="special-image"
                            alt="participate"
                        />
                    </div>
                </div>
                {/* Gallery */}
                <div className="flex-child">
                    <div id="gallery">
                        <h1
                            align="center"
                            style={{
                                fontSize: "3.5em",
                                color: "purple",
                                margin: "2%",
                                textAlign: "center",
                                width: "100%",
                            }}
                        >
                            <u>GALLERY</u>
                        </h1>
                        <div className="gallery-pics">
                            {gallery.map((img, idx) => (
                                <div
                                    key={img._id || idx}
                                    className="pics"
                                    style={{
                                        backgroundImage: `url(${img.imageUrl})`,
                                    }}
                                    title={img.title || `gallery${idx}`}
                                ></div>
                            ))}
                        </div>
                        <br />
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-bg"
                            style={{ marginLeft: "10%" }}
                            onClick={() => navigate("/Gallery")}
                        >
                            View More
                        </button>
                    </div>
                </div>
            </div>
            {/* Our Kitchen */}
            <div id="props">
                <img
                    src="https://www.buzztime.com/business/wp-content/uploads/2017/09/kitchen-inspection-750-x-340.jpg"
                    alt="Our Kitchen"
                />
                <div id="props-text">
                    <a href="/KitchenPage">
                        <h3>Our Kitchen</h3>
                    </a>
                </div>
            </div>
            {/* About/Values */}
            <div id="about">
                <h1 style={{ fontStyle: "italic", textAlign: "center" }}>
                    <b>Presence</b>
                </h1>
                <h4
                    style={{
                        fontStyle: "italic",
                        textAlign: "center",
                        color: "grey",
                        fontSize: 18,
                    }}
                >
                    "Our aim is to continue enriching the global sweet market."
                </h4>
                <br />
                <p style={{ textAlign: "justify" }}>
                    Consisting of a team of field experts and talented
                    management board, we are collectively concentrating our
                    effort to spread the goodness of organically baked goods as
                    far as possible. Over the course of the production, we have
                    been challenging ourselves every single step. In search for
                    a unique and fulfilling experience for our customers, our
                    sweet team has been sharing and discussing the tastes and
                    knowledge with our quality-demanding food experts from
                    numerous cafés, restaurants, and hotels worldwide. We are
                    trying to smoothly build a healthy, medium-sized company;
                    placing emphasis on creating and maintaining a warm
                    relationships with our customers and business partners.
                </p>
                <div></div>
                <h1 style={{ fontStyle: "italic", textAlign: "center" }}>
                    <b>Values</b>
                </h1>
                <h4
                    style={{
                        fontStyle: "italic",
                        textAlign: "center",
                        color: "grey",
                        fontSize: 18,
                    }}
                >
                    "We believe in uniqueness."
                </h4>
                <br />
                <p style={{ textAlign: "justify" }}>
                    Our philosophy is baked from the freshest of ingredients. We
                    have combined systematic and inspiring collaboration with
                    our employees by using the best raw materials and machines,
                    together with customers’ expectations, high technological
                    approaches to producing sweets our aspirations, as well as
                    undying respect for quality and safety. We believe that the
                    results will always be absolutely unique and fulfilling!
                </p>
                <div></div>
                <div id="details-container">
                    <div className="details-child">
                        <h3 className="about-subheading">
                            <b>{analytics?.yearsOfOperation || 0} years</b>
                        </h3>
                        <h4 className="subheading-content">
                            delivering the unmatched
                            <br />
                            quality to all passionate
                            <br />
                            cake lovers.
                        </h4>
                    </div>
                    <div className="details-child">
                        <h3 className="about-subheading">
                            <b>{analytics?.employeesCount || 0} employees</b>
                        </h3>
                        <h4 className="subheading-content">
                            producing the unique sweet
                            <br />
                            solutions delighting
                            <br />
                            customers' demands.
                        </h4>
                    </div>
                    <div className="details-child">
                        <h3 className="about-subheading">
                            <b>
                                {analytics?.bakedKilograms?.toLocaleString() ||
                                    0}{" "}
                                Kg
                            </b>
                        </h3>
                        <h4 className="subheading-content">
                            of baked goodies adored,
                            <br />
                            eaten and appreciated
                            <br />
                            by customers.
                        </h4>
                    </div>
                    <div className="details-child">
                        <h3 className="about-subheading">
                            <b>
                                {analytics?.destinationsCount || 0} destinations
                            </b>
                        </h3>
                        <h4 className="subheading-content">
                            all around the world <br />
                            taking pleasure
                            <br />
                             in our cakes.
                        </h4>
                    </div>
                    <div className="googlemap"></div>
                    {mapUrl && (
                        <iframe
                            src={mapUrl}
                            width="600"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Bakery Map"
                        ></iframe>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
