import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { THEME } from '../constants/theme';
import Header from '../components/Header';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  text: "As-salamu alaykum. I'm here to help you explore the Quran. Ask me anything — about a Surah, a verse, a theme, or a concept.",
  isUser: false,
  timestamp: new Date(),
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<Message>>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleClear = useCallback(() => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: 'welcome-' + Date.now().toString(),
        timestamp: new Date(),
      },
    ]);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      setError(null);

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        isUser: true,
        timestamp: new Date(),
      };

      // Add loading bubble
      const loadingMessage: Message = {
        id: 'loading',
        text: '',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage, loadingMessage]);
      setIsLoading(true);
      scrollToBottom();

      try {
        // TODO: call claudeApi.sendMessage
        // For now, simulate a placeholder response
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'This is a placeholder response. The Claude API integration will be wired in the next step.',
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) =>
          prev.filter((m) => m.id !== 'loading').concat(aiResponse)
        );
        scrollToBottom();
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== 'loading'));
        setError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [scrollToBottom]
  );

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble
        message={item.text}
        isUser={item.isUser}
        isLoading={item.id === 'loading'}
      />
    ),
    []
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  return (
    <View style={styles.container}>
      <Header title="Quran Chat" onClear={handleClear} />

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

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF0',
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  errorBar: {
    backgroundColor: '#FFF5F5',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopColor: '#D62828',
    borderBottomColor: '#D62828',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#D62828',
    fontWeight: '400',
  },
});
