require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json());

// Inicializa a IA Gemini com a chave do .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Rota de status do servidor
app.get('/api/status', (req, res) => {
  res.json({
    status: 'Online',
    mensagem: 'Copiloto IA do Gestor SaaS rodando normalmente!'
  });
});

// Endpoint principal do Chat com a IA Gemini
app.post('/api/chat', async (req, res) => {
  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ resposta: 'Por favor, envie uma mensagem.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `És o assistente executivo e copiloto inteligente do Gestor SaaS. Responde ao utilizador de forma clara, prestativa e profissional.\n\nMensagem do utilizador: "${mensagem}"`;

    const result = await model.generateContent(prompt);
    const resposta = result.response.text();

    res.json({ resposta });
  } catch (error) {
    console.error('Erro ao comunicar com o Gemini:', error);
    res.status(500).json({ resposta: 'Desculpe, ocorreu um erro ao processar sua mensagem com a IA.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[🚀] Backend do Copiloto IA rodando na porta ${PORT}`);
});