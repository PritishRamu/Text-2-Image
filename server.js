require("dotenv").config();            // Load environment variables from .env
const express = require("express");
const path = require("path");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());                       // Enable CORS
app.use(express.json());               // Parse JSON bodies

// Serve your front‑end UI
app.use(express.static("public"));

// Serve your project‑root images folder at /images URL
app.use(
  "/images",
  express.static(path.join(__dirname, "images"))
);

// Simple health‑check (optional)
app.get("/", (req, res) => res.send("🖼️ Service is up!"));

// Text‑to‑Image endpoint
app.post("/generate", async (req, res) => {
  try {
    const { prompt, n } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      { prompt, n: n || 1, size: "512x512", response_format: "b64_json" },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
