// Google Calendar API Integration

const CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events',
];

export const initGoogleCalendar = async (auth) => {
  try {
    const provider = new window.firebase.auth.GoogleAuthProvider();
    CALENDAR_SCOPES.forEach(scope => provider.addScope(scope));

    const result = await auth.signInWithPopup(provider);
    const credential = result.credential;
    const accessToken = credential.accessToken;

    return accessToken;
  } catch (error) {
    console.error('Google Calendar auth error:', error);
    throw error;
  }
};

export const fetchCalendarEvents = async (accessToken, timeMin, timeMax) => {
  try {
    console.log('Fetching calendar with token:', accessToken ? 'Token exists' : 'No token');

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      new URLSearchParams({
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
      }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log('Calendar API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Calendar API error:', errorData);
      throw new Error(
        errorData.error?.message ||
        `Calendar API error: ${response.status} - ${response.statusText}. Please sign out and sign in again with Google to grant Calendar access.`
      );
    }

    const data = await response.json();
    console.log('Calendar events fetched:', data.items?.length || 0);
    return data.items || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};

export const syncCalendarToFirestore = async (events, userId, db, familyMembers) => {
  const batch = db.batch();
  const synced = [];

  for (const event of events) {
    // Check if event already exists
    const existingQuery = await db
      .collection('events')
      .where('userId', '==', userId)
      .where('googleCalendarId', '==', event.id)
      .get();

    if (existingQuery.empty) {
      // Create new event
      const eventRef = db.collection('events').doc();

      const startDateTime = event.start.dateTime || event.start.date;
      const date = new Date(startDateTime);

      batch.set(eventRef, {
        title: event.summary || 'Untitled Event',
        description: event.description || '',
        date: date.toISOString().split('T')[0],
        time: event.start.dateTime ? date.toTimeString().slice(0, 5) : '',
        member: familyMembers[0]?.id.toString() || '1',
        type: 'event',
        priority: 'medium',
        userId: userId,
        completed: false,
        googleCalendarId: event.id,
        googleCalendarLink: event.htmlLink,
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      });

      synced.push(event.summary);
    }
  }

  await batch.commit();
  return synced;
};

export const createCalendarEvent = async (accessToken, event) => {
  try {
    const calendarEvent = {
      summary: event.title,
      description: event.description,
      start: {
        dateTime: `${event.date}T${event.time || '09:00'}:00`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: `${event.date}T${event.time ?
          new Date(`${event.date}T${event.time}`).setHours(
            new Date(`${event.date}T${event.time}`).getHours() + 1
          ) : '10:00'}:00`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 15 * 24 * 60 }, // 15 days
          { method: 'popup', minutes: 7 * 24 * 60 },  // 7 days
        ],
      },
    };

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calendarEvent),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};
