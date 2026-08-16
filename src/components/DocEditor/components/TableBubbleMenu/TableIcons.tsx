import React from 'react';

export const RowInsertAboveIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="9" rx="1.5" />
    <path d="M12 8V3" />
    <path d="M9 5l3-3 3 3" />
  </svg>
);

export const RowInsertBelowIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="9" rx="1.5" />
    <path d="M12 16v5" />
    <path d="M9 19l3 3 3-3" />
  </svg>
);

export const ColumnInsertLeftIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="11" y="3" width="9" height="18" rx="1.5" />
    <path d="M8 12H3" />
    <path d="M5 9l-3 3 3 3" />
  </svg>
);

export const ColumnInsertRightIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="3" width="9" height="18" rx="1.5" />
    <path d="M16 12h5" />
    <path d="M19 9l3 3-3 3" />
  </svg>
);

export const RowDeleteIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="7" width="18" height="10" rx="1.5" />
    <path d="M8 12h8" strokeWidth="2.5" />
  </svg>
);

export const ColumnDeleteIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="7" y="3" width="10" height="18" rx="1.5" />
    <path d="M12 8v8" strokeWidth="2.5" />
  </svg>
);

export const CellMergeIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" strokeDasharray="3 3" />
    <path d="M8 9l-3 3 3 3" />
    <path d="M16 9l3 3-3 3" />
    <path d="M5 12h14" />
  </svg>
);

export const CellSplitIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M12 4v16" strokeDasharray="2 2" />
  </svg>
);
