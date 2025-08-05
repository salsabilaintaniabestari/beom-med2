# Beom-med Complete Firebase Setup Guide

## 🚀 Quick Start

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project details:
   - Project name: `beom-med-hospital`
   - Enable Google Analytics (recommended)
   - Choose Analytics account or create new one
4. Wait 2-3 minutes for project creation

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. **Optional**: Enable other providers (Google, Facebook, etc.)

### 3. Set Up Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development (you'll configure security rules later)
4. Select a location (choose closest to your users)
5. Click "Done"

### 4. Set Up Environment Variables
1. In Firebase Console, go to "Project Settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Enter app nickname: `beom-med-web`
5. **Don't** enable Firebase Hosting for now
6. Copy the configuration values
7. Create `.env.local` file in your project root:

```bash
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 5. Install Dependencies
```bash
npm install firebase
```

### 6. Configure Firestore Security Rules
1. In Firebase Console, go to "Firestore Database" → "Rules"
2. Replace the default rules with the comprehensive rules below
3. Click "Publish"

### 7. Run the Application
```bash
npm run dev
```

## 📊 Firestore Database Collections Structure

The application uses the following Firestore collections:

### Core Collections

#### `users` Collection
```javascript
{
  id: "user-auth-uid",
  email: "user@example.com",
  name: "User Name",
  role: "admin" | "doctor" | "patient",
  specialization: "Kardiologi", // for doctors
  licenseNumber: "STR123456", // for doctors
  phone: "+62812345678",
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `patients` Collection
```javascript
{
  id: "auto-generated-id",
  name: "Patient Name",
  age: 45,
  gender: "Laki-laki" | "Perempuan",
  email: "patient@example.com",
  phone: "+62812345678",
  address: "Patient Address",
  medicalConditions: ["Diabetes", "Hipertensi"],
  doctorId: "doctor-user-id",
  doctorName: "Dr. Name",
  registrationDate: "2024-01-15",
  emergencyContactName: "Emergency Contact",
  emergencyContactPhone: "+62812345679",
  emergencyContactRelationship: "Keluarga",
  allergies: ["Penicillin", "Aspirin"],
  bloodType: "O+",
  weight: 70.5,
  height: 170.0,
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `doctors` Collection
```javascript
{
  id: "auto-generated-id",
  userId: "user-auth-uid",
  name: "Dr. Doctor Name",
  email: "doctor@example.com",
  specialization: "Kardiologi",
  licenseNumber: "STR123456",
  phone: "+62812345678",
  patientIds: ["patient-id-1", "patient-id-2"],
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `medications` Collection
```javascript
{
  id: "auto-generated-id",
  name: "Amoxicillin",
  dosage: "500mg",
  frequency: "3x sehari",
  instructions: "Diminum setelah makan",
  sideEffects: ["Mual", "Pusing"],
  category: "Antibiotik" | "Vitamin" | "Analgesik" | "Antihipertensi" | "Antidiabetes" | "Lainnya",
  manufacturer: "Pharmaceutical Company",
  expiryDate: "2025-12-31",
  stockQuantity: 100,
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `schedules` Collection
```javascript
{
  id: "auto-generated-id",
  patientId: "patient-id",
  medicationId: "medication-id",
  medicationName: "Amoxicillin",
  dosage: "500mg",
  times: ["08:00", "14:00", "20:00"],
  startDate: "2024-01-15",
  endDate: "2024-01-29",
  instructions: "Diminum setelah makan",
  isActive: true,
  prescribedBy: "doctor-user-id",
  prescribedByName: "Dr. Name",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `consumptionRecords` Collection
```javascript
{
  id: "auto-generated-id",
  patientId: "patient-id",
  scheduleId: "schedule-id",
  medicationName: "Amoxicillin",
  scheduledTime: "08:00",
  actualTime: "08:15",
  status: "taken" | "missed" | "late",
  date: "2024-01-15",
  notes: "Diminum dengan air putih",
  reminderSent: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `systemSettings` Collection
```javascript
{
  id: "auto-generated-id",
  settingKey: "hospital_name",
  settingValue: "Rumah Sakit Beom-med",
  description: "Hospital name for branding",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `notifications` Collection
```javascript
{
  id: "auto-generated-id",
  userId: "user-id",
  title: "Reminder Obat",
  message: "Waktunya minum obat Amoxicillin",
  type: "info" | "warning" | "error" | "success",
  isRead: false,
  data: {
    scheduleId: "schedule-id",
    medicationName: "Amoxicillin"
  },
  createdAt: Timestamp
}
```

## 🔒 Firestore Security Rules

Replace your Firestore rules with this comprehensive security configuration:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function isAdmin() {
      return isAuthenticated() && getUserRole() == 'admin';
    }
    
    function isDoctor() {
      return isAuthenticated() && getUserRole() == 'doctor';
    }
    
    function isPatient() {
      return isAuthenticated() && getUserRole() == 'patient';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated() && (isAdmin() || isOwner(userId));
      allow write: if isAuthenticated() && (isAdmin() || isOwner(userId));
    }
    
    // Patients collection
    match /patients/{patientId} {
      allow read: if isAuthenticated() && (
        isAdmin() || 
        isDoctor() || 
        (isPatient() && resource.data.email == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.email)
      );
      allow create: if isAuthenticated() && (isAdmin() || isDoctor());
      allow update: if isAuthenticated() && (isAdmin() || isDoctor());
      allow delete: if isAdmin();
    }
    
    // Doctors collection
    match /doctors/{doctorId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Medications collection
    match /medications/{medicationId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && (isAdmin() || isDoctor());
    }
    
    // Schedules collection
    match /schedules/{scheduleId} {
      allow read: if isAuthenticated() && (
        isAdmin() || 
        isDoctor() || 
        (isPatient() && resource.data.patientId in get(/databases/$(database)/documents/patients).where('email', '==', get(/databases/$(database)/documents/users/$(request.auth.uid)).data.email).limit(1))
      );
      allow write: if isAuthenticated() && (isAdmin() || isDoctor());
    }
    
    // Consumption records collection
    match /consumptionRecords/{recordId} {
      allow read: if isAuthenticated() && (
        isAdmin() || 
        isDoctor() || 
        (isPatient() && resource.data.patientId in get(/databases/$(database)/documents/patients).where('email', '==', get(/databases/$(database)/documents/users/$(request.auth.uid)).data.email).limit(1))
      );
      allow write: if isAuthenticated() && (isAdmin() || isDoctor());
    }
    
    // System settings collection (admin only)
    match /systemSettings/{settingId} {
      allow read, write: if isAdmin();
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated();
    }
  }
}
```

## 📱 User Roles & Permissions

### Administrator (`admin`)
- **Full system access** to all features and data
- **User management** - can create/edit/delete all user types
- **Patient management** - complete CRUD operations
- **Doctor management** - assign patients, manage credentials
- **Medication catalog** - add/edit/remove medications
- **System settings** - configure hospital settings
- **Analytics & reports** - comprehensive system insights

### Doctor (`doctor`)
- **Patient access** - view and manage assigned patients only
- **Medication management** - prescribe and modify schedules
- **Schedule creation** - create medication schedules for patients
- **Consumption tracking** - monitor patient compliance
- **Patient history** - access medical records and history
- **Limited analytics** - patient-specific insights

### Patient (`patient`)
- **Personal data** - view own medical information
- **Medication schedules** - view prescribed medications
- **Consumption logging** - record medication intake
- **Personal history** - view own consumption history
- **Profile management** - update personal information
- **Compliance tracking** - view personal adherence statistics

## 🛠️ Development Features

### Real-time Updates
The application uses Firestore's real-time listeners for:
- **Patient data synchronization** across all connected clients
- **Schedule updates** when doctors modify prescriptions
- **Consumption records** for immediate compliance tracking
- **Notifications** for instant alerts and reminders

### Offline Support
Firestore provides built-in offline support:
- **Automatic caching** of frequently accessed data
- **Offline writes** are queued and synchronized when online
- **Conflict resolution** for concurrent edits
- **Seamless online/offline transitions**

### Data Validation
Client-side and server-side validation includes:
- **Input sanitization** for all user inputs
- **Data type validation** for numeric and date fields
- **Business rule enforcement** via security rules
- **Required field validation** for critical data

## 🚀 Deployment Guide

### Development Environment
1. Set up environment variables as shown above
2. Configure Firestore rules for development (test mode)
3. Run application locally: `npm run dev`

### Production Deployment

#### Option 1: Firebase Hosting (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Select:
# - Hosting
# - Use existing project
# - Public directory: dist
# - Single-page app: Yes
# - Don't overwrite index.html

# Build and deploy
npm run build
firebase deploy
```

#### Option 2: Vercel
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

#### Option 3: Netlify
1. Connect GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Production Checklist
- [ ] Update Firestore security rules for production
- [ ] Set up proper authentication domain
- [ ] Configure CORS settings if needed
- [ ] Set up monitoring and error reporting
- [ ] Enable Firebase Analytics
- [ ] Configure backup strategies
- [ ] Set up performance monitoring
- [ ] Test all user roles and permissions

## 📊 Sample Data Structure

### Default System Settings
```javascript
// Add these documents to systemSettings collection
[
  {
    settingKey: "hospital_name",
    settingValue: "Rumah Sakit Beom-med",
    description: "Hospital name for branding"
  },
  {
    settingKey: "reminder_intervals",
    settingValue: [15, 30, 60],
    description: "Reminder intervals in minutes before scheduled time"
  },
  {
    settingKey: "max_missed_doses",
    settingValue: 3,
    description: "Maximum missed doses before alert"
  },
  {
    settingKey: "notification_settings",
    settingValue: {
      email: true,
      push: true,
      sms: false
    },
    description: "Default notification settings"
  }
]
```

## 🔧 Troubleshooting

### Common Issues

**Environment Variables Not Loading**
- Ensure `.env.local` file is in project root
- Restart development server after adding variables
- Check variable names start with `VITE_`

**Firebase Connection Issues**
- Verify Firebase project ID is correct
- Check if Firebase services are enabled
- Ensure API keys are valid and not restricted

**Authentication Problems**
- Verify Email/Password provider is enabled
- Check authentication domain configuration
- Ensure security rules allow user creation

**Permission Denied Errors**
- Check Firestore security rules
- Verify user authentication status
- Ensure user has correct role assigned

**Data Not Syncing**
- Check internet connection
- Verify Firestore rules allow read/write
- Check browser console for errors

### Getting Help
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Community](https://firebase.google.com/community)

## 🎉 What's Next?

After successful setup, you can:
1. **Create your first admin user** through the registration flow
2. **Add sample patients and doctors** to test the system
3. **Set up medication schedules** and test compliance tracking
4. **Configure notifications** for medication reminders
5. **Deploy to production** when ready
6. **Add custom features** based on specific hospital needs

The Beom-med system is now ready with a complete Firebase backend that provides real-time data synchronization, secure authentication, and comprehensive healthcare workflow management! 🚀