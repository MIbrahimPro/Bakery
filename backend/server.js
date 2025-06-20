// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const requestLogger = require("./middlewares/logger");

const app = express();
connectDB();

app.use(express.json());
app.use(requestLogger);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// existing routes...
app.use("/categories", require("./routes/categories"));
app.use("/items", require("./routes/items"));
app.use("/contests", require("./routes/contests"));
app.use("/order", require("./routes/orders"));
app.use("/auth", require("./routes/auth"));
app.use("/gallery", require("./routes/gallery"));
app.use("/cooking-videos", require("./routes/cookingVideos"));
app.use("/staff", require("./routes/staff"));

// new routes:
app.use("/users", require("./routes/users"));
app.use("/general", require("./routes/general"));
app.use("/search", require("./routes/search"));

app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
