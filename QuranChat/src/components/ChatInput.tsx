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
      toValue: 0.95,
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
          sendDisabled ? styles.sendWrapperDisabled : styles.sendWrapper,
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
          activeOpacity={0.9}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.background,
    borderTopWidth: THEME.borders.width,
    borderTopColor: THEME.borders.color,
    paddingTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderWidth: THEME.borders.width,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
    padding: 12,
    fontSize: THEME.typography.fontSizeBody,
    color: THEME.colors.primary,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderColor: THEME.colors.accent,
  },
  sendWrapper: {
    ...THEME.shadows.hard,
  },
  sendWrapperDisabled: {
    // No shadow when disabled
  },
  sendButton: {
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: THEME.colors.accent,
    borderWidth: THEME.borders.width,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#999999',
    borderColor: THEME.borders.color,
  },
  sendText: {
    fontSize: 14,
    fontWeight: THEME.typography.fontWeightBold,
    color: '#FFFFFF',
  },
});
