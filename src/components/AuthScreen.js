import React from 'react';
import { Users, LogIn } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

const AuthScreen = ({ onSignIn, firebaseInitialized, isSigningIn }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center" shadow="2xl">
        <div className="space-y-6">
          {/* Logo */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-full w-24 h-24 mx-auto shadow-xl">
            <Users className="w-12 h-12 text-white" />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Family Hub
            </h1>
            <p className="text-gray-600 text-lg">
              Organize your family's events, reminders, and activities in one beautiful place.
            </p>
          </div>

          {/* Firebase Status / Sign In Button */}
          {!firebaseInitialized ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-800 text-sm font-medium">
                Please update FIREBASE_CONFIG in the code with your Firebase credentials
              </p>
            </div>
          ) : (
            <Button
              variant="gradient"
              size="lg"
              fullWidth
              icon={LogIn}
              onClick={onSignIn}
              loading={isSigningIn}
              className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Sign in with Google
            </Button>
          )}

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🔄</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">Sync Across Devices</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🔒</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">Secure Authentication</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">AI-Powered Extraction</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthScreen;
