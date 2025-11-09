import ComeBackAI from "comebackai";

const ai = new ComeBackAI();
const reply = await ai.generate("Tell me a short story about friendship.");
console.log(reply);
