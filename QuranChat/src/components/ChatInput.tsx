import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const insets = useSafeAreaInsets();

  const trimmed = input.trim();
  const sendDisabled = !trimmed || disabled;

  const handleSend = () => {
    if (sendDisabled) return;
    onSend(trimmed);
    setInput('');
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Ask about the Quran..."
        placeholderTextColor="#888888"
        multiline={true}
        maxLength={2000}
        editable={!disabled}
        blurOnSubmit={false}
      />
      <View style={sendDisabled ? styles.sendWrapperDisabled : styles.sendWrapper}>
        <TouchableOpacity
          style={[
            styles.sendButton,
            sendDisabled && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={sendDisabled}
          activeOpacity={0.8}
        >
          <Text style={styles.sendText}>{'\u2192'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAF0',
    borderTopWidth: 2,
    borderTopColor: '#0D0D0D',
    paddingTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0D0D0D',
    borderRadius: 0,
    padding: 12,
    fontSize: 15,
    color: '#0D0D0D',
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendWrapper: {
    shadowColor: '#0D0D0D',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  sendWrapperDisabled: {
    // No shadow when disabled
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: '#0D0D0D',
    borderWidth: 2,
    borderColor: '#0D0D0D',
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#555555',
    borderColor: '#555555',
  },
  sendText: {
    fontSize: 20,
    color: '#FAFAF0',
  },
});
