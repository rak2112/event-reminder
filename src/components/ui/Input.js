import React from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-[#374151] focus:ring-[#14b8a6]'
          } bg-[#2a2a3e] text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export const TextArea = ({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-2.5 border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-[#374151] focus:ring-[#14b8a6]'
        } bg-[#2a2a3e] text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none resize-none`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-[#374151] focus:ring-[#14b8a6]'
        } bg-[#2a2a3e] text-white rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none`}
        {...props}
      >
        <option value="" className="bg-[#2a2a3e]">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#2a2a3e]">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
