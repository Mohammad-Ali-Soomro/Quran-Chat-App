import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { THEME } from '../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  isLoading?: boolean;
}

function LoadingDots() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.Text style={[styles.messageText, styles.aiText, { opacity }]}>
      ...
    </Animated.Text>
  );
}

export default function MessageBubble({ message, isUser, isLoading }: MessageBubbleProps) {
  return (
    <View
      style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.aiBubble,
      ]}
    >
      {isLoading ? (
        <LoadingDots />
      ) : (
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userText : styles.aiText,
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#0D0D0D',
    borderRadius: 0,
    shadowColor: '#0D0D0D',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0D0D0D',
    maxWidth: SCREEN_WIDTH * 0.75,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  userText: {
    color: '#FAFAF0',
  },
  aiText: {
    color: '#0D0D0D',
  },
});
