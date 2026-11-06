import type { ReactNode } from "react";
import type { IconName } from "../../types";

const paths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4m8-4v4M3 10h18" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.7-4.2 3.4-6 8-6s7.3 1.8 8 6" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  sliders: (
    <>
      <path d="M4 7h10m4 0h2M4 17h2m4 0h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </>
  ),
  droplet: <path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z" />,
  bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />,
  sparkles: (
    <>
      <path d="m12 3 1.3 4.7L18 9l-4.7 1.3L12 15l-1.3-4.7L6 9l4.7-1.3L12 3Z" />
      <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
    </>
  ),
  paint: (
    <>
      <path d="M4 4h12v6H4zM16 7h3v5h-7v3" />
      <rect x="10" y="14" width="4" height="8" rx="2" />
    </>
  ),
  hammer: (
    <>
      <path d="m14 4 6 6-3 3-6-6zM12 8 4 16" />
      <path d="m3 17 4 4" />
    </>
  ),
  snow: (
    <>
      <path d="M12 2v20M4 7l16 10M20 7 4 17" />
      <path d="m9 4 3 3 3-3M9 20l3-3 3 3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2 4 5v6c0 5.5 3 9 8 11 5-2 8-5.5 8-11V5l-8-3Z" />
      <path d="m8 12 2.5 2.5L16 9" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  mic: (
    <>
      <rect x="8" y="3" width="8" height="13" rx="4" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
    </>
  ),
  phone: <path d="M7 3 4 5c-2 2 3 9 6 12s10 8 12 6l2-3-6-4-2 2c-2-1-6-5-7-7l2-2-4-6Z" />,
  sos: (
    <>
      <path d="M12 3 2 21h20L12 3Z" />
      <path d="M12 9v5m0 3v.1" />
    </>
  ),
  star: <path d="m12 2 3 6 7 .9-5 4.8 1.3 6.8L12 17l-6.3 3.5L7 13.7 2 8.9 9 8l3-6Z" />,
  check: <path d="m5 12 4 4L19 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  chat: (
    <>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.5-5A8 8 0 1 1 21 15Z" />
      <path d="M8 11h8M8 15h5" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="12" rx="3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  camera: (
    <>
      <path d="M4 7h4l2-3h4l2 3h4v13H4z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v13m-5-5 5 5 5-5M4 21h16" />
    </>
  ),
  print: (
    <>
      <path d="M7 9V3h10v6M7 18H4V9h16v9h-3" />
      <path d="M7 14h10v7H7z" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 6h16v15H3z" />
      <path d="M3 6c0-2 1-3 3-3h11v3M14 11h7v5h-7z" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="14" rx="3" />
      <path d="M9 7V4h6v3m-12 5h18M10 12v2h4v-2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10m6 10V4m6 16v-7m5 7H2" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  volume: (
    <>
      <path d="M5 10h4l5-4v12l-5-4H5z" />
      <path d="M17 9c1.7 1.7 1.7 4.3 0 6" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </>
  ),
  qr: (
    <>
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M14 14h2v2h-2zM18 14h3v3h-3zM14 18h3v3h-3zM20 20h1v1h-1z" />
    </>
  ),
  filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  refresh: (
    <>
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </>
  ),
  trash: (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  external: (
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  truck: (
    <>
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </>
  ),
  recycle: (
    <>
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.2a1.8 1.8 0 0 0 1.56-2.65L17.5 11" />
      <path d="m14 2-3 5 3 5" />
      <path d="m2 16 3 3-3 3" />
      <path d="m17 7 3-3 3 3" />
    </>
  ),
  guard: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </>
  ),
};

export function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.home}
    </svg>
  );
}
