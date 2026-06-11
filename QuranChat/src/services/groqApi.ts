const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';
const MAX_TOKENS = 1024;
const TEMPERATURE = 0.7;

const SYSTEM_PROMPT = `You are a knowledgeable and respectful Islamic scholar assistant specializing in the Holy Quran. Your role is to help Muslims and seekers understand the Quran — its Surahs, verses (Ayat), themes, context, and teachings.

Guidelines:
- When referencing specific verses, always cite them as: Surah [Name] ([Number]:[Verse]).
- Give answers that are clear, concise, and grounded in established Islamic scholarship.
- If a question is outside the scope of the Quran or you are uncertain, say so honestly.
- Do not fabricate Quranic verses or hadith. If you quote, be accurate.
- Keep answers focused — 2 to 4 paragraphs for most questions, unless the topic genuinely requires more depth.
- Maintain a tone that is warm, scholarly, and respectful.
- Do not use emojis or decorative symbols in responses.
- Respond in the same language the user writes in.`;

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendMessage(
  apiKey: string,
  conversationHistory: ConversationMessage[],
  userMessage: string
): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversationHistory,
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      switch (response.status) {
        case 401:
          throw new Error('Invalid API key. Please check your Groq API key.');
        case 429:
          throw new Error('Rate limit reached. Please wait a moment and try again.');
        case 400:
          throw new Error('Bad request. Please try rephrasing your question.');
        default:
          throw new Error('Something went wrong. Please try again.');
      }
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.startsWith('Invalid API key') ||
        error.message.startsWith('Rate limit reached') ||
        error.message.startsWith('Bad request') ||
        error.message.startsWith('Something went wrong')
      ) {
        throw error;
      }
    }
    throw new Error('No connection. Please check your internet.');
  }
}
