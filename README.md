# Qur'an Chat App

A modern, high-contrast React Native mobile application powered by Expo and TypeScript. The application acts as an AI conversational assistant, allowing users to ask questions and learn about the Holy Qur'an with authentic citations and context. 

This project was built from scratch to showcase robust React Native practices, custom Neobrutalism UI implementation, and real-time LLM API integration.

---

## Key Features

*   **Groq API Integration:** Connected directly to Groq's high-speed completion service using the `llama-3.3-70b-versatile` model.
*   **Contextual Islamic Scholar Persona:** Configured with a system prompt that ensures respectful, authentic, and structured responses containing Surah and Ayah references.
*   **Neobrutalism UI Design:** Custom visual identity featuring bold 2px borders, warm off-white tones, deep green accents, flat shadow offsets, and strict typography.
*   **Secure Token Storage:** Secure runtime entry of Groq API keys with validation. Keys are saved locally on-device using `AsyncStorage` and are never committed or stored remotely.
*   **Polished Navigation & Flow:** Multi-screen navigation (Welcome and Chat) managed by `@react-navigation/stack`, incorporating safe area insets and state persistence.

---

## Technology Stack

*   **Framework:** Expo SDK 54 (React Native)
*   **Language:** TypeScript (Strict Type Checking)
*   **Navigation:** React Navigation v7 (Stack)
*   **Storage:** AsyncStorage for local state and key persistence
*   **Styling:** StyleSheet (Vanilla CSS principles optimized for native platforms)

---

## Project Structure

```text
QuranChat/
├── src/
│   ├── components/
│   │   ├── ChatInput.tsx      # Neobrutalism text input and send button
│   │   ├── Header.tsx         # Header with Clear and sign-out controls
│   │   ├── MessageBubble.tsx  # User and AI chat bubble components
│   │   └── index.ts
│   ├── constants/
│   │   └── theme.ts           # Strict Neobrutalism layout and color tokens
│   ├── navigation/
│   │   └── AppNavigator.tsx   # Stack navigator configuration
│   ├── screens/
│   │   ├── WelcomeScreen.tsx  # API key registration screen
│   │   └── ChatScreen.tsx     # Message loop and history screen
│   └── services/
│       └── groqApi.ts         # Groq API endpoint call and parsing logic
├── App.tsx                    # Application entry point
├── app.json                   # Expo configuration metadata
└── package.json               # Dependencies and scripts
```

---

## Live Demos & Installation

### Android (Standalone APK)
You can download and install the build artifact directly onto any Android device:
*   [Download Android APK](https://expo.dev/accounts/ali.storied/projects/QuranChat/builds/4fd6ee8f-2667-4db0-b994-2ebdf956e181)

### iOS & Android (via Expo Go)
The project is hosted publicly on the Expo Cloud:
1.  Download the **Expo Go** app from the iOS App Store or Google Play Store.
2.  Open the project link: [https://expo.dev/accounts/ali.storied/projects/QuranChat](https://expo.dev/accounts/ali.storied/projects/QuranChat)
3.  Scan the QR code displayed on the page to launch the app instantly.

*Note: You will need a Groq API key (starts with `gsk_`) to use the chat functionality.*

---

## Running the Project Locally

### Prerequisites
Ensure you have Node.js and npm installed on your system.

### 1. Install Dependencies
Navigate to the project subdirectory and install the packages:
```bash
cd QuranChat
npm install
```

### 2. Run the Development Server
Start the local Metro Bundler:
```bash
npm start
```
*   Press **a** to run on an Android emulator.
*   Press **i** to run on an iOS simulator (macOS required).
*   Run `npx expo start --tunnel` if you are testing on a physical device over a firewalled local Wi-Fi connection.
