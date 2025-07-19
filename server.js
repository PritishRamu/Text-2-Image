require("dotenv").config();  // Load environment variables from .env file
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
// const PORT = 5000; // Backend runs on port 5000
const PORT=process.env.PORT || 5000;

app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request body
app.use(express.static('public'));

app.get("/", (req, res) => res.send("🖼️ Service is up!"));
// Route to generate images using OpenAI API
app.post("/generate", async (req, res) => {
    try {
        const { prompt, n } = req.body;

        const response = await axios.post(
            "https://api.openai.com/v1/images/generations",
            {
                prompt: prompt,
                n: n,
                size: "512x512",
                response_format: "b64_json",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        res.json(response.data); // Send response back to frontend
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate image" });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
