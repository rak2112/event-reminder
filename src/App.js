import React, { useState, useEffect } from 'react';
import { Calendar, Users, Plus, Image, CheckCircle, Clock, Bell, Search, LogOut } from 'lucide-react';

// IMPORTANT: Replace this with YOUR Firebase config from Firebase Console
const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const FamilyHubPWA = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);

  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'Parent', color: '#3B82F6' },
    { id: 2, name: 'Child 1', color: '#10B981' },
    { id: 3, name: 'Child 2', color: '#F59E0B' },
    { id: 4, name: 'Shared', color: '#8B5CF6' }
  ]);
  const [events, setEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    member: '',
    type: 'event',
    priority: 'medium'
  });

  // Initialize Firebase
  useEffect(() => {
    const initFirebase = async () => {
      try {
        if (FIREBASE_CONFIG.apiKey === "YOUR_API_KEY") {
          console.log("Please update FIREBASE_CONFIG with your actual Firebase credentials");
          setLoading(false);
          return;
        }

        const firebaseApp = await loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
        const firebaseAuth = await loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js');
        const firebaseFirestore = await loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js');

        if (!window.firebase.apps.length) {
          window.firebase.initializeApp(FIREBASE_CONFIG);
        }

        const authInstance = window.firebase.auth();
        const dbInstance = window.firebase.firestore();

        setAuth(authInstance);
        setDb(dbInstance);
        setFirebaseInitialized(true);

        authInstance.onAuthStateChanged((user) => {
          setUser(user);
          setLoading(false);
        });

      } catch (error) {
        console.error("Firebase initialization error:", error);
        setLoading(false);
      }
    };

    initFirebase();
  }, []);
  // Add this state near your other useState declarations
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingMembers, setEditingMembers] = useState([]);

  // Load family members from Firestore when user signs in
  useEffect(() => {
    if (!firebaseInitialized || !user || !db) return;

    const unsubscribeUser = db.collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        if (doc.exists && doc.data().familyMembers) {
          setFamilyMembers(doc.data().familyMembers);
        } else {
          // Initialize with default members if first time
          const defaultMembers = [
            { id: 1, name: 'Parent', color: '#3B82F6' },
            { id: 2, name: 'Child 1', color: '#10B981' },
            { id: 3, name: 'Child 2', color: '#F59E0B' },
            { id: 4, name: 'Shared', color: '#8B5CF6' }
          ];
          setFamilyMembers(defaultMembers);
          // Save default to Firestore
          db.collection('users').doc(user.uid).set({
            familyMembers: defaultMembers,
            createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
          });
        }
      });

    return () => {
      unsubscribeUser();
    };
  }, [firebaseInitialized, user, db]);

  // Save family members to Firestore
  const saveFamilyMembers = async () => {
    if (!user || !db) return;

    try {
      await db.collection('users').doc(user.uid).set({
        familyMembers: editingMembers,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      setFamilyMembers(editingMembers);
      setShowSettingsModal(false);

      // Show success message
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successToast.textContent = 'Family members updated successfully!';
      document.body.appendChild(successToast);
      setTimeout(() => document.body.removeChild(successToast), 3000);
    } catch (error) {
      console.error('Error saving family members:', error);
      alert('Failed to save: ' + error.message);
    }
  };

  // Open settings modal
  const openSettings = () => {
    setEditingMembers([...familyMembers]); // Create a copy for editing
    setShowSettingsModal(true);
  };

  // Update member name
  const updateMemberName = (id, newName) => {
    setEditingMembers(editingMembers.map(m =>
      m.id === id ? { ...m, name: newName } : m
    ));
  };

  // Update member color
  const updateMemberColor = (id, newColor) => {
    setEditingMembers(editingMembers.map(m =>
      m.id === id ? { ...m, color: newColor } : m
    ));
  };

  // Add new family member
  const addFamilyMember = () => {
    const newId = Math.max(...editingMembers.map(m => m.id)) + 1;
    setEditingMembers([
      ...editingMembers,
      { id: newId, name: `Member ${newId}`, color: '#6B7280' }
    ]);
  };

  // Remove family member
  const removeFamilyMember = (id) => {
    if (editingMembers.length <= 1) {
      alert('You must have at least one family member!');
      return;
    }
    setEditingMembers(editingMembers.filter(m => m.id !== id));
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    if (!firebaseInitialized || !user || !db) return;
    console.log('firebaseInitialized', firebaseInitialized);
    console.log('user', user);
    console.log('db', db);
    const unsubscribeEvents = db.collection('events')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const eventsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsData);
      });

    const unsubscribeReminders = db.collection('reminders')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const remindersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReminders(remindersData);
      });

    return () => {
      unsubscribeEvents();
      unsubscribeReminders();
    };
  }, [firebaseInitialized, user, db]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    try {
      const provider = new window.firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Sign in failed: " + error.message);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleAddItem = async () => {
    if (!newEvent.title || !newEvent.member || !user || !db) return;

    const item = {
      ...newEvent,
      userId: user.uid,
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      completed: false
    };

    try {
      if (newEvent.type === 'event') {
        await db.collection('events').add(item);
      } else {
        await db.collection('reminders').add(item);
      }

      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        member: '',
        type: 'event',
        priority: 'medium'
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item: " + error.message);
    }
  };

  const toggleComplete = async (id, type) => {
    if (!db) return;
    try {
      const collection = type === 'event' ? 'events' : 'reminders';
      const docRef = db.collection(collection).doc(id);
      const doc = await docRef.get();

      if (doc.exists) {
        await docRef.update({
          completed: !doc.data().completed
        });
      }
    } catch (error) {
      console.error("Error toggling complete:", error);
    }
  };

  const deleteItem = async (id, type) => {
    if (!db) return;
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const collection = type === 'event' ? 'events' : 'reminders';
      await db.collection(collection).doc(id).delete();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item: " + error.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setShowImageUpload(false);

      const loadingToast = document.createElement('div');
      loadingToast.className = 'fixed top-4 right-4 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      loadingToast.textContent = 'Extracting event details from image...';
      document.body.appendChild(loadingToast);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: file.type,
                  data: base64
                }
              },
              {
                type: 'text',
                text: 'Analyze this image and extract event or reminder information. Return ONLY a JSON object with these fields: title, description, date in YYYY-MM-DD format, time in HH:MM format, type as event or reminder, and priority as high, medium, or low. If you cannot find specific information, use reasonable defaults. Return ONLY the JSON, no other text.'
              }
            ]
          }]
        })
      });

      const data = await response.json();
      document.body.removeChild(loadingToast);

      if (data.content && data.content[0] && data.content[0].text) {
        let extractedText = data.content[0].text.trim();
        extractedText = extractedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        try {
          const extracted = JSON.parse(extractedText);

          setNewEvent({
            title: extracted.title || '',
            description: extracted.description || '',
            date: extracted.date || '',
            time: extracted.time || '',
            member: '',
            type: extracted.type || 'event',
            priority: extracted.priority || 'medium'
          });

          setShowAddModal(true);

          const successToast = document.createElement('div');
          successToast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          successToast.textContent = 'Event details extracted! Please select a family member.';
          document.body.appendChild(successToast);
          setTimeout(() => document.body.removeChild(successToast), 3000);

        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          alert('Could not parse extracted data. Please add manually.');
        }
      }
    } catch (error) {
      console.error('Image processing error:', error);
      alert('Failed to process image: ' + error.message);
    }
  };

  const getMemberColor = (memberId) => {
    const member = familyMembers.find(m => m.id === parseInt(memberId));
    return member ? member.color : '#6B7280';
  };

  const getMemberName = (memberId) => {
    const member = familyMembers.find(m => m.id === parseInt(memberId));
    return member ? member.name : 'Unknown';
  };

  const filterItems = (items) => {
    let filtered = items;

    if (selectedMember) {
      filtered = filtered.filter(item => item.member === selectedMember.toString());
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);
      return dateA - dateB;
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Family Hub...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <Users className="w-20 h-20 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Family Hub</h1>
          <p className="text-gray-600 mb-6">
            Organize your family's events, reminders, and activities in one place.
          </p>

          {!firebaseInitialized ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                Please update FIREBASE_CONFIG in the code with your Firebase credentials
              </p>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition shadow-sm"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-medium">Sign in with Google</span>
            </button>
          )}

          <div className="mt-6 text-sm text-gray-500">
            <p>Sync across all devices</p>
            <p>Secure Google authentication</p>
            <p>AI-powered screenshot extraction</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Family Hub</h1>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={openSettings}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <button
                onClick={() => setShowImageUpload(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                <Image className="w-5 h-5" />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events and reminders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedMember(null)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${selectedMember === null
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                All
              </button>
              {familyMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${selectedMember === member.id
                    ? 'text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  style={selectedMember === member.id ? { backgroundColor: member.color } : {}}
                >
                  {member.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition ${activeTab === 'events'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
                }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Events</span>
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                {filterItems(events).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition ${activeTab === 'reminders'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
                }`}
            >
              <Bell className="w-5 h-5" />
              <span>Reminders</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                {filterItems(reminders).length}
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {activeTab === 'events' && (
            <>
              {filterItems(events).length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No events yet. Add your first event!</p>
                </div>
              ) : (
                filterItems(events).map(event => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <button
                            onClick={() => toggleComplete(event.id, 'event')}
                            className="flex-shrink-0"
                          >
                            <CheckCircle
                              className={`w-6 h-6 ${event.completed ? 'text-green-500 fill-current' : 'text-gray-300'
                                }`}
                            />
                          </button>
                          <h3
                            className={`text-xl font-semibold ${event.completed ? 'line-through text-gray-400' : 'text-gray-800'
                              }`}
                          >
                            {event.title}
                          </h3>
                        </div>
                        {event.description && (
                          <p className="text-gray-600 ml-9 mb-3">{event.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 ml-9">
                          <span
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: getMemberColor(event.member) }}
                          >
                            {getMemberName(event.member)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(event.priority)}`}>
                            {event.priority} priority
                          </span>
                          {event.date && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                              {event.time && <span>at {event.time}</span>}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteItem(event.id, 'event')}
                        className="text-red-500 hover:text-red-700 ml-4 text-2xl"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'reminders' && (
            <>
              {filterItems(reminders).length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No reminders yet. Add your first reminder!</p>
                </div>
              ) : (
                filterItems(reminders).map(reminder => (
                  <div
                    key={reminder.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <button
                            onClick={() => toggleComplete(reminder.id, 'reminder')}
                            className="flex-shrink-0"
                          >
                            <CheckCircle
                              className={`w-6 h-6 ${reminder.completed ? 'text-green-500 fill-current' : 'text-gray-300'
                                }`}
                            />
                          </button>
                          <h3
                            className={`text-xl font-semibold ${reminder.completed ? 'line-through text-gray-400' : 'text-gray-800'
                              }`}
                          >
                            {reminder.title}
                          </h3>
                        </div>
                        {reminder.description && (
                          <p className="text-gray-600 ml-9 mb-3">{reminder.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 ml-9">
                          <span
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: getMemberColor(reminder.member) }}
                          >
                            {getMemberName(reminder.member)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(reminder.priority)}`}>
                            {reminder.priority} priority
                          </span>
                          {reminder.date && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(reminder.date).toLocaleDateString()}</span>
                              {reminder.time && <span>at {reminder.time}</span>}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteItem(reminder.id, 'reminder')}
                        className="text-red-500 hover:text-red-700 ml-4 text-2xl"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Item</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewEvent({ ...newEvent, type: 'event' })}
                    className={`flex-1 py-2 px-4 rounded-lg transition ${newEvent.type === 'event'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    Event
                  </button>
                  <button
                    onClick={() => setNewEvent({ ...newEvent, type: 'reminder' })}
                    className={`flex-1 py-2 px-4 rounded-lg transition ${newEvent.type === 'reminder'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    Reminder
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family Member</label>
                <select
                  value={newEvent.member}
                  onChange={(e) => setNewEvent({ ...newEvent, member: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select member</option>
                  {familyMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newEvent.priority}
                  onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Screenshot</h2>
            <p className="text-gray-600 mb-4">
              Upload a screenshot and AI will extract the event details automatically.
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowImageUpload(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Family Settings</h2>
            <p className="text-gray-600 mb-6">Customize your family member names and colors</p>

            <div className="space-y-4 mb-6">
              {editingMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="color"
                    value={member.color}
                    onChange={(e) => updateMemberColor(member.id, e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMemberName(member.id, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Member name"
                  />
                  <button
                    onClick={() => removeFamilyMember(member.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    disabled={editingMembers.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addFamilyMember}
              className="w-full mb-4 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Add Family Member</span>
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveFamilyMembers}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyHubPWA;