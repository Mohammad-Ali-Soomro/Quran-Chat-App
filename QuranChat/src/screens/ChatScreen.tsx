import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME } from '../constants/theme';
import { sendMessage, ChatMode } from '../services/groqApi';
import {
  saveMessages,
  loadMessages,
  clearMessages,
  saveConversationHistory,
  loadConversationHistory,
  StoredMessage,
  ConversationEntry,
} from '../services/chatStorage';
import Header from '../components/Header';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import SuggestionChips from '../components/SuggestionChips';

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface Props {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
}

const GREETINGS: Record<ChatMode, string> = {
  quran: "As-salamu alaykum. I'm here to help you explore the Quran. Ask me anything about a Surah, a verse, a theme, or a concept.",
  dua: "As-salamu alaykum. Tell me what you're going through, and I'll find a relevant Dua for you from the Quran and Hadith.",
  surah: "As-salamu alaykum. Which Surah would you like to explore? I'll explain its themes, context, and key verses.",
  history: "As-salamu alaykum. I'm here to share the stories and history mentioned in the Quran. What would you like to know?",
  reflection: "As-salamu alaykum. Let me share a spiritual reflection to inspire your day.",
};

const MODE_TITLES: Record<ChatMode, string> = {
  quran: 'Quran Q&A',
  dua: 'Dua Generator',
  surah: 'Surah Explorer',
  history: 'Islamic History',
  reflection: 'Daily Reflection',
};

const MODE_PLACEHOLDERS: Record<ChatMode, string> = {
  quran: 'Ask about the Quran...',
  dua: 'Describe your situation or feeling...',
  surah: 'Enter Surah name or number...',
  history: 'Ask about prophets, events...',
  reflection: 'Ask for reflection...',
};

const MODE_CHIPS: Record<ChatMode, string[]> = {
  quran: [
    'What is patience in Quran?',
    'Explain Ayat al-Kursi',
    'What are the five pillars of Islam?',
  ],
  dua: [
    'Dua for anxiety and stress',
    'Dua for health and healing',
    'Dua for forgiveness',
  ],
  surah: [
    'Explain Surah Al-Fatiha',
    'Themes of Surah Yaseen',
    'Context of Surah Al-Kahf',
  ],
  history: [
    'Story of Prophet Yusuf',
    'Story of Prophet Musa',
    'Story of Prophet Ibrahim',
  ],
  reflection: [
    'Give me a reflection',
    'Reflection on gratitude',
    'Reflection on trust in Allah',
  ],
};

export default function ChatScreen({ navigation, route }: Props) {
  const mode = route.params?.mode || 'quran';
  const initialPrompt = route.params?.initialPrompt;

  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<StoredMessage>>(null);
  const conversationHistoryRef = useRef<ConversationEntry[]>([]);
  const initialPromptSentRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleSend = useCallback(async (text: string) => {
    setError(null);

    const userMessage: StoredMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    const loadingMessage: StoredMessage = {
      id: 'loading',
      text: '',
      isUser: false,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev.filter((m) => m.id !== 'loading'), userMessage, loadingMessage]);
    setIsLoading(true);
    scrollToBottom();

    const historyToSend = [...conversationHistoryRef.current];

    try {
      const responseText = await sendMessage(
        historyToSend,
        text,
        mode
      );

      const aiResponse: StoredMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== 'loading' && m.id !== userMessage.id);
        const final = [...filtered, userMessage, aiResponse];
        saveMessages(final);
        return final;
      });

      conversationHistoryRef.current.push({ role: 'user', content: text });
      conversationHistoryRef.current.push({ role: 'assistant', content: responseText });
      await saveConversationHistory(conversationHistoryRef.current);
      scrollToBottom();
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== 'loading'));
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [mode, scrollToBottom]);

  // Handle initialization and parameters
  useEffect(() => {
    const initChat = async () => {
      if (initialPrompt && !initialPromptSentRef.current) {
        // Fresh session for initial prompt
        initialPromptSentRef.current = true;
        const initialMsg: StoredMessage = {
          id: 'welcome-' + Date.now().toString(),
          text: GREETINGS[mode],
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        setMessages([initialMsg]);
        conversationHistoryRef.current = [];
        await saveMessages([initialMsg]);
        await saveConversationHistory([]);

        // Stagger to let layout settle
        setTimeout(() => {
          handleSend(initialPrompt);
        }, 500);
      } else {
        // Load history if no initial prompt
        const savedMessages = await loadMessages();
        const savedHistory = await loadConversationHistory();

        if (savedMessages.length > 0) {
          setMessages(savedMessages);
          conversationHistoryRef.current = savedHistory;
        } else {
          const initialMsg: StoredMessage = {
            id: 'welcome-' + Date.now().toString(),
            text: GREETINGS[mode],
            isUser: false,
            timestamp: new Date().toISOString(),
          };
          setMessages([initialMsg]);
          await saveMessages([initialMsg]);
        }
      }
      scrollToBottom();
    };

    initChat();
  }, [mode, initialPrompt, handleSend, scrollToBottom]);

  const handleClear = useCallback(async () => {
    const initialMsg: StoredMessage = {
      id: 'welcome-' + Date.now().toString(),
      text: GREETINGS[mode],
      isUser: false,
      timestamp: new Date().toISOString(),
    };
    setMessages([initialMsg]);
    conversationHistoryRef.current = [];
    setError(null);
    setIsLoading(false);
    await clearMessages();
    await saveMessages([initialMsg]);
  }, [mode]);

  const handleSettings = useCallback(() => {
    Alert.alert('Settings', 'What would you like to do?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear Chat',
        onPress: handleClear,
      },
    ]);
  }, [handleClear]);

  const renderMessage = useCallback(
    ({ item }: { item: StoredMessage }) => (
      <MessageBubble
        message={item.text}
        isUser={item.isUser}
        isLoading={item.id === 'loading'}
      />
    ),
    []
  );

  const keyExtractor = useCallback((item: StoredMessage) => item.id, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <Header
        title={MODE_TITLES[mode]}
        onClear={handleClear}
        onSettings={handleSettings}
        showBack={true}
        onBack={() => navigation.navigate('Home')}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        style={styles.flex}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={scrollToBottom}
        keyboardShouldPersistTaps="handled"
      />

      {error && (
        <TouchableOpacity
          style={styles.errorBar}
          onPress={() => setError(null)}
          activeOpacity={0.8}
        >
          <Text style={styles.errorText}>{error}</Text>
        </TouchableOpacity>
      )}

      {messages.length <= 1 && !isLoading && (
        <SuggestionChips
          suggestions={MODE_CHIPS[mode]}
          onSelect={handleSend}
        />
      )}

      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        placeholder={MODE_PLACEHOLDERS[mode]}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  errorBar: {
    backgroundColor: THEME.colors.accentCoral,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopColor: THEME.colors.primary,
    borderBottomColor: THEME.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: THEME.typography.fontWeightBold,
  },
});
