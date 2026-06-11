import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGES_KEY = 'chat_messages';
const HISTORY_KEY = 'conversation_history';

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

export async function saveMessages(messages: StoredMessage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch {
    // Silently fail - non-critical
  }
}

export async function loadMessages(): Promise<StoredMessage[]> {
  try {
    const data = await AsyncStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function clearMessages(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([MESSAGES_KEY, HISTORY_KEY]);
  } catch {
    // Silently fail
  }
}

export async function saveConversationHistory(history: ConversationEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Silently fail
  }
}

export async function loadConversationHistory(): Promise<ConversationEntry[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
