import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME } from '../constants/theme';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

export default function WelcomeScreen({ navigation }: Props) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setError('');

    const trimmed = apiKey.trim();

    if (!trimmed) {
      setError('Please enter your API key.');
      return;
    }

    if (!trimmed.startsWith('sk-ant-')) {
      setError("That doesn't look like a valid Anthropic API key.");
      return;
    }

    setLoading(true);

    try {
      await AsyncStorage.setItem('claude_api_key', trimmed);
      navigation.replace('Chat');
    } catch {
      setError('Failed to save API key. Please try again.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* App Title */}
            <Text style={styles.title}>Quran Chat</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>Ask anything about the Quran.</Text>

            {/* Bismillah */}
            <Text style={styles.bismillah}>{'\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650'}</Text>

            {/* API Key Section */}
            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>ANTHROPIC API KEY</Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={apiKey}
                  onChangeText={(text) => {
                    setApiKey(text);
                    if (error) setError('');
                  }}
                  placeholder="sk-ant-..."
                  placeholderTextColor={THEME.colors.placeholder}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              {/* Error Box */}
              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Helper Text */}
              <Text style={styles.helperText}>
                Your key is stored locally and never sent anywhere except Anthropic.
              </Text>

              {/* Start Button */}
              <View style={styles.buttonShadow}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleStart}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.buttonText}>
                    {loading ? '...' : 'Start Chatting'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: THEME.colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },

  // Subtitle
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#555555',
    textAlign: 'center',
    marginBottom: 24,
  },

  // Bismillah
  bismillah: {
    fontSize: 20,
    color: THEME.colors.accent,
    textAlign: 'center',
    marginBottom: 40,
  },

  // Form
  formSection: {
    width: '100%',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primary,
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  // Input
  inputWrapper: {
    backgroundColor: THEME.colors.inputBackground,
    borderWidth: THEME.borders.width,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
    shadowColor: '#0D0D0D',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  input: {
    fontSize: THEME.typography.fontSizeBody,
    fontWeight: THEME.typography.fontWeightRegular,
    color: THEME.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  // Error
  errorBox: {
    borderWidth: 2,
    borderColor: THEME.colors.error,
    borderRadius: 0,
    backgroundColor: '#FFF5F5',
    padding: 10,
    marginTop: 12,
  },
  errorText: {
    fontSize: 13,
    color: THEME.colors.error,
    fontWeight: '400',
  },

  // Helper
  helperText: {
    fontSize: 11,
    color: '#777777',
    marginTop: 10,
    marginBottom: 28,
  },

  // Button
  buttonShadow: {
    backgroundColor: '#0D0D0D',
    borderRadius: 0,
    // The shadow sits behind the button — we use a wrapper with offset
    // to create the neobrutalist hard shadow effect
    shadowColor: '#0D0D0D',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  button: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 16,
    borderWidth: THEME.borders.width,
    borderColor: THEME.borders.color,
    borderRadius: THEME.borders.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.headerText,
  },
});
