import React from 'react';
import Modal from './ui/Modal';
import Input, { TextArea, Select } from './ui/Input';
import Button from './ui/Button';

const AddItemModal = ({
  isOpen,
  onClose,
  newEvent,
  setNewEvent,
  familyMembers,
  onSubmit,
  isSubmitting,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Item"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={newEvent.type === 'event' ? 'primary' : 'outline'}
              fullWidth
              onClick={() => setNewEvent({ ...newEvent, type: 'event' })}
            >
              Event
            </Button>
            <Button
              type="button"
              variant={newEvent.type === 'reminder' ? 'secondary' : 'outline'}
              fullWidth
              onClick={() => setNewEvent({ ...newEvent, type: 'reminder' })}
            >
              Reminder
            </Button>
          </div>
        </div>

        {/* Title */}
        <Input
          label="Title"
          type="text"
          placeholder="Enter title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          required
        />

        {/* Description */}
        <TextArea
          label="Description"
          placeholder="Enter description (optional)"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          rows={3}
        />

        {/* Family Member */}
        <Select
          label="Family Member"
          value={newEvent.member}
          onChange={(e) => setNewEvent({ ...newEvent, member: e.target.value })}
          options={familyMembers.map((member) => ({
            value: member.id,
            label: member.name,
          }))}
          placeholder="Select family member"
          required
        />

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <Input
            label="Time"
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
          />
        </div>

        {/* Priority */}
        <Select
          label="Priority"
          value={newEvent.priority}
          onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value })}
          options={[
            { value: 'low', label: 'Low Priority' },
            { value: 'medium', label: 'Medium Priority' },
            { value: 'high', label: 'High Priority' },
          ]}
        />

        {/* Footer Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gradient"
            fullWidth
            loading={isSubmitting}
            disabled={!newEvent.title || !newEvent.member}
          >
            Add Item
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddItemModal;
