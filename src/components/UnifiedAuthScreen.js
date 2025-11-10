import React, { useState } from 'react';
import { Users, Mail, Lock, LogIn } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';

const UnifiedAuthScreen = ({ onGoogleSignIn, onEmailSignIn, onEmailSignUp, firebaseInitialized, isLoading }) => {
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      await onEmailSignUp(email, password);
    } else {
      await onEmailSignIn(email, password);
    }
  };

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
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </p>
          </div>

          {!firebaseInitialized ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-800 text-sm font-medium">
                Please update FIREBASE_CONFIG in the code with your Firebase credentials
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <Input
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  error={error && !email ? 'Email is required' : ''}
                />

                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={Lock}
                  error={error && !password ? 'Password is required' : ''}
                />

                {mode === 'signup' && (
                  <Input
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={Lock}
                    error={error && password !== confirmPassword ? 'Passwords do not match' : ''}
                  />
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  icon={LogIn}
                >
                  {mode === 'signup' ? 'Create Account' : 'Sign In'}
                </Button>
              </form>

              {/* Toggle Sign In / Sign Up */}
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError('');
                }}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {mode === 'signup'
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={onGoogleSignIn}
                loading={isLoading}
                className="hover:bg-gray-50"
              >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium">Google</span>
              </Button>
            </div>
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
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">Calendar Integration</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🔔</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">Smart Reminders</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UnifiedAuthScreen;
