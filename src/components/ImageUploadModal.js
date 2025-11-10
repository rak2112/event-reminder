import React from 'react';
import { Upload } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';

const ImageUploadModal = ({ isOpen, onClose, onUpload, isUploading }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Screenshot"
      size="md"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl mb-4">
            <Upload className="w-16 h-16 text-indigo-600 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">
              Upload a screenshot and AI will extract the event details automatically.
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, and other image formats
            </p>
          </div>

          {/* File Input */}
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer cursor-pointer"
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Footer */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageUploadModal;
