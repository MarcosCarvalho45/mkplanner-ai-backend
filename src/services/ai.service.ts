import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export async function generateAgenda(prompt: string): Promise<any> {
  const data = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Você é um assistente que gera agendas inteligentes.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 500,
  };

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      data,
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error('Erro na API OpenAI: ' + error);
  }
}
