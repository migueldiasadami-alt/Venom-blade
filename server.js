
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Index.html"));
});

// Inteligência artificial
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "Mensagem vazia"
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Você é VENOM BLADE, uma IA inteligente, misteriosa, sarcástica, divertida e natural. Fale português brasileiro. Use humor e gírias quando combinar. Seja útil e não invente informações."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da Groq:", data);

      return res.status(500).json({
        error: "Erro ao consultar a IA."
      });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error("Erro:", error);

    res.status(500).json({
      error: "Erro no servidor."
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("VENOM BLADE ONLINE NA PORTA " + PORT);
});
