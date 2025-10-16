// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // อนุญาตทุก origin (สามารถปรับเป็น domain ของคุณได้)
app.use(express.json());

// Gemini API Config
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Proxy Endpoint
app.post('/api/gemini', async (req, res) => {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send({ error: text });
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error('Error calling Gemini API:', err);
    res.status(500).send({ error: 'Server error calling Gemini API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
