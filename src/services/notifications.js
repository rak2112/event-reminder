// Push Notifications Service

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

export const subscribeToPushNotifications = async (registration) => {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.REACT_APP_VAPID_PUBLIC_KEY || ''
      ),
    });

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
};

export const showLocalNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo192.png',
      badge: '/logo192.png',
      vibrate: [200, 100, 200],
      ...options,
    });
  }
};

// Test notification - fires immediately
export const sendTestNotification = async () => {
  console.log('=== Testing Notification ===');
  console.log('Browser supports notifications:', 'Notification' in window);
  console.log('Current permission:', Notification.permission);

  if (!('Notification' in window)) {
    throw new Error('This browser does not support notifications');
  }

  if (Notification.permission !== 'granted') {
    console.log('Permission not granted, requesting...');
    const granted = await requestNotificationPermission();
    console.log('Permission request result:', granted);
    if (!granted) {
      throw new Error('Notification permission denied. Please enable notifications in your browser settings.');
    }
  }

  console.log('Sending test notification...');
  const notification = new Notification('Test Notification - Family Hub', {
    body: 'This is a test notification! Your notifications are working correctly. 🎉',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [200, 100, 200],
    tag: 'test-notification',
    requireInteraction: false,
  });

  notification.onclick = () => {
    console.log('Notification clicked!');
    window.focus();
    notification.close();
  };

  console.log('Notification sent successfully!');
  return true;
};

export const scheduleEventNotifications = async (event, userId, db) => {
  if (!event.date) return;

  const eventDate = new Date(event.date);
  const now = new Date();

  // Calculate notification times
  const notifications = [
    {
      days: 15,
      timestamp: new Date(eventDate.getTime() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      days: 7,
      timestamp: new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      days: 1,
      timestamp: new Date(eventDate.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  // Only schedule future notifications
  const futureNotifications = notifications.filter(n => n.timestamp > now);

  // Store notification schedules in Firestore
  const batch = db.batch();

  for (const notification of futureNotifications) {
    const notificationRef = db.collection('scheduledNotifications').doc();
    batch.set(notificationRef, {
      eventId: event.id,
      eventTitle: event.title,
      userId: userId,
      scheduledFor: notification.timestamp,
      daysBeforeEvent: notification.days,
      sent: false,
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  return futureNotifications.length;
};

export const checkAndSendNotifications = async (userId, db) => {
  try {
    const now = new Date();

    // Query notifications that should be sent
    const snapshot = await db
      .collection('scheduledNotifications')
      .where('userId', '==', userId)
      .where('sent', '==', false)
      .where('scheduledFor', '<=', now)
      .get();

    const batch = db.batch();

    for (const doc of snapshot.docs) {
      const notification = doc.data();

      // Show local notification
      showLocalNotification(
        `Upcoming Event: ${notification.eventTitle}`,
        {
          body: `Your event "${notification.eventTitle}" is coming up in ${notification.daysBeforeEvent} days`,
          tag: doc.id,
          requireInteraction: true,
        }
      );

      // Mark as sent
      batch.update(doc.ref, { sent: true });
    }

    await batch.commit();
    return snapshot.size;
  } catch (error) {
    console.error('Error checking notifications:', error);
    return 0;
  }
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const cleanupOldNotifications = async (userId, db) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const snapshot = await db
      .collection('scheduledNotifications')
      .where('userId', '==', userId)
      .where('scheduledFor', '<', thirtyDaysAgo)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    return snapshot.size;
  } catch (error) {
    console.error('Error cleaning up notifications:', error);
    return 0;
  }
};
