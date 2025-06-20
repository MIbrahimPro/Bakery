import React, { useEffect, useState } from "react";
import axios from "axios";
import "./kitchenpage.scss";

const KitchenPage = () => {
    const [chefs, setChefs] = useState([]);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios
            .get("/staff/all")
            .then((res) => setChefs(res.data))
            .catch(() => setChefs([]));
        axios
            .get("/cooking-videos/all")
            .then((res) => setVideos(res.data))
            .catch(() => setVideos([]));
    }, []);

    return (
        <div>
            <div id="heading">
                <h1>Our Top Chefs</h1>
                <h4>
                    "A recipe has no soul. You, as the cook, must bring soul to
                    the recipe."
                    <br />- Thomas Keller
                </h4>
            </div>
            <div id="chefs">
                {chefs.map((chef) => (
                    <div className="image" key={chef._id}>
                        <a href="#">
                            <img
                                className="image-img chef-image"
                                src={chef.pictureUrl}
                                alt={chef.name}
                            />
                            <div className="image-overlay">
                                <div className="image-title">{chef.name}</div>
                                <div
                                    style={{
                                        fontWeight: "bold",
                                        marginBottom: "0.5em",
                                    }}
                                >
                                    {chef.role}
                                </div>
                                <p className="image-discription">
                                    {chef.description}
                                </p>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
            <p
                className="blink"
                style={{
                    fontFamily: "serif",
                    color: "purple",
                    fontSize: "3em",
                    textAlign: "center",
                }}
            >
                <i>
                    <u>
                        The Chief Ingredient in yummy food is always <b>LOVE</b>
                    </u>
                </i>
            </p>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    margin: "2% 0",
                }}
            >
                {videos.map((video) => (
                    <video
                        key={video._id}
                        src={video.videoUrl}
                        controls
                        autoPlay
                        muted
                        height="50%"
                        width="35%"
                        style={{
                            margin: "2% 0 0 2%",
                            border: "7px double black",
                            background: "#000",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default KitchenPage;
