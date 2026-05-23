import React from "react";

export function FlagBR({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="32" fill="#4CAF50" />
      <path d="M32 14L52 32L32 50L12 32L32 14Z" fill="#FFEB3B" />
      <circle cx="32" cy="32" r="10" fill="#2196F3" />
      <path d="M24 32C28 28 36 28 40 32" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function FlagUS({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="32" fill="#F44336" />
      <path d="M0 24H64M0 32H64M0 40H64" stroke="white" strokeWidth="4" />
      <rect x="0" y="0" width="32" height="32" rx="0" fill="#3F51B5" />
      <path fillRule="evenodd" clipRule="evenodd" d="M32 0H0V32H32V0Z" fill="#3F51B5" />
      <circle cx="8" cy="8" r="1.5" fill="white" />
      <circle cx="16" cy="8" r="1.5" fill="white" />
      <circle cx="24" cy="8" r="1.5" fill="white" />
      <circle cx="8" cy="16" r="1.5" fill="white" />
      <circle cx="16" cy="16" r="1.5" fill="white" />
      <circle cx="24" cy="16" r="1.5" fill="white" />
      <circle cx="8" cy="24" r="1.5" fill="white" />
      <circle cx="16" cy="24" r="1.5" fill="white" />
      <circle cx="24" cy="24" r="1.5" fill="white" />
    </svg>
  );
}

export function FlagES({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="32" fill="#F44336" />
      <rect x="0" y="16" width="64" height="32" fill="#FFEB3B" />
      <rect x="18" y="24" width="12" height="16" rx="2" fill="#F44336" />
      <rect x="20" y="26" width="8" height="12" fill="#FFEB3B" />
    </svg>
  );
}
