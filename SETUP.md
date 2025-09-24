# 🚀 Task Manager App - Setup Guide

## 📋 Prerequisites

### For React Native Development:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **React Native CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### For Python Backend (Optional):
- **Python** (v3.8 or higher)
- **pip** (Python package manager)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/task-manager-app.git
cd task-manager-app
```

### 2. Install JavaScript Dependencies
```bash
# Using npm
npm install

# OR using yarn
yarn install
```

### 3. Install Python Dependencies (Optional)
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 4. Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Place them in the appropriate directories:
   - Android: `android/app/google-services.json`
   - iOS: `ios/TaskManagerApp/GoogleService-Info.plist`

### 5. Environment Variables
Create a `.env` file in the root directory:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## 🚀 Running the App

### Web Version (Simplified)
```bash
# Open the standalone HTML file
open index.html
# OR
# Double-click index.html in your file explorer
```

### React Native Development
```bash
# Start Metro bundler
npm start
# OR
yarn start

# Run on Android
npm run android
# OR
yarn android

# Run on iOS
npm run ios
# OR
yarn ios
```

### Expo Development
```bash
# Install Expo CLI
npm install -g @expo/cli

# Start Expo development server
npx expo start

# Run on web
npx expo start --web
```

## 📱 Platform-Specific Setup

### Android Setup
1. Install Android Studio
2. Set up Android SDK
3. Create an Android Virtual Device (AVD)
4. Enable Developer Options on your device

### iOS Setup (macOS only)
1. Install Xcode from App Store
2. Install Xcode Command Line Tools
3. Set up iOS Simulator

## 🔧 Development Scripts

```bash
# Start development server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Clean build
npm run clean

# Build for production
npm run build:android
npm run build:ios
```

## 📦 Dependencies

### JavaScript Dependencies
- **React Native** - Mobile app framework
- **React Navigation** - Navigation library
- **Redux Toolkit** - State management
- **Firebase** - Backend services
- **React Native Paper** - UI components

### Python Dependencies (Optional)
- **FastAPI** - Web framework
- **SQLAlchemy** - Database ORM
- **Firebase Admin SDK** - Firebase integration
- **Testing tools** - pytest, coverage

## 🐛 Troubleshooting

### Common Issues:

1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **Android build issues**: Clean gradle with `cd android && ./gradlew clean`
3. **iOS build issues**: Clean Xcode build folder
4. **Firebase issues**: Check configuration files and API keys

### Getting Help:
- Check the [Issues](https://github.com/yourusername/task-manager-app/issues) page
- Review the [Documentation](https://github.com/yourusername/task-manager-app/wiki)
- Contact the maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email support@taskmanagerapp.com or create an issue on GitHub.
