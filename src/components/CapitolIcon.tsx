"use client";

import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function icon(paths: React.ReactNode, props: IconProps = {}) {
  const { size = 20, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {paths}
    </svg>
  );
}

export const CapitolIcons = {
  home: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <path d="M3 9.75L12 3l9 6.75V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.75z" />
        <path d="M9 21V12h6v9" />
      </React.Fragment>,
      props
    ),

  post: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <path d="M12 20.25h9" />
        <path d="M16.5 3.75a2.25 2.25 0 0 1 3.75 2.25l-7.5 10.5-4.5 1.5 1.5-4.5 7.5-10.5z" />
      </React.Fragment>,
      props
    ),

  rooms: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </React.Fragment>,
      props
    ),

  missions: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </React.Fragment>,
      props
    ),

  activity: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 16 14" />
      </React.Fragment>,
      props
    ),

  more: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </React.Fragment>,
      props
    ),

  profile: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </React.Fragment>,
      props
    ),

  portfolio: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </React.Fragment>,
      props
    ),

  settings: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33-1.82V9a1.65 1.65 0 0 0 1.51-1H21a2 2 0 0 1 2-2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51-1z" />
      </React.Fragment>,
      props
    ),

  streak: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </React.Fragment>,
      props
    ),

  proof: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </React.Fragment>,
      props
    ),

  xp: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M6 12h12" />
      </React.Fragment>,
      props
    ),

  premium: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M6 12h12" />
      </React.Fragment>,
      props
    ),

  crown: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <path d="M2 20h20" />
        <path d="M5 20l3-12 4 6 2-4 2 4 4-6 3 12H5z" />
      </React.Fragment>,
      props
    ),

  leaderboard: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <path d="M6 8h12M6 12h12M6 16h8" />
        <path d="M3 4l3 8 3-6 3 4 3-6" />
      </React.Fragment>,
      props
    ),

  calendar: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </React.Fragment>,
      props
    ),

  check: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <polyline points="20 6 9 17 4 12" />
      </React.Fragment>,
      props
    ),

  lock: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </React.Fragment>,
      props
    ),

  trophy: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </React.Fragment>,
      props
    ),

  goal: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </React.Fragment>,
      props
    ),

  create: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </React.Fragment>,
      props
    ),

  edit: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </React.Fragment>,
      props
    ),

  delete: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </React.Fragment>,
      props
    ),

  search: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </React.Fragment>,
      props
    ),

  notifications: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </React.Fragment>,
      props
    ),

  friends: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </React.Fragment>,
      props
    ),

  bets: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 10 10" />
        <path d="M12 12l4-4" />
      </React.Fragment>,
      props
    ),

  achievements: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <circle cx="12" cy="8" r="7" />
        <polyline points="10.5 21 12 17.5 13.5 21" />
        <path d="M9 10.5a3 3 0 0 1 6 0c0 1.5-2.5 2.5-3 3" />
      </React.Fragment>,
      props
    ),

  back: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </React.Fragment>,
      props
    ),

  close: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </React.Fragment>,
      props
    ),

  menu: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </React.Fragment>,
      props
    ),

  chevronDown: (props: IconProps = {}) =>
    icon(
      <React.Fragment>
        <polyline points="6 9 12 15 18 9" />
      </React.Fragment>,
      props
    ),
};

export type IconName = keyof typeof CapitolIcons;

export default function CapitolIcon({
  name,
  size = 20,
  className,
  ...rest
}: {
  name: IconName;
  size?: number;
  className?: string;
} & React.SVGProps<SVGSVGElement>) {
  const Component = CapitolIcons[name];
  if (!Component) return null;
  return <Component size={size} className={className} {...rest} />;
}
