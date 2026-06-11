import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGES_KEY = 'chatbot_tab_messages';
const HISTORY_KEY = 'chatbot_tab_history';

export interface StoredMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface ConversationEntry {
  role: 'user' | 'assistant';
  content: string;
}

export async function saveChatbotMessages(messages: StoredMessage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch {
    // Silently fail
  }
}

export async function loadChatbotMessages(): Promise<StoredMessage[]> {
  try {
    const data = await AsyncStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function clearChatbotMessages(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([MESSAGES_KEY, HISTORY_KEY]);
  } catch {
    // Silently fail
  }
}

export async function saveChatbotHistory(history: ConversationEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Silently fail
  }
}

export async function loadChatbotHistory(): Promise<ConversationEntry[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
