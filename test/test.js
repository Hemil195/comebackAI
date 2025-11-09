import ComeBackAI from "../ComeBackAI-SDK/index.js";

// Use your local server instead of the deployed one
const ai = new ComeBackAI("http://localhost:3000/api/generate");
const reply = await ai.generate("Tell me a short story about friendship.");
console.log(reply);
