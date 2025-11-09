import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import apiKeyManager from "./apiKeyManager.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Main AI route
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Get next API key from rotation
    const apiKey = apiKeyManager.getNextKey();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
    
    // Get next API key from rotation
    const apiKey = apiKeyManager.getNextKey();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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

// API Key stats endpoint (optional - for monitoring)
app.get("/api/stats", (req, res) => {
  const stats = apiKeyManager.getStats();
  res.json({
    totalKeys: apiKeyManager.getKeyCount(),
    keyUsage: stats
  });
});

app.listen(process.env.PORT, () => {
  console.log(`✅ ComeBackAI Server running on http://localhost:${process.env.PORT}`);
});
