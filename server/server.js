const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;
require("dotenv").config();

// ✅ Allow frontend origin
app.use(
  cors({
    origin: [
      "https://tfcgym.in",
      "https://tungstenfitnessclub.com",
      "https://tungstenfitness.in",
      "http://127.0.0.1:5500",
    ], // allow your frontend origins
    methods: ["GET", "POST"], // allowed methods
    allowedHeaders: ["Content-Type"], // headers allowed
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/forms", require("./routes/formRoutes"));

app.get("/", (req, res) => {
  res.send("API running......");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});