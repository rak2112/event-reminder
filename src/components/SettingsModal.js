import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';

const SettingsModal = ({
  isOpen,
  onClose,
  editingMembers,
  onUpdateMemberName,
  onUpdateMemberColor,
  onAddMember,
  onRemoveMember,
  onSave,
  isSaving,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Family Settings"
      size="lg"
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          Customize your family member names and colors
        </p>

        {/* Member List */}
        <div className="space-y-3">
          {editingMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {/* Color Picker */}
              <div className="relative">
                <input
                  type="color"
                  value={member.color}
                  onChange={(e) => onUpdateMemberColor(member.id, e.target.value)}
                  className="w-14 h-14 rounded-lg cursor-pointer border-2 border-white shadow-md"
                />
              </div>

              {/* Name Input */}
              <input
                type="text"
                value={member.name}
                onChange={(e) => onUpdateMemberName(member.id, e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Member name"
              />

              {/* Remove Button */}
              <Button
                variant="danger"
                size="md"
                onClick={() => onRemoveMember(member.id)}
                disabled={editingMembers.length <= 1}
                icon={Trash2}
              >
                <span className="hidden sm:inline">Remove</span>
              </Button>
            </div>
          ))}
        </div>

        {/* Add Member Button */}
        <Button
          variant="success"
          fullWidth
          icon={Plus}
          onClick={onAddMember}
        >
          Add Family Member
        </Button>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            fullWidth
            loading={isSaving}
            onClick={onSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
