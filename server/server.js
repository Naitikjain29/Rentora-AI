
require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const connectDB = require("./src/config/db");
const path = require("path");
const cors = require("cors");

// Routes
const userRoute = require("./src/routes/userRoute");
const categoryRoute = require("./src/routes/categoryRoute");
const propertyRoute = require("./src/routes/propertyRoute");
const rentalReqRoute = require("./src/routes/rentalReqRoute");
const aiRoute = require("./src/routes/aiRoute");
const adminRoute = require("./src/routes/adminRoute");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images from server/uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// API routes
app.use("/users", userRoute);
app.use("/categories", categoryRoute);
app.use("/properties", propertyRoute);
app.use("/rental-requests", rentalReqRoute);
app.use("/ai", aiRoute);
app.use("/admin", adminRoute);

app.get("/", (req, res) => {
  res.json({ msg: "Hello From Property Rental Manager" });
});

// Error handler for upload errors
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(err instanceof multerError ? 400 : 500).json({
    msg: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is Running at Port ${PORT}`);
  }
});
