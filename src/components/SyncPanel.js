import React, { useState } from 'react';
import { Calendar, Mail, RefreshCw, Bell } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Card from './ui/Card';

const SyncPanel = ({
  isOpen,
  onClose,
  onSyncCalendar,
  onSyncGmail,
  onEnableNotifications,
  isSyncing,
  notificationsEnabled,
  googleAccessToken,
}) => {
  const [syncStatus, setSyncStatus] = useState({
    calendar: null,
    gmail: null,
    notifications: null,
  });

  const handleSyncCalendar = async () => {
    setSyncStatus({ ...syncStatus, calendar: 'syncing' });
    try {
      const result = await onSyncCalendar();
      setSyncStatus({ ...syncStatus, calendar: 'success' });
      return result;
    } catch (error) {
      setSyncStatus({ ...syncStatus, calendar: 'error' });
      throw error;
    }
  };

  const handleSyncGmail = async () => {
    setSyncStatus({ ...syncStatus, gmail: 'syncing' });
    try {
      const result = await onSyncGmail();
      setSyncStatus({ ...syncStatus, gmail: 'success' });
      return result;
    } catch (error) {
      setSyncStatus({ ...syncStatus, gmail: 'error' });
      throw error;
    }
  };

  const handleEnableNotifications = async () => {
    setSyncStatus({ ...syncStatus, notifications: 'enabling' });
    try {
      const result = await onEnableNotifications();
      setSyncStatus({ ...syncStatus, notifications: result ? 'success' : 'error' });
      return result;
    } catch (error) {
      setSyncStatus({ ...syncStatus, notifications: 'error' });
      throw error;
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sync & Integrations" size="lg">
      <div className="space-y-4">
        {/* Status indicator */}
        {googleAccessToken && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <p className="text-sm text-green-700 font-medium">
              ✓ Google account connected
            </p>
          </div>
        )}

        {/* Google Calendar Sync */}
        <Card className="border border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Google Calendar Sync</h3>
              <p className="text-sm text-gray-600 mb-3">
                Import your upcoming events from Google Calendar
              </p>
              <Button
                variant="primary"
                size="sm"
                icon={RefreshCw}
                onClick={handleSyncCalendar}
                loading={syncStatus.calendar === 'syncing'}
              >
                Sync Calendar
              </Button>
              {syncStatus.calendar === 'success' && (
                <p className="text-sm text-green-600 mt-2">✓ Calendar synced successfully!</p>
              )}
              {syncStatus.calendar === 'error' && (
                <p className="text-sm text-red-600 mt-2">✗ Failed to sync calendar</p>
              )}
            </div>
          </div>
        </Card>

        {/* Gmail Event Extraction */}
        <Card className="border border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Gmail Event Extraction</h3>
              <p className="text-sm text-gray-600 mb-3">
                Find events from your recent emails (invitations, meetings, etc.)
              </p>
              <Button
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={handleSyncGmail}
                loading={syncStatus.gmail === 'syncing'}
              >
                Extract from Gmail
              </Button>
              {syncStatus.gmail === 'success' && (
                <p className="text-sm text-green-600 mt-2">✓ Events extracted successfully!</p>
              )}
              {syncStatus.gmail === 'error' && (
                <p className="text-sm text-red-600 mt-2">✗ Failed to extract events</p>
              )}
            </div>
          </div>
        </Card>

        {/* Push Notifications */}
        <Card className="border border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="bg-pink-100 p-3 rounded-xl">
              <Bell className="w-6 h-6 text-pink-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Push Notifications</h3>
              <p className="text-sm text-gray-600 mb-3">
                Get reminders 15 and 7 days before your events
              </p>
              {notificationsEnabled ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <Bell className="w-5 h-5" />
                  <span className="text-sm font-medium">Notifications Enabled</span>
                </div>
              ) : (
                <Button
                  variant="success"
                  size="sm"
                  icon={Bell}
                  onClick={handleEnableNotifications}
                  loading={syncStatus.notifications === 'enabling'}
                >
                  Enable Notifications
                </Button>
              )}
              {syncStatus.notifications === 'success' && (
                <p className="text-sm text-green-600 mt-2">✓ Notifications enabled!</p>
              )}
              {syncStatus.notifications === 'error' && (
                <p className="text-sm text-red-600 mt-2">✗ Failed to enable notifications</p>
              )}
            </div>
          </div>
        </Card>

        {/* Info */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <p className="text-sm text-indigo-800">
            <strong>Note:</strong> You'll need to grant permissions to access your Google Calendar
            and Gmail. Your data stays private and is only used to sync events to your Family Hub.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SyncPanel;
