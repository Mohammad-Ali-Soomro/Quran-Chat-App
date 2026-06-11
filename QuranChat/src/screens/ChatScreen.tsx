import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME } from '../constants/theme';
import { sendMessage } from '../services/claudeApi';
import Header from '../components/Header';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

interface Props {
  navigation: ChatScreenNavigationProp;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ConversationEntry {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_GREETING =
  "As-salamu alaykum. I'm here to help you explore the Quran. Ask me anything — about a Surah, a verse, a theme, or a concept.";

const createInitialMessage = (): Message => ({
  id: 'welcome-' + Date.now().toString(),
  text: INITIAL_GREETING,
  isUser: false,
  timestamp: new Date(),
});

export default function ChatScreen({ navigation }: Props) {
  const [messages, setMessages] = useState<Message[]>([createInitialMessage()]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<Message>>(null);
  const apiKeyRef = useRef<string>('');
  const conversationHistoryRef = useRef<ConversationEntry[]>([]);

  // Load API key on mount
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const key = await AsyncStorage.getItem('claude_api_key');
        if (key) {
          apiKeyRef.current = key;
        }
      } catch {
        // Key not found — will fail gracefully on first send
      }
    };
    loadApiKey();
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleClear = useCallback(() => {
    setMessages([createInitialMessage()]);
    conversationHistoryRef.current = [];
    setError(null);
    setIsLoading(false);
  }, []);

  const handleSettings = useCallback(() => {
    Alert.alert('Settings', 'What would you like to do?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear Chat',
        onPress: handleClear,
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('claude_api_key');
          } catch {
            // Ignore removal errors
          }
          navigation.replace('Welcome');
        },
      },
    ]);
  }, [handleClear, navigation]);

  const handleSend = useCallback(
    async (text: string) => {
      setError(null);

      // Add user message to UI
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

      // Build conversation history for API
      conversationHistoryRef.current.push({ role: 'user', content: text });

      try {
        const responseText = await sendMessage(
          apiKeyRef.current,
          conversationHistoryRef.current.slice(0, -1),
          text
        );

        // Append assistant response to conversation history
        conversationHistoryRef.current.push({
          role: 'assistant',
          content: responseText,
        });

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) =>
          prev.filter((m) => m.id !== 'loading').concat(aiResponse)
        );
        scrollToBottom();
      } catch (err) {
        // Remove the user message from conversation history on error
        conversationHistoryRef.current.pop();

        setMessages((prev) => prev.filter((m) => m.id !== 'loading'));
        setError(
          err instanceof Error ? err.message : 'Something went wrong. Please try again.'
        );
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <Header
        title="Quran Chat"
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

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </KeyboardAvoidingView>
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
