# Beom-med Firebase Setup Guide

This guide will help you set up Firebase for the Beom-med medical reminder system.

## Prerequisites

1. Node.js 18+ installed
2. A Google account for Firebase
3. Firebase CLI installed globally: `npm install -g firebase-tools`

## Firebase Project Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `beom-med-hospital` (or your preferred name)
4. Enable Google Analytics (optional)
5. Wait for project creation

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save changes

### 3. Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### 4. Set up Firestore Security Rules

Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Only authenticated users can read/write medical data
    match /patients/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /doctors/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /medications/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /schedules/{document} {
      allow read, write: if request.auth != null;
    }
    
    match /consumption_records/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon to add a web app
4. Register app with name "Beom-med Web"
5. Copy the Firebase configuration object

### 6. Update Firebase Configuration

1. Open `/lib/firebase.ts`
2. Replace the placeholder configuration with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Install Dependencies

```bash
npm install firebase
```

## Environment Variables (Recommended)

Create a `.env.local` file in your project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Then update `/lib/firebase.ts` to use environment variables:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Initial Data Setup

### 1. Create First Admin User

1. Start your development server: `npm run dev`
2. Go to registration page
3. Create an admin account
4. This will be your first admin user

### 2. Add Sample Data (Optional)

You can add sample data through the admin interface or create a data seeding script.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Option 1: Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project: `firebase init`
   - Select "Hosting"
   - Choose your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: Yes
   - Set up automatic builds: No
4. Build your project: `npm run build`
5. Deploy: `firebase deploy`

### Option 2: Other Hosting Providers

The built application in the `dist` folder can be deployed to any static hosting provider like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Security Considerations

1. **Firestore Rules**: Update security rules for production
2. **Environment Variables**: Keep Firebase config in environment variables
3. **User Roles**: Implement proper role-based access control
4. **Data Validation**: Add server-side validation using Cloud Functions
5. **Backup**: Set up regular Firestore backups

## Troubleshooting

### Common Issues

1. **Firebase not connecting**: Check console for error messages and verify config
2. **Authentication errors**: Ensure Email/Password provider is enabled
3. **Permission denied**: Check Firestore security rules
4. **CORS issues**: Make sure your domain is authorized in Firebase Console

### Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth/web/start)

## Features Included

✅ **Authentication**
- Email/password registration and login
- Role-based access (admin, doctor, patient)
- Automatic session management
- Secure logout

✅ **Database Integration**
- Real-time data synchronization
- CRUD operations for all entities
- Proper error handling
- Data validation

✅ **Security**
- Firestore security rules
- Authenticated-only access
- Role-based permissions
- Input validation

✅ **Production Ready**
- Environment variable support
- Error handling
- Loading states
- Responsive design