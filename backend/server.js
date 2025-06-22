// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const methodOverride = require('method-override');
const cookieParser = require("cookie-parser");
const requestLogger = require("./middlewares/logger");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const commonData = require("./middlewares/commonData");
const flash = require("connect-flash");

const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestLogger);
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // set secure: true in production (HTTPS)
    })
);

app.use(flash());

// Routes
app.use("/categories", require("./routes/categories"));
app.use("/items", require("./routes/items"));
app.use("/contests", require("./routes/contests"));
app.use("/order", require("./routes/orders"));
app.use("/auth", require("./routes/auth"));
app.use("/gallery", require("./routes/gallery"));
app.use("/cooking-videos", require("./routes/cookingVideos"));
app.use("/staff", require("./routes/staff"));
app.use("/users", require("./routes/users"));
app.use("/general", require("./routes/general"));
app.use("/search", require("./routes/search"));

//view routes
app.use(methodOverride('_method'));
app.use(expressLayouts);

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

app.use((req, res, next) => {
    res.locals.navbarColor = NAVBAR_COLORS[req.path] || "#ee0e98";
    res.locals.bodyColor = BODY_COLORS[req.path] || "#f3c4fb";
    next();
});
app.set("layout", "layout");
app.use(commonData);
app.use("/views", require("./routes/views"));

app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
