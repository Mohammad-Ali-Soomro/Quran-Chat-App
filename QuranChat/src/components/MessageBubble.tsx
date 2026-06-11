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
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateDot = (val: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const a1 = animateDot(dot1, 0);
    const a2 = animateDot(dot2, 150);
    const a3 = animateDot(dot3, 300);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
}

export default function MessageBubble({ message, isUser, isLoading }: MessageBubbleProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.aiBubble,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: THEME.borders.width,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
    ...THEME.shadows.hard,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: THEME.colors.userBubble,
    maxWidth: SCREEN_WIDTH * 0.75,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: THEME.colors.aiBubble,
    maxWidth: SCREEN_WIDTH * 0.8,
    borderLeftWidth: 6,
    borderLeftColor: THEME.colors.accent,
  },
  messageText: {
    fontSize: THEME.typography.fontSizeBody,
    lineHeight: 22,
    fontWeight: THEME.typography.fontWeightRegular,
  },
  userText: {
    color: THEME.colors.userBubbleText,
  },
  aiText: {
    color: THEME.colors.aiBubbleText,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
    width: 50,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.accent,
  },
});
