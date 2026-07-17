const express = require("express");
const cors = require("cors");
const app = express();

const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Student Routes
console.log(studentRoutes);
console.log(companyRoutes);

app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.get("/", (req, res) => {
    res.send("Welcome to Campus Placement System 🚀");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});