"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { loadProfile, type CapitolProfile } from "@/lib/capitol-session";
import CapitolIcon, { IconName } from "@/components/CapitolIcon";

type NavItem = {
  label: string;
  href: string;
  icon: IconName;
};

type SubItem = {
  label: string;
  href: string;
  icon: IconName;
};

const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/home", icon: "home" },
  { label: "Post", href: "/post", icon: "post" },
  { label: "Rooms", href: "/rooms", icon: "rooms" },
  { label: "Activity", href: "/activity", icon: "activity" },
  { label: "More", href: "#", icon: "more" },
];

const MORE_ITEMS: SubItem[] = [
  { label: "Profile", href: "/profile", icon: "profile" },
  { label: "Portfolio", href: "/portfolio", icon: "portfolio" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "#") return false;
  if (href === "/home") return pathname === "/home" || pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardNavbar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [profile, setProfile] = useState<CapitolProfile | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(loadProfile());
  }, []);

  const [hydratedProfile, setHydratedProfile] = useState<CapitolProfile | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydratedProfile(loadProfile());
  }, []);

  const activeProfile = mounted ? (hydratedProfile ?? profile) : profile;

  const displayName = activeProfile?.display_name?.trim()?.split(/\s+/)[0] ?? "Guest";
  const handle = activeProfile?.username?.trim() ? `@${activeProfile.username.trim()}` : "";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <aside className="capitol-sidebar">
      <div className="capitol-sidebar-inner">
        <Link href="/home" className="capitol-sidebar-brand">
          <div className="capitol-sidebar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="capitol-sidebar-brand-text">Capitol</span>
        </Link>

        <nav className="capitol-sidebar-nav" aria-label="Primary">
          {PRIMARY_NAV.map((item) => {
            const active = isActivePath(pathname, item.href);
            if (item.href === "#") {
              return (
                <div key={`more-${pathname}`} className="capitol-sidebar-item" ref={moreRef}>
                  <button
                    onClick={() => setMoreOpen((v) => !v)}
                    className={`capitol-sidebar-link ${active ? "capitol-sidebar-link-active" : ""}`}
                    aria-expanded={moreOpen}
                  >
                    <CapitolIcon name={item.icon} size={20} />
                    <span>{item.label}</span>
                    <svg className="capitol-sidebar-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto" }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {moreOpen && (
                    <div className="capitol-sidebar-children">
                      {MORE_ITEMS.map((child) => {
                        const childActive = isActivePath(pathname, child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`capitol-sidebar-child ${childActive ? "capitol-sidebar-child-active" : ""}`}
                          >
                            <CapitolIcon name={child.icon} size={18} />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link key={item.href} href={item.href} className={`capitol-sidebar-link ${active ? "capitol-sidebar-link-active" : ""}`}>
                <CapitolIcon name={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="capitol-sidebar-spacer" />

        {mounted ? (
          <div className="capitol-sidebar-footer">
            <Link href="/profile" className="capitol-sidebar-profile">
              <div className="capitol-sidebar-avatar">
                <span className="capitol-sidebar-avatar-text">{initials}</span>
              </div>
              <div className="capitol-sidebar-profile-meta">
                <span className="capitol-sidebar-profile-name">{displayName}</span>
                {handle && <span className="capitol-sidebar-profile-handle">{handle}</span>}
              </div>
            </Link>
            <Link href="/settings" className="capitol-sidebar-settings" aria-label="Settings">
              <CapitolIcon name="settings" size={18} />
            </Link>
          </div>
        ) : (
          <div className="capitol-sidebar-footer" style={{ visibility: "hidden" }}>
            <div className="capitol-sidebar-avatar">
              <span className="capitol-sidebar-avatar-text">{initials}</span>
            </div>
            <div className="capitol-sidebar-profile-meta">
              <span className="capitol-sidebar-profile-name">{displayName}</span>
              {handle && <span className="capitol-sidebar-profile-handle">{handle}</span>}
            </div>
            <Link href="/settings" className="capitol-sidebar-settings" aria-label="Settings">
              <CapitolIcon name="settings" size={18} />
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
