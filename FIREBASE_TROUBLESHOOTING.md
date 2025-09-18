# 🔥 Firebase Firestore Troubleshooting Guide

## 🚨 **Current Issue: Firestore Connection Errors**

The console shows multiple Firestore connection errors:
- `Failed to load resource: the server responded with a status of 400 ()`
- `WebChannelConnection RPC 'Listen' stream transport errored`
- `FirebaseError: Failed to get document because the client is offline`

## 🔧 **Solution Steps:**

### 1. **Update Firestore Security Rules**

Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → Firestore Database → Rules

Replace the current rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read and write their own profile data
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow read access to public documents (if any)
    match /public/{document=**} {
      allow read: if true;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 2. **Enable Firestore in Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `tryitout-ai`
3. Go to **Firestore Database**
4. Click **Create database**
5. Choose **Start in test mode** (for now)
6. Select a location (closest to your users)

### 3. **Verify Firebase Project Settings**

1. Go to **Project Settings** (gear icon)
2. Go to **General** tab
3. Verify your project ID: `tryitout-ai`
4. Go to **Service accounts** tab
5. Make sure Firestore is enabled

### 4. **Check Authentication Setup**

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Enable **Google** provider
4. Add your domain to **Authorized domains**:
   - `tryitout-ai-06b6f1-1e7dca7aa188.herokuapp.com`
   - `tryitout.ai` (if using custom domain)

### 5. **Test the Fix**

After updating the rules:

1. Deploy the updated code:
   ```bash
   git add .
   git commit -m "Add better Firebase error handling"
   git push heroku main
   ```

2. Test the app:
   - Visit: https://tryitout-ai-06b6f1-1e7dca7aa188.herokuapp.com/
   - Try signing up with email/password
   - Check browser console for Firebase logs

### 6. **Alternative: Temporary Test Mode**

If you need immediate access, temporarily set Firestore rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ WARNING: This allows anyone to read/write your database. Only use for testing!**

## 🔍 **Debugging Steps:**

### Check Browser Console:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for Firebase initialization logs
4. Check for any error messages

### Check Network Tab:
1. Go to Network tab in Developer Tools
2. Look for requests to `firestore.googleapis.com`
3. Check if they're returning 400/404 errors

### Verify Environment Variables:
```bash
heroku config --app tryitout-ai-06b6f1
```

## 📞 **If Issues Persist:**

1. **Check Firebase Console** for any service outages
2. **Verify billing** - Firestore requires a paid plan for production
3. **Check quotas** - Ensure you haven't exceeded Firestore limits
4. **Review logs** in Firebase Console → Functions → Logs

## ✅ **Expected Result:**

After fixing the rules, you should see:
- No more 400/404 errors in console
- Firebase initialization success message
- User profiles loading correctly
- Authentication working properly

## 🚀 **Next Steps:**

1. Update Firestore rules (most important)
2. Deploy the improved error handling
3. Test the sign-up flow
4. Monitor Firebase Console for any issues

The main issue is likely that Firestore security rules are blocking access. Update the rules first, then test!
