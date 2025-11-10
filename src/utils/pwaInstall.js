// PWA Installation utilities

export const isPWAInstalled = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
};

export const canInstallPWA = () => {
  return 'BeforeInstallPromptEvent' in window;
};

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

export const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

export const getInstallInstructions = () => {
  if (isIOS()) {
    return {
      platform: 'iOS',
      steps: [
        'Tap the Share button at the bottom of Safari',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" in the top right corner',
      ],
    };
  } else if (isAndroid()) {
    return {
      platform: 'Android',
      steps: [
        'Tap the menu button (three dots) in Chrome',
        'Tap "Add to Home screen" or "Install app"',
        'Tap "Add" to confirm',
      ],
    };
  } else {
    return {
      platform: 'Desktop',
      steps: [
        'Click the install icon in your browser address bar',
        'Or check the browser menu for "Install Family Hub"',
      ],
    };
  }
};
