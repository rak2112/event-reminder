import React from 'react';
import { Users, Plus, Image, LogOut, Settings } from 'lucide-react';
import Button from './ui/Button';

const Header = ({ user, onSettingsClick, onImageUploadClick, onAddClick, onSignOut }) => {
  return (
    <header className="bg-[#1a1a2e] border-b border-[#2a2a3e]">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and User Info */}
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-[#14b8a6] to-[#0ea5e9] p-2 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Family Hub
              </h1>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="md"
              icon={Settings}
              onClick={onSettingsClick}
              className="hidden sm:flex border-gray-600 text-gray-300 hover:bg-[#2a2a3e]"
            >
              Settings
            </Button>

            <Button
              variant="secondary"
              size="md"
              icon={Image}
              onClick={onImageUploadClick}
              className="bg-[#2a2a3e] text-gray-300 hover:bg-[#374151]"
            >
              <span className="hidden sm:inline">Upload</span>
            </Button>

            <Button
              variant="gradient"
              size="md"
              icon={Plus}
              onClick={onAddClick}
              className="bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] hover:from-[#0d9488] hover:to-[#0284c7]"
            >
              <span className="hidden sm:inline">Add New</span>
            </Button>

            <Button
              variant="ghost"
              size="md"
              icon={LogOut}
              onClick={onSignOut}
              className="text-gray-400 hover:text-red-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
