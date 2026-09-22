"use client";

export default function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0002] via-black to-black" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#7A0B14" strokeWidth="0.5" />
          </pattern>
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.8" fill="#7A0B14" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
      <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#7A0B14] opacity-[0.06] blur-[120px]" />
      <div className="absolute top-[40%] -left-40 h-[400px] w-[500px] rounded-full bg-[#7A0B14] opacity-[0.04] blur-[100px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-[#7A0B14] opacity-[0.05] blur-[120px]" />
    </div>
  );
}
