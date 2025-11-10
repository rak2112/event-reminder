// Google OAuth Helper - Uses Google Identity Services for proper access tokens

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || process.env.REACT_APP_FIREBASE_APP_ID?.split(':')[0];

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/gmail.readonly',
].join(' ');

let tokenClient = null;
let accessToken = null;

// Initialize Google Identity Services
export const initGoogleIdentity = () => {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => resolve();
    script.onerror = () => resolve(); // Resolve anyway to not block
    document.head.appendChild(script);
  });
};

// Request access token for Google APIs
export const requestGoogleAccessToken = (firebaseConfig) => {
  return new Promise((resolve, reject) => {
    const clientId = firebaseConfig?.messagingSenderId
      ? `${firebaseConfig.messagingSenderId}.apps.googleusercontent.com`
      : GOOGLE_CLIENT_ID;

    console.log('Requesting access token with client ID:', clientId);

    if (!window.google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services not loaded'));
      return;
    }

    try {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: (response) => {
          if (response.error) {
            console.error('Token error:', response);
            reject(new Error(response.error));
            return;
          }

          accessToken = response.access_token;
          console.log('Access token obtained successfully');
          resolve(accessToken);
        },
      });

      tokenClient.requestAccessToken();
    } catch (error) {
      console.error('Error initializing token client:', error);
      reject(error);
    }
  });
};

// Get current access token
export const getAccessToken = () => accessToken;

// Clear access token
export const clearAccessToken = () => {
  accessToken = null;

  if (window.google?.accounts?.oauth2 && accessToken) {
    window.google.accounts.oauth2.revoke(accessToken, () => {
      console.log('Access token revoked');
    });
  }
};

export default {
  initGoogleIdentity,
  requestGoogleAccessToken,
  getAccessToken,
  clearAccessToken,
};
