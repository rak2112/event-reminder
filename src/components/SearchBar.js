import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({
  searchTerm,
  onSearchChange,
  selectedMember,
  onMemberSelect,
  familyMembers,
}) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search events and reminders..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#2a2a3e] border border-[#374151] rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Member Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => onMemberSelect(null)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium text-sm ${
            selectedMember === null
              ? 'bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] text-white'
              : 'bg-[#2a2a3e] text-gray-400 hover:bg-[#374151] hover:text-gray-300'
          }`}
        >
          All
        </button>
        {familyMembers.map((member) => (
          <button
            key={member.id}
            onClick={() => onMemberSelect(member.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium text-sm ${
              selectedMember === member.id
                ? 'text-white'
                : 'bg-[#2a2a3e] text-gray-400 hover:text-gray-300'
            }`}
            style={
              selectedMember === member.id
                ? { backgroundColor: member.color }
                : selectedMember !== member.id
                ? { backgroundColor: '#2a2a3e' }
                : {}
            }
          >
            {member.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
