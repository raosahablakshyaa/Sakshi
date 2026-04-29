const axios = require('axios');

async function callGroq(prompt, maxTokens = 2000) {
  const res = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      max_tokens: maxTokens,
    },
    { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }, timeout: 30000 }
  );
  return { text: res.data.choices[0].message.content, provider: 'Groq' };
}

async function callGemini(prompt, maxTokens = 2000) {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: maxTokens } },
    { timeout: 30000 }
  );
  return { text: res.data.candidates[0].content.parts[0].text, provider: 'Gemini' };
}

async function callAI(prompt, maxTokens = 2000) {
  const errors = {};

  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
    try { return await callGroq(prompt, maxTokens); } catch (err) { errors.groq = err.message; }
  }

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    try { return await callGemini(prompt, maxTokens); } catch (err) { errors.gemini = err.message; }
  }

  console.error('All AI providers failed:', errors);
  throw new Error('All AI providers failed. Please add GROQ_API_KEY or GEMINI_API_KEY in backend/.env');
}

module.exports = { callAI, callGroq, callGemini };
