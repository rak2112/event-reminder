// Gmail API Integration for Event Extraction

const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
];

export const initGmail = async (auth) => {
  try {
    const provider = new window.firebase.auth.GoogleAuthProvider();
    GMAIL_SCOPES.forEach(scope => provider.addScope(scope));

    const result = await auth.signInWithPopup(provider);
    const credential = result.credential;
    const accessToken = credential.accessToken;

    return accessToken;
  } catch (error) {
    console.error('Gmail auth error:', error);
    throw error;
  }
};

export const searchEmails = async (accessToken, query = 'has:attachment OR subject:event OR subject:invitation') => {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?` +
      new URLSearchParams({
        q: query,
        maxResults: '20',
      }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search emails');
    }

    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error('Error searching emails:', error);
    throw error;
  }
};

export const getEmailDetails = async (accessToken, messageId) => {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get email details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting email details:', error);
    throw error;
  }
};

export const extractEventsFromEmails = async (accessToken, maxEmails = 10) => {
  try {
    const messages = await searchEmails(accessToken);
    const events = [];

    for (const message of messages.slice(0, maxEmails)) {
      const details = await getEmailDetails(accessToken, message.id);
      const event = parseEventFromEmail(details);

      if (event) {
        events.push(event);
      }
    }

    return events;
  } catch (error) {
    console.error('Error extracting events from emails:', error);
    throw error;
  }
};

const parseEventFromEmail = (emailDetails) => {
  try {
    const headers = emailDetails.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const date = headers.find(h => h.name === 'Date')?.value || '';

    // Get email body
    let body = '';
    if (emailDetails.payload.body.data) {
      body = atob(emailDetails.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    } else if (emailDetails.payload.parts) {
      const textPart = emailDetails.payload.parts.find(p => p.mimeType === 'text/plain');
      if (textPart && textPart.body.data) {
        body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
    }

    // Extract date from email
    const extractedDate = extractDateFromText(body) || new Date(date);

    // Check if this looks like an event email
    const eventKeywords = ['meeting', 'event', 'invitation', 'appointment', 'conference', 'webinar'];
    const hasEventKeyword = eventKeywords.some(keyword =>
      subject.toLowerCase().includes(keyword) || body.toLowerCase().includes(keyword)
    );

    if (!hasEventKeyword) {
      return null;
    }

    return {
      title: subject,
      description: body.slice(0, 200), // First 200 chars
      date: extractedDate.toISOString().split('T')[0],
      time: extractTimeFromText(body) || '',
      source: 'gmail',
      emailId: emailDetails.id,
    };
  } catch (error) {
    console.error('Error parsing event from email:', error);
    return null;
  }
};

const extractDateFromText = (text) => {
  // Common date patterns
  const patterns = [
    /(\d{4}-\d{2}-\d{2})/,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /(\w{3,9}\s+\d{1,2},?\s+\d{4})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const date = new Date(match[0]);
      if (!isNaN(date)) {
        return date;
      }
    }
  }

  return null;
};

const extractTimeFromText = (text) => {
  const timeRegex = /(\d{1,2}):(\d{2})\s*(am|pm)?/i;
  const match = text.match(timeRegex);

  if (match) {
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const meridiem = match[3];

    if (meridiem) {
      if (meridiem.toLowerCase() === 'pm' && hours < 12) {
        hours += 12;
      } else if (meridiem.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
      }
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  return '';
};

export const syncGmailEventsToFirestore = async (events, userId, db, familyMembers) => {
  const batch = db.batch();
  const synced = [];

  for (const event of events) {
    // Check if event already exists
    const existingQuery = await db
      .collection('events')
      .where('userId', '==', userId)
      .where('emailId', '==', event.emailId)
      .get();

    if (existingQuery.empty) {
      const eventRef = db.collection('events').doc();

      batch.set(eventRef, {
        ...event,
        member: familyMembers[0]?.id.toString() || '1',
        type: 'event',
        priority: 'medium',
        userId: userId,
        completed: false,
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      });

      synced.push(event.title);
    }
  }

  await batch.commit();
  return synced;
};
