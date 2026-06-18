import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.get("/", (req, res) => {
    res.send("Voxera Backend Online");
});

app.post("/chat", async (req, res) => {
    const message = req.body.message;

    if (!message) {
        return res.json({
            reply: "No message received."
        });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: message
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log(data);

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response";

        res.json({ reply });

    } catch (error) {
        console.error(error);

        res.json({
            reply: "Backend Error: " + error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});