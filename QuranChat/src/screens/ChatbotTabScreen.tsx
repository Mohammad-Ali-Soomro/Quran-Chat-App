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
import { THEME } from '../constants/theme';
import { sendMessage } from '../services/groqApi';
import {
  saveChatbotMessages,
  loadChatbotMessages,
  clearChatbotMessages,
  saveChatbotHistory,
  loadChatbotHistory,
  StoredMessage,
  ConversationEntry,
} from '../services/chatbotStorage';
import Header from '../components/Header';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import SuggestionChips from '../components/SuggestionChips';

const GREETING = "As-salamu alaykum. I am your Quranic assistant. Ask me anything about the Quran's teachings, or write about an issue you are facing to get guidance.";

const SUGGESTIONS = [
  'What does the Quran say about patience?',
  'Dua for peace of mind',
  'Explain Surah Al-Ikhlas',
];

export default function ChatbotTabScreen() {
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<StoredMessage>>(null);
  const conversationHistoryRef = useRef<ConversationEntry[]>([]);

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
        'quran'
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
        saveChatbotMessages(final);
        return final;
      });

      conversationHistoryRef.current.push({ role: 'user', content: text });
      conversationHistoryRef.current.push({ role: 'assistant', content: responseText });
      await saveChatbotHistory(conversationHistoryRef.current);
      scrollToBottom();
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== 'loading'));
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [scrollToBottom]);

  useEffect(() => {
    const initChat = async () => {
      const savedMessages = await loadChatbotMessages();
      const savedHistory = await loadChatbotHistory();

      if (savedMessages.length > 0) {
        setMessages(savedMessages);
        conversationHistoryRef.current = savedHistory;
      } else {
        const initialMsg: StoredMessage = {
          id: 'welcome-' + Date.now().toString(),
          text: GREETING,
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        setMessages([initialMsg]);
        await saveChatbotMessages([initialMsg]);
      }
      scrollToBottom();
    };

    initChat();
  }, [scrollToBottom]);

  const handleClear = useCallback(async () => {
    const initialMsg: StoredMessage = {
      id: 'welcome-' + Date.now().toString(),
      text: GREETING,
      isUser: false,
      timestamp: new Date().toISOString(),
    };
    setMessages([initialMsg]);
    conversationHistoryRef.current = [];
    setError(null);
    setIsLoading(false);
    await clearChatbotMessages();
    await saveChatbotMessages([initialMsg]);
  }, []);

  const handleSettings = useCallback(() => {
    Alert.alert('Settings', 'What would you like to do?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear Chatbot History',
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
        title="Quran Chatbot"
        onClear={handleClear}
        onSettings={handleSettings}
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
          suggestions={SUGGESTIONS}
          onSelect={handleSend}
        />
      )}

      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        placeholder="Ask chatbot anything..."
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
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: THEME.colors.cardBorder,
    borderBottomColor: THEME.colors.cardBorder,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: THEME.typography.fontWeightBold,
    textAlign: 'center',
  },
});
