export default class ComeBackAI {
  constructor(baseUrl = "https://comebackai.onrender.com/api/generate") {
    this.baseUrl = baseUrl;
  }

  async generate(prompt) {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) throw new Error("Failed to get AI response");

    const data = await res.json();
    return data.output;
  }
}
