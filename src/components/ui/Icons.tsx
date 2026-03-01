/* ─── SVG Icon Set for Zahir Digital ─── */
/* Clean, institutional icons — no emojis */

import React from "react";

interface IconProps {
  size?: number;
  className?: string;
}

function wrap(children: React.ReactNode, { size = 20, className = "" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

/* ─── Navigation & General ─── */
export const IconMosque = (props: IconProps) =>
  wrap(
    <>
      <path d="M12 2C8 6 4 8 4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8c0-4-4-6-8-10z" />
      <path d="M9 22v-4a3 3 0 016 0v4" />
      <line x1="12" y1="2" x2="12" y2="5" />
    </>,
    props
  );

export const IconClock = (props: IconProps) =>
  wrap(
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>,
    props
  );

export const IconCalendar = (props: IconProps) =>
  wrap(
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>,
    props
  );

export const IconMoon = (props: IconProps) =>
  wrap(<path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />, props);

export const IconSun = (props: IconProps) =>
  wrap(
    <>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </>,
    props
  );

export const IconSunrise = (props: IconProps) =>
  wrap(
    <>
      <path d="M17 18a5 5 0 00-10 0" />
      <line x1="12" y1="9" x2="12" y2="2" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
      <line x1="23" y1="22" x2="1" y2="22" />
      <polyline points="8 6 12 2 16 6" />
    </>,
    props
  );

export const IconSunset = (props: IconProps) =>
  wrap(
    <>
      <path d="M17 18a5 5 0 00-10 0" />
      <line x1="12" y1="2" x2="12" y2="9" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
      <line x1="23" y1="22" x2="1" y2="22" />
      <polyline points="16 6 12 10 8 6" />
    </>,
    props
  );

export const IconCloud = (props: IconProps) =>
  wrap(<path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />, props);

export const IconCloudSun = (props: IconProps) =>
  wrap(
    <>
      <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M17.66 6.34l1.41-1.41M6.34 17.66l-1.41 1.41M2 12h2M6.34 6.34L4.93 4.93" />
      <circle cx="12" cy="10" r="4" />
      <path d="M16 18H8a4 4 0 010-8h.5" />
    </>,
    props
  );

/* ─── Feature Icons ─── */
export const IconMegaphone = (props: IconProps) =>
  wrap(
    <>
      <path d="M3 11l18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
    </>,
    props
  );

export const IconWallet = (props: IconProps) =>
  wrap(
    <>
      <rect x="2" y="5" width="20" height="16" rx="2" />
      <path d="M2 10h20" />
      <circle cx="17" cy="15" r="1" />
    </>,
    props
  );

export const IconClipboard = (props: IconProps) =>
  wrap(
    <>
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="12" y2="16" />
    </>,
    props
  );

export const IconChart = (props: IconProps) =>
  wrap(
    <>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </>,
    props
  );

export const IconSend = (props: IconProps) =>
  wrap(
    <>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </>,
    props
  );

export const IconPlus = (props: IconProps) =>
  wrap(
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>,
    props
  );

export const IconEdit = (props: IconProps) =>
  wrap(
    <>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>,
    props
  );

export const IconTrash = (props: IconProps) =>
  wrap(
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </>,
    props
  );

export const IconCheck = (props: IconProps) =>
  wrap(<polyline points="20 6 9 17 4 12" />, props);

export const IconArrowRight = (props: IconProps) =>
  wrap(
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>,
    props
  );

export const IconUser = (props: IconProps) =>
  wrap(
    <>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>,
    props
  );

export const IconUserX = (props: IconProps) =>
  wrap(
    <>
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="18" y1="8" x2="23" y2="13" />
      <line x1="23" y1="8" x2="18" y2="13" />
    </>,
    props
  );

export const IconShield = (props: IconProps) =>
  wrap(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, props);

export const IconBroom = (props: IconProps) =>
  wrap(
    <>
      <path d="M12 2L8 14h8L12 2z" />
      <path d="M6 14c0 4 2.5 8 6 8s6-4 6-8H6z" />
    </>,
    props
  );

export const IconWrench = (props: IconProps) =>
  wrap(
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />,
    props
  );

export const IconGrid = (props: IconProps) =>
  wrap(
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </>,
    props
  );

export const IconHome = (props: IconProps) =>
  wrap(
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>,
    props
  );

export const IconTv = (props: IconProps) =>
  wrap(
    <>
      <rect x="2" y="7" width="20" height="15" rx="2" />
      <polyline points="17 2 12 7 7 2" />
    </>,
    props
  );

export const IconRefresh = (props: IconProps) =>
  wrap(
    <>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </>,
    props
  );

export const IconCreditCard = (props: IconProps) =>
  wrap(
    <>
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </>,
    props
  );

export const IconLink = (props: IconProps) =>
  wrap(
    <>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </>,
    props
  );

export const IconImage = (props: IconProps) =>
  wrap(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </>,
    props
  );

export const IconFilter = (props: IconProps) =>
  wrap(<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />, props);

export const IconActivity = (props: IconProps) =>
  wrap(<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />, props);
