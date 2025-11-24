import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  checked, 
  onChange, 
  label, 
  description,
  disabled = false 
}) => {
  return (
    <label className={`flex items-start ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`
          w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
          ${checked ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}>
          <div className={`
            absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full 
            transition-transform duration-200 ease-in-out
            ${checked ? 'transform translate-x-5' : 'transform translate-x-0'}
          `} />
        </div>
      </div>
      <div className="ml-3">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
};