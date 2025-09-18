const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;
require("dotenv").config();


// ✅ Allow frontend origin
app.use(cors({
  origin: ["https://tfcgym.in", "https://tungstenfitnessclub.com", "https://tungstenfitness.in"], // allow your frontend origins
  methods: ["GET", "POST"], // allowed methods
  allowedHeaders: ["Content-Type"], // headers allowed
}));

app.use(express.json());

// Routes
app.use("/api/forms", require("./routes/formRoutes"));

app.get("/", (req, res) => {
  res.send("API running......");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});