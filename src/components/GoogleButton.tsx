import React from "react";

interface GoogleButtonProps {
  onClick?: () => void;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-600 bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground hover:bg-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-capitol-gold focus-visible:ring-offset-2"
    >
      {/* Google SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 533.5 544.3"
        className="h-5 w-5"
      >
        <path
          fill="#4285F4"
          d="M533.5 278.4c0-17.9-1.6-35.2-4.5-52H272v98.5h147.6c-6.4 34.5-25.6 63.8-54.5 83.3v69h88c51.5-47.5 81-117.5 81-198.8z"
        />
        <path
          fill="#34A853"
          d="M272 544.3c73.5 0 135.2-24.5 180.3-66.6l-88-69c-24.3 16.4-55.5 26-92.3 26-71 0-131.1-47.9-152.7-112.4h-90v70.8c45.6 90.2 139.2 150.2 242.7 150.2z"
        />
        <path
          fill="#FBBC05"
          d="M119.3 322.3c-10.5-31.1-10.5-64.5 0-95.6v-70.8h-90c-39.5 78.2-39.5 170.8 0 249z"
        />
        <path
          fill="#EA4335"
          d="M272 107.9c39.9-.6 78.5 14.9 107.5 43.2l80.6-80.6C406 22.3 340.9-1.1 272 0 168.5 0 74.9 60 29.3 150.2l90 70.8C140.9 155.8 201 107.9 272 107.9z"
        />
      </svg>
      <span>Continue with Google</span>
    </button>
  );
};
