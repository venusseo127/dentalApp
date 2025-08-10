# Firebase Setup Guide for SmileCare Dental Scheduling System

## Overview

This guide will help you configure Firebase Authentication and Firestore for the SmileCare Dental Scheduling System, including resolving the "unauthorized domain" error for Google OAuth.

## Firebase Console Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `smilecare-dental-scheduling`
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** from the left sidebar
2. Click on the **"Get started"** button
3. Go to the **"Sign-in method"** tab
4. Enable the following sign-in providers:

#### Email/Password Authentication
1. Click on "Email/Password"
2. Toggle "Enable" to ON
3. Click "Save"

#### Google Authentication
1. Click on "Google"
2. Toggle "Enable" to ON
3. Select your project support email
4. Click "Save"

### Step 3: Configure Authorized Domains

**This step is crucial to fix the "unauthorized domain" error:**

1. In Authentication, go to **"Settings"** tab
2. Scroll down to **"Authorized domains"**
3. Add the following domains:
   - `localhost` (for local development)
   - Your current  domain 
   - Your production domain (if you have one)


### Step 4: Enable Firestore Database

1. Go to **Firestore Database** from the left sidebar
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll configure rules later)
4. Select a location closest to your users (e.g., `us-central1`)
5. Click **"Done"**

### Step 5: Configure Firestore Security Rules

1. In Firestore Database, go to **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read services and dentists
    match /services/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        resource.data.role == 'admin' || request.auth.token.role == 'admin';
    }
    
    match /dentists/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        resource.data.role == 'admin' || request.auth.token.role == 'admin';
    }
    
    // Appointments - users can read/write their own, admins can read/write all
    match /appointments/{document} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || request.auth.token.role == 'admin');
      allow create: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### Step 6: Get Firebase Configuration

1. Go to **Project Settings** (gear icon in left sidebar)
2. Scroll down to **"Your apps"** section
3. Click on **"Web"** icon (</>) to add a web app
4. Enter app nickname: `smilecare-dental-web`
5. Check "Also set up Firebase Hosting" if you plan to use it
6. Click **"Register app"**
7. Copy the `firebaseConfig` object values

## Environment Variables Setup

Create a `.env` file (or update your  Secrets) with these values:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
VITE_FIREBASE_APP_ID=your-app-id-here
```

**Where to find these values:**
- `FIREBASE_PROJECT_ID`: Your project ID from Firebase console
- `VITE_FIREBASE_API_KEY`: From the firebaseConfig object
- `VITE_FIREBASE_AUTH_DOMAIN`: Usually `project-id.firebaseapp.com`
- `VITE_FIREBASE_STORAGE_BUCKET`: Usually `project-id.appspot.com`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: From the firebaseConfig object
- `VITE_FIREBASE_APP_ID`: From the firebaseConfig object

## Testing the Setup

### Test Authentication

1. Start your application
2. Go to the login page
3. Try creating an account with email/password
4. Try logging in with Google (should now work without domain error)

### Test Database Connection

The application will automatically create the following collections when users interact with it:
- `users` - User profiles
- `appointments` - Appointment bookings
- `dentists` - Dentist information
- `services` - Available services

### Verify Data in Firebase Console

1. Go back to Firestore Database in Firebase Console
2. You should see collections being created as users register and interact with the app
3. Data should appear in real-time as it's created

## Admin User Setup

To create an admin user:

1. Register a normal user account through the app
2. Go to Firestore Database in Firebase Console
3. Find the user document in the `users` collection
4. Edit the document and change `role` from `"patient"` to `"admin"`
5. Save the changes

The user will now have admin privileges when they log in again.

## Common Issues and Solutions

### Issue: "Unauthorized domain" error with Google Sign-in

**Solution:**
1. Go to Firebase Console > Authentication > Settings
2. Add your current domain to "Authorized domains"
3. Make sure to include the exact domain without `https://`

### Issue: Firestore permission denied

**Solution:**
1. Check Firestore Rules in Firebase Console
2. Make sure authentication is working (user is logged in)
3. Verify the user has the correct role for the operation

### Issue: Environment variables not loading

**Solution:**
1. In , go to Secrets tab
2. Add each environment variable one by one
3. Restart the application
4. Check that variable names start with `VITE_` for frontend access

### Issue: Firebase configuration errors

**Solution:**
1. Double-check all configuration values in Firebase Console
2. Make sure there are no extra spaces or characters
3. Verify the project ID matches exactly

## Security Best Practices

1. **Never expose API keys in client-side code** - Firebase API keys are safe to be public as they identify your project, not authenticate it
2. **Use Firestore Security Rules** - Always configure proper security rules
3. **Regular security reviews** - Periodically review authorized domains and access patterns
4. **Monitor authentication** - Use Firebase Analytics to monitor authentication patterns

## Production Considerations

1. **Enable billing** - Firebase has generous free tiers, but production apps may need billing enabled
2. **Set up monitoring** - Use Firebase Performance Monitoring
3. **Configure alerts** - Set up alerts for unusual authentication patterns
4. **Backup strategy** - Configure Firestore backup schedules
5. **Custom domain** - Set up custom domain for production deployment

This setup will provide a secure, scalable authentication and database solution for your dental scheduling system.