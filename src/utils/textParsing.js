/**
 * Extracts date from text string
 * Supports formats: YYYY-MM-DD, MM/DD/YYYY, Month DD, YYYY, etc.
 * @param {string} text - The text to search for dates
 * @returns {string} - Date in YYYY-MM-DD format or empty string
 */
export const extractDate = (text) => {
  // Try various date formats
  const datePatterns = [
    // YYYY-MM-DD
    /(\d{4}-\d{2}-\d{2})/,
    // MM/DD/YYYY or DD/MM/YYYY
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/,
    // Month DD, YYYY or DD Month YYYY
    /(\w{3,9}\s+\d{1,2},?\s+\d{4})/,
    // DD Month YYYY
    /(\d{1,2}\s+\w{3,9}\s+\d{4})/,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const date = new Date(match[0]);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      } catch (e) {
        // Continue to next pattern
      }
    }
  }

  return '';
};

/**
 * Extracts time from text string
 * Supports formats: HH:MM, H:MM AM/PM, etc.
 * @param {string} text - The text to search for times
 * @returns {string} - Time in HH:MM format (24-hour) or empty string
 */
export const extractTime = (text) => {
  // Try various time formats
  const timePatterns = [
    // HH:MM AM/PM
    /(\d{1,2}):(\d{2})\s*(am|pm)/i,
    // HH:MM (24-hour format)
    /(\d{1,2}):(\d{2})(?!\s*[ap]m)/i,
    // H:MM AM/PM (without leading zero)
    /(\d{1,2}):(\d{2})\s*([ap]m)/i,
  ];

  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const meridiem = match[3];

      if (meridiem) {
        const isPM = meridiem.toLowerCase() === 'pm';
        if (isPM && hours < 12) {
          hours += 12;
        } else if (!isPM && hours === 12) {
          hours = 0;
        }
      }

      // Validate hours and minutes
      if (hours >= 0 && hours < 24 && parseInt(minutes, 10) >= 0 && parseInt(minutes, 10) < 60) {
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
      }
    }
  }

  return '';
};

/**
 * Parses extracted text to extract event information
 * @param {string} extractedText - The full text extracted from the image
 * @returns {object} - Object with parsed event details
 */
export const parseEventFromText = (extractedText) => {
  if (!extractedText) {
    return {
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'event',
      priority: 'medium'
    };
  }

  const lines = extractedText.split('\n').filter(line => line.trim());
  
  // Extract date and time
  const date = extractDate(extractedText);
  const time = extractTime(extractedText);
  
  // Determine priority from text (look for keywords)
  let priority = 'medium';
  const lowerText = extractedText.toLowerCase();
  if (lowerText.includes('urgent') || lowerText.includes('important') || lowerText.includes('high')) {
    priority = 'high';
  } else if (lowerText.includes('low') || lowerText.includes('optional')) {
    priority = 'low';
  }
  
  // Determine type (event vs reminder)
  let type = 'event';
  if (lowerText.includes('reminder') || lowerText.includes('remember')) {
    type = 'reminder';
  }
  
  return {
    title: lines[0] || '',
    description: lines.slice(1, 3).join(' ').trim() || '',
    date: date,
    time: time,
    member: '',
    type: type,
    priority: priority
  };
};

