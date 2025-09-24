# Task Manager App

A cross-platform mobile task management application built with React Native, Firebase, and Redux. Features offline support, real-time synchronization, and a modern UI.

## Features

- ✅ **Cross-platform**: Works on both iOS and Android
- 🔐 **Authentication**: Email/password and Google Sign-In
- 📱 **Offline Support**: Works without internet connection
- 🔄 **Real-time Sync**: Automatically syncs when online
- 🎨 **Modern UI**: Beautiful Material Design interface
- 📊 **Task Management**: Create, edit, delete, and organize tasks
- 🏷️ **Priority Levels**: High, Medium, Low priority tasks
- 📅 **Due Dates**: Set and track task deadlines
- 🔍 **Search & Filter**: Find tasks quickly
- 📈 **Sorting**: Sort by date, priority, or status

## Tech Stack

- **React Native** - Cross-platform mobile development
- **Firebase** - Backend services (Auth, Firestore)
- **Redux Toolkit** - State management
- **Redux Persist** - Data persistence
- **React Native Paper** - UI components
- **SQLite** - Local database for offline support
- **React Navigation** - Navigation
- **TypeScript** - Type safety

## Prerequisites

Before running the app, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **React Native CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Firebase project setup**
- **Python** (v3.8 or higher, optional for backend)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager-app
   ```

2. **Install JavaScript dependencies**
   ```bash
   npm install
   # OR
   yarn install
   ```

3. **Install Python dependencies (Optional)**
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

3. **iOS Setup**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Firebase Configuration**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Place them in the appropriate directories
   - Update `src/config/firebase.ts` with your Firebase config

5. **Run the app**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   
   # For Web (Simplified version)
   open index.html
   # OR double-click index.html in your file explorer
   ```

## Quick Start (Web Version)

For a quick demo, you can run the standalone web version:

1. **Open the web version**
   ```bash
   # Simply open the HTML file
   open index.html
   # OR
   # Double-click index.html in your file explorer
   ```

2. **Features available in web version:**
   - ✅ Create, edit, and delete tasks
   - 🏷️ Set task priorities (High, Medium, Low)
   - 📅 Set due dates
   - 🔍 Search and filter tasks
   - 📱 Responsive design
   - 💾 Local storage (data persists in browser)

## Project Structure

```
task-manager-app/
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── screens/            # Screen components
│   │   ├── auth/          # Authentication screens
│   │   └── main/          # Main app screens
│   ├── navigation/         # Navigation configuration
│   ├── store/             # Redux store and slices
│   ├── utils/             # Utility functions and helpers
│   ├── types/             # TypeScript type definitions
│   └── config/            # Configuration files
├── android/               # Android-specific code
├── ios/                   # iOS-specific code
├── package.json           # JavaScript dependencies
├── package-lock.json      # JavaScript dependency lock file
├── requirements.txt       # Python dependencies (optional)
├── .gitignore            # Git ignore rules
├── SETUP.md              # Detailed setup guide
├── index.html            # Standalone web version
└── README.md             # This file
```

## Dependency Files

### JavaScript Dependencies (Primary)
- **`package.json`** - Main JavaScript dependencies and scripts
- **`package-lock.json`** - Locked dependency versions
- **`yarn.lock`** - Yarn dependency lock file (if using Yarn)

### Python Dependencies (Optional - Backend Only)
- **`requirements.txt`** - Python packages for backend development (OPTIONAL)
- **`venv/`** - Python virtual environment (not tracked in git)

### Deployment Configuration
- **`netlify.toml`** - Netlify deployment configuration
- **`.gitignore`** - Git ignore rules

### Configuration Files
- **`.gitignore`** - Files to exclude from version control
- **`SETUP.md`** - Detailed setup and installation guide
- **`tsconfig.json`** - TypeScript configuration
- **`babel.config.js`** - Babel transpilation config
- **`metro.config.js`** - Metro bundler configuration

## Key Features Implementation

### Offline Support
- Uses SQLite for local data storage
- Automatically syncs with Firebase when online
- Shows sync status indicators
- Handles network state changes

### State Management
- Redux Toolkit for predictable state updates
- Redux Persist for data persistence
- Separate slices for auth, tasks, network, and sync

### Authentication
- Email/password authentication
- Google Sign-In integration
- Secure token storage
- Automatic session management

### Task Management
- CRUD operations for tasks
- Priority levels and due dates
- Search and filtering
- Sorting options
- Offline-first approach

## Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Email/Password and Google)
3. Enable Firestore Database
4. Configure security rules
5. Add your app to the project

### Environment Variables
Create a `.env` file in the root directory:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
```

## Building for Production

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
```bash
cd ios
xcodebuild -workspace TaskManagerApp.xcworkspace -scheme TaskManagerApp -configuration Release archive
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.
