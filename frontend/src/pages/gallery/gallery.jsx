import React, { useEffect, useState } from "react";
import axios from "axios";
import "./gallery.scss";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("/gallery/all")
            .then((res) => setImages(Array.isArray(res.data) ? res.data : []))
            .catch(() => setError("Could not load gallery."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="header">
                <h1>G A L L E R Y</h1>
            </div>
            <div className="subheader">
                <h2>SPECIALS</h2>
                <p>
                    - A collection of images of all our special menus (limited
                    period items)!
                </p>
            </div>
            {loading && <div style={{ padding: 32 }}>Loading...</div>}
            {error && <div style={{ padding: 32, color: "red" }}>{error}</div>}
            <div className="masonry-row">
                {images.map((img) => (
                    <div className="masonry-item" key={img._id}>
                        <div className="img-hover-wrap">
                            <img src={img.imageUrl} alt={img.title} />
                            <div className="img-hover-info">
                                <strong>{img.title}</strong>
                                <div>{img.description}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
