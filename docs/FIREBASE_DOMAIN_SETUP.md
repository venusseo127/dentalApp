# Fixing "Unauthorized Domain" Error for Google Authentication

## Problem
You're seeing this error when trying to sign in with Google:
```
Google auth error: FirebaseError: auth/unauthorized-domain
```

## Solution

### Step 1: Find Your Current Domain
1. Look at your browser's address bar when the app is running
2. Copy the domain part (without `https://`)

### Step 2: Add Domain to Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Authentication** in the left sidebar
4. Go to **Settings** tab
5. Scroll down to **Authorized domains** section
6. Click **Add domain**
7. Enter your  domain 
8. Click **Done**

### Step 3: Test Google Sign-in
1. Go back to your app
2. Try clicking "Continue with Google"
3. It should now work without the unauthorized domain error

## Additional Domains to Add

### Development Domains
- `localhost` (for local development)
- `127.0.0.1` (alternative localhost)
- Your current  domain

### Production Domains (if applicable)
- Your custom domain name
- Your deployment domain (AWS, etc.)

## Important Notes

1. **Domain Format**: Add domains without `https://` or `http://`
2. ** Domains Change**:  domains can change, so you may need to update this periodically

3. **Wildcard Domains**: Firebase doesn't support wildcard domains, so add each specific domain

## Quick Fix Command

If you have Firebase CLI installed:
```bash
firebase auth:import --project your-project-id authorized-domains.json
```

Where `authorized-domains.json` contains:
```json
{
  "authorizedDomains": [
    "localhost",
  ]
}
```

## Verification

After adding the domain:
1. Wait 5-10 minutes for changes to propagate
2. Clear your browser cache
3. Try Google sign-in again
4. You should see the Google OAuth popup instead of the error

## Still Having Issues?

1. **Double-check domain spelling** - make sure it matches exactly
2. **Check Firebase project** - ensure you're editing the correct project
3. **Browser cache** - clear cache and cookies
4. **Incognito mode** - try signing in using incognito/private browsing

Your Google authentication should now work properly!