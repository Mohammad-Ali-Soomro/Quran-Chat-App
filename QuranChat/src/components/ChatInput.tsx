import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled, placeholder = 'Ask about the Quran...' }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const insets = useSafeAreaInsets();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const trimmed = input.trim();
  const sendDisabled = !trimmed || disabled;

  const handleSend = () => {
    if (sendDisabled) return;
    onSend(trimmed);
    setInput('');
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <TextInput
        style={[
          styles.input,
          isFocused ? styles.inputFocused : null,
        ]}
        value={input}
        onChangeText={setInput}
        placeholder={placeholder}
        placeholderTextColor={THEME.colors.placeholder}
        multiline={true}
        maxLength={2000}
        editable={!disabled}
        blurOnSubmit={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <Animated.View
        style={[
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.sendButton,
            sendDisabled && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={sendDisabled}
          activeOpacity={0.8}
        >
          <Text style={styles.sendText}>{'\u2191'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.cardBorder,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F3F4',
    borderWidth: 1,
    borderColor: '#E5E9EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 8,
    fontSize: THEME.typography.fontSizeBody,
    color: THEME.colors.primary,
    maxHeight: 100,
    textAlignVertical: 'center',
  },
  inputFocused: {
    borderColor: THEME.colors.accentBlue,
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E9EB',
  },
  sendText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
