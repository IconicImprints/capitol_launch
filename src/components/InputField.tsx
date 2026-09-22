import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showToggle?: boolean;
  toggleVisibility?: () => void;
  isPasswordVisible?: boolean;
  className?: string;
  min?: string;
  max?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  showToggle = false,
  toggleVisibility,
  isPasswordVisible = false,
  className = "",
  min,
  max,
}) => {
  const inputType = showToggle && isPasswordVisible ? "text" : type;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          className={`w-full rounded-md border border-gray-600 bg-surface-elevated px-3 py-2 text-foreground placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-capitol-gold focus-visible:ring-offset-2 ${error ? "border-red-500" : ""} ${className}`}
        />
        {showToggle && toggleVisibility && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute inset-y-0 right-2 flex items-center text-sm text-foreground/70"
          >
            {isPasswordVisible ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
