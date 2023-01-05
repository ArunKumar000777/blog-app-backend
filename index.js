const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();

// dotenv configuration
dotenv.config();
// to send json file
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
// mongodb connection
mongoose
    .connect(process.env.MONGOCONN__URL)
    .then(console.log(" mongodb connected"))
    .catch((err) => console.error(err));
app.use(cors({ origin: ["https://blog-app-arun.onrender.com","http://localhost:3000"], methods: ["GET", "POST", "DELETE", "PUT", "PATCH"] }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("file has been uploaded");
});

// api

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

// app listening on port 5000
app.listen(process.env.PORT || 5000, () => {
    console.log("server running on 5000");
});
