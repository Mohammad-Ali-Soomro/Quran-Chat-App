const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';
const MAX_TOKENS = 1024;
const TEMPERATURE = 0.7;
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';

const QURAN_SYSTEM_PROMPT = `You are a knowledgeable and respectful Islamic scholar assistant specializing in the Holy Quran. Your role is to help Muslims and seekers understand the Quran — its Surahs, verses (Ayat), themes, context, and teachings.

Guidelines:
- When referencing specific verses, always cite them as: Surah [Name] ([Number]:[Verse]).
- Give answers that are clear, concise, and grounded in established Islamic scholarship.
- If a question is outside the scope of the Quran or you are uncertain, say so honestly.
- Do not fabricate Quranic verses or hadith. If you quote, be accurate.
- Keep answers focused — 2 to 4 paragraphs for most questions, unless the topic genuinely requires more depth.
- Maintain a tone that is warm, scholarly, and respectful.
- Do not use emojis or decorative symbols in responses.
- Respond in the same language the user writes in.`;

const DUA_SYSTEM_PROMPT = `You are a compassionate Islamic prayer assistant. When the user describes a situation, emotion, or need, respond with:
1. A relevant Dua from the Quran or authentic Hadith (in Arabic)
2. The transliteration of the Dua in Latin letters
3. The English translation of the Dua
4. A brief explanation of when and how to recite it
5. Words of comfort grounded in Islamic teachings

Be warm, gentle, and supportive. Always cite the source (Quran reference or Hadith collection). Do not fabricate Duas. Do not use emojis or decorative symbols.`;

const SURAH_SYSTEM_PROMPT = `You are an expert Quran scholar. When the user asks about a specific Surah, provide:
1. The name, number, and meaning of the Surah name
2. Whether it is Makki or Madani and the number of verses
3. The main themes and key messages
4. Notable verses with their meanings
5. The historical context of revelation (Asbab al-Nuzul) if known
6. Lessons and relevance for daily life

Be thorough but organized. Use clear headings. Do not use emojis.`;

const HISTORY_SYSTEM_PROMPT = `You are a knowledgeable Islamic historian specializing in stories from the Quran. When the user asks about Islamic history, Prophets, or events mentioned in the Quran, provide:
1. The Quranic account with verse references
2. Historical context and details
3. Key lessons and morals from the story
4. Relevance to modern life

Be engaging and scholarly. Cite Quranic references. Do not use emojis.`;

const REFLECTION_SYSTEM_PROMPT = `You are a thoughtful Islamic spiritual guide. Provide a brief daily spiritual reflection based on a Quranic theme. Include:
1. A relevant Quranic verse (in Arabic with translation)
2. A short reflection (2-3 paragraphs) on its meaning and application
3. A practical action item for the day
4. A short closing Dua

Be warm, inspiring, and concise. Do not use emojis.`;

export type ChatMode = 'quran' | 'dua' | 'surah' | 'history' | 'reflection';

const SYSTEM_PROMPTS: Record<ChatMode, string> = {
  quran: QURAN_SYSTEM_PROMPT,
  dua: DUA_SYSTEM_PROMPT,
  surah: SURAH_SYSTEM_PROMPT,
  history: HISTORY_SYSTEM_PROMPT,
  reflection: REFLECTION_SYSTEM_PROMPT,
};

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendMessage(
  conversationHistory: ConversationMessage[],
  userMessage: string,
  mode: ChatMode = 'quran'
): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS[mode] },
          ...conversationHistory,
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      switch (response.status) {
        case 401:
          throw new Error('API authentication failed. Please contact support.');
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
        error.message.startsWith('API authentication') ||
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
