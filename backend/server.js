require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { getJwtSecret } = require("./auth");
const { notFound, errorHandler } = require("./middleware/errors");
const app = express();

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const adminRoutes = require("./routes/adminRoutes");
const PORT = Number(process.env.PORT) || 5000;

getJwtSecret();

app.use(cors());
app.use(express.json());

// Serve static upload assets (resumes, avatars)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Campus Placement System 🚀");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
