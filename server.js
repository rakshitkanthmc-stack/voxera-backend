import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "YOUR_GEMINI_API_KEY";

app.post("/chat", async (req, res) => {
    const message = req.body.message;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: message }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response";

        res.json({ reply });

    } catch (err) {
        res.json({ reply: "Error: " + err.message });
    }
});

app.listen(3000, () => {
    console.log("Server running");
});