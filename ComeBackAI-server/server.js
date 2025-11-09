import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.API_KEY;

// Main AI route
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error("API Error:", data.error);
      return res.status(400).json({ error: data.error.message });
    }
    
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET route for testing in browser
app.get("/api/generate", async (req, res) => {
  try {
    const prompt = req.query.prompt || "Hello, tell me a joke";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error("API Error:", data.error);
      return res.status(400).json({ error: data.error.message });
    }
    
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`✅ ComeBackAI Server running on http://localhost:${process.env.PORT}`);
});
