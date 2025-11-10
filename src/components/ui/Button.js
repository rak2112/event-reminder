import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#14b8a6] text-white hover:bg-[#0d9488] focus:ring-[#14b8a6]',
    secondary: 'bg-[#2a2a3e] text-gray-300 hover:bg-[#374151] focus:ring-[#374151]',
    success: 'bg-[#22c55e] text-white hover:bg-[#16a34a] focus:ring-[#22c55e]',
    danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-[#ef4444]',
    outline: 'bg-transparent border-2 border-[#374151] text-gray-300 hover:bg-[#2a2a3e] hover:border-[#4b5563] focus:ring-[#14b8a6]',
    ghost: 'bg-transparent text-gray-400 hover:bg-[#2a2a3e] hover:text-gray-300 focus:ring-[#14b8a6]',
    gradient: 'bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] text-white hover:from-[#0d9488] hover:to-[#0284c7] focus:ring-[#14b8a6]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {Icon && !loading && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
};

export default Button;
