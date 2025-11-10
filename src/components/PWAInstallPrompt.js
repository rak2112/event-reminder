import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import { getInstallInstructions, isPWAInstalled, isIOS } from '../utils/pwaInstall';

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const instructions = getInstallInstructions();

  useEffect(() => {
    // Don't show if already installed
    if (isPWAInstalled()) return;

    // Check if user has dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    // For browsers that support the install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show manual instructions after a delay
    if (isIOS()) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-96">
      <Card className="border-2 border-indigo-500 relative" shadow="2xl">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-4 mb-4">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">
              Install Family Hub
            </h3>
            <p className="text-sm text-gray-600">
              Access quickly from your home screen
            </p>
          </div>
        </div>

        {deferredPrompt ? (
          <Button
            variant="gradient"
            fullWidth
            icon={Download}
            onClick={handleInstallClick}
          >
            Install Now
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              {instructions.platform} Installation:
            </p>
            <ol className="text-sm text-gray-600 space-y-2">
              {instructions.steps.map((step, index) => (
                <li key={index} className="flex">
                  <span className="font-semibold mr-2">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
