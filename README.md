# 🍓 Strawberry AI - API Playground

A modern, comprehensive AI chat interface with automated model discovery and testing capabilities. Built with React, TypeScript, and Vite.

## ✨ Features

### 🤖 **Automated Model Discovery**
- **Comprehensive Testing**: Automatically tests all 151+ available models
- **Dynamic Population**: Only working models appear in the dropdown
- **Real-time Validation**: Sends "hi" messages to verify model functionality
- **Smart Caching**: 5-minute cache to avoid repeated API calls
- **10 Confirmed Working Models**: Including Kimi, Gemini variants, DeepSeek, and SamuraiX

### 🎯 **Core Functionality**
- **Multi-Model Chat**: Switch between different AI models seamlessly
- **Real-time Responses**: Streaming chat responses with thinking animations
- **File Upload**: Support for document analysis and file attachments
- **Image Generation**: Built-in image generation capabilities
- **Chat History**: Firebase-powered chat persistence and history
- **Live Search**: Enhanced search capabilities across models

### 🔐 **Authentication & Storage**
- **Firebase Auth**: Secure user authentication
- **Chat Persistence**: Save and restore chat conversations
- **User Profiles**: Account settings and preferences
- **Credit System**: Built-in credit management (coming soon)

### 📱 **User Experience**
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Theme**: Modern dark UI with purple/pink gradients
- **Smooth Animations**: Thinking animations and loading states
- **Toast Notifications**: Real-time feedback for user actions
- **Keyboard Shortcuts**: Enhanced productivity features

## 🚀 **Working AI Models**

The system automatically discovered and verified these working models:

1. **Kimi K2 Instruct** - `groq/moonshotai/kimi-k2-instruct`
2. **Gemini 2.0 Flash** - `provider3-gemini-2.0-flash`
3. **Gemini 2.0 Flash Lite** - `provider3-gemini-2.0-flash-lite`
4. **Gemini 2.5 Flash Preview (04-17)** - `provider3-gemini-2.5-flash-preview-04-17`
5. **Gemini 2.5 Flash Preview (05-20)** - `provider3-gemini-2.5-flash-preview-05-20`
6. **Gemini 2.5 Pro Preview (05-06)** - `provider3-gemini-2.5-pro-preview-05-06`
7. **Gemini 2.5 Pro Preview (06-05)** - `provider3-gemini-2.5-pro-preview-06-05`
8. **DeepSeek Chat V3 Free** - `provider4-deepseek/deepseek-chat-v3-0324:free`
9. **DeepSeek R1 Free** - `provider4-deepseek/deepseek-r1:free`
10. **SamuraiX 1776** - `SamuraiX-1776` (Reasoning model with thinking steps)

## 🛠️ **Tech Stack**

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Custom gradients
- **State Management**: React hooks, Context API
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **API**: Samurai API (https://samuraiapi.in/v1)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite with TypeScript

## 📦 **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/OGUN01/api_playground.git
   cd api_playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SAMURAI_API_KEY=your_samurai_api_key_here
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 **Configuration**

### API Configuration
The app uses the Samurai API for AI model access. Update the API configuration in `src/lib/modelFetcher.tsx`:

```typescript
const API_CONFIG = {
  url: 'https://samuraiapi.in/v1',
  apiKey: 'your-api-key-here'
};
```

### Model Testing
The system automatically tests models on startup. To modify the testing behavior:

- **Cache Duration**: Adjust `CACHE_DURATION` in `modelFetcher.tsx`
- **Test Message**: Modify `TEST_MESSAGE` constant
- **Working Models**: Update `WORKING_MODELS` array with known working model IDs

## 📁 **Project Structure**

```
src/
├── components/          # React components
│   ├── ModelSelect.tsx  # Model selection modal
│   ├── ChatHistory.tsx  # Chat history sidebar
│   ├── AuthModal.tsx    # Authentication modal
│   └── ...
├── lib/                 # Utility libraries
│   ├── modelFetcher.tsx # Model discovery and testing
│   ├── models.tsx       # Model management
│   ├── firebase.ts      # Firebase configuration
│   └── ...
├── hooks/               # Custom React hooks
└── App.tsx             # Main application component
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Samurai API** for providing access to multiple AI models
- **Firebase** for authentication and database services
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework

## 📞 **Support**

For support, email harsh@example.com or open an issue on GitHub.

---

**Built with ❤️ by Harsh**
