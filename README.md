# Noteally - AI-Powered Photo Notes

A minimalist, photo-based notepad that uses AI to extract text from book photos.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file with your Firebase and AI API keys:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

3. **Firebase Setup**
   
   **IMPORTANT**: To fix the "ADMIN_ONLY_OPERATION" error, you need to:
   
   a. **Enable Anonymous Authentication**:
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable "Anonymous" authentication
   
   b. **Deploy Firestore Security Rules**:
   ```bash
   # Install Firebase CLI if you haven't
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase in your project (if not done)
   firebase init firestore
   
   # Deploy the security rules
   firebase deploy --only firestore:rules
   ```
   
   c. **Verify Security Rules**:
   The `firestore.rules` file in this project contains the correct rules that allow authenticated users (including anonymous) to access their own data.

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔧 Troubleshooting

### "ADMIN_ONLY_OPERATION" Error
This error typically occurs when:
- Anonymous authentication is not enabled in Firebase Console
- Firestore security rules are too restrictive
- Firebase configuration is incorrect

**Solution**:
1. Enable Anonymous Auth in Firebase Console
2. Deploy the included `firestore.rules` file
3. Check that your environment variables are correct

### Camera Not Working
If the camera preview doesn't show:
- Check browser permissions for camera access
- Ensure you're on HTTPS (required for camera API)
- Check browser console for detailed error messages

### Notes Not Saving
If notes aren't saving properly:
- Check the browser console for authentication errors
- Verify Firebase configuration
- Ensure Firestore security rules are deployed

## 🏗️ Architecture

- **Frontend**: Next.js 14+ with App Router
- **UI**: Shadcn UI components with Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Anonymous)
- **AI/OCR**: Google Gemini API via Genkit

## 📁 Project Structure

```
noteally/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── services/        # API and Firebase services
│   └── types/           # TypeScript type definitions
├── firestore.rules      # Firestore security rules
├── firebase.json        # Firebase configuration
└── firestore.indexes.json # Firestore indexes
```

## 🔐 Security

This application uses Firebase Anonymous Authentication for quick setup while maintaining data isolation between users. Each user can only access their own notes through Firestore security rules.

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (recommended)
   ```bash
   npx vercel --prod
   ```

3. **Deploy Firebase rules** (if changed)
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```

## 📝 Features

- 📷 **Camera Capture**: Real-time photo capture with webcam
- 🔍 **OCR Text Extraction**: AI-powered text extraction from images
- ✏️ **Rich Text Editor**: Full-featured editor with formatting options
- 🏗️ **Dock Interface**: Clean, Apple-style dock for tools and navigation
- 💾 **Auto-Save**: Automatic note saving with real-time sync
- 🔍 **Search**: Fast search across all notes
- 🏷️ **Organization**: Tags and categories for note organization
- 📱 **Responsive**: Works on desktop, tablet, and mobile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
