const axios = require('axios');

// Call Groq (Primary - fastest, free unlimited)
async function callGroq(prompt, maxTokens = 2000) {
  try {
    console.log('Calling Groq API...');
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      { 
        model: 'llama-3.3-70b-versatile', 
        messages: [{ role: 'user', content: prompt }], 
        temperature: 0.9, 
        max_tokens: maxTokens,
        top_p: 0.95
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }, timeout: 30000 }
    );
    console.log('Groq API success');
    return { text: res.data.choices[0].message.content, provider: 'Groq' };
  } catch (err) {
    console.error('Groq error:', err.response?.data || err.message);
    throw new Error(`Groq failed: ${err.message}`);
  }
}

// Call Groq (Secondary - alternative model)
async function callGroqAlt(prompt, maxTokens = 2000) {
  try {
    console.log('Calling Groq Alt API...');
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      { 
        model: 'mixtral-8x7b-32768', 
        messages: [{ role: 'user', content: prompt }], 
        temperature: 0.9, 
        max_tokens: maxTokens,
        top_p: 0.95
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }, timeout: 30000 }
    );
    console.log('Groq Alt API success');
    return { text: res.data.choices[0].message.content, provider: 'Groq (Alt)' };
  } catch (err) {
    console.error('Groq Alt error:', err.response?.data || err.message);
    throw new Error(`Groq Alt failed: ${err.message}`);
  }
}

// Call Google Search API (For current affairs, news)
async function callGoogleSearch(query) {
  try {
    const res = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        q: query,
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        num: 5
      },
      timeout: 15000
    });
    return { results: res.data.items || [], provider: 'Google Search' };
  } catch (err) {
    throw new Error(`Google Search failed: ${err.message}`);
  }
}

// Smart AI caller with fallback logic
async function callAI(prompt, maxTokens = 2000, preferredProvider = null) {
  const providers = ['groq', 'groq-alt'];

  const errors = {};
  for (const provider of providers) {
    try {
      if (provider === 'groq' && process.env.GROQ_API_KEY) {
        return await callGroq(prompt, maxTokens);
      } else if (provider === 'groq-alt' && process.env.GROQ_API_KEY) {
        return await callGroqAlt(prompt, maxTokens);
      }
    } catch (err) {
      errors[provider] = err.message;
      console.log(`Provider ${provider} failed: ${err.message}`);
      continue;
    }
  }

  console.error('All AI providers failed:', errors);
  throw new Error('All AI providers failed. Please check your API keys.');
}

// For search/news - use Google Search API
async function searchNews(query) {
  try {
    return await callGoogleSearch(query);
  } catch (err) {
    console.log('Google Search failed, falling back to AI generation');
    const prompt = `Generate 5 realistic news headlines about "${query}" relevant to India and UPSC preparation. Return as JSON array: [{"title": "...", "summary": "...", "source": "..."}]`;
    const result = await callAI(prompt, 1500);
    const jsonMatch = result.text.match(/\[[\s\S]*\]/);
    return { results: jsonMatch ? JSON.parse(jsonMatch[0]) : [], provider: 'AI Generated' };
  }
}

module.exports = {
  callAI,
  callGroq,
  callGroqAlt,
  callGoogleSearch,
  searchNews
};
