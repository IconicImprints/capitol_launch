"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  {
    label: "Product",
    items: [
      {
        title: "Auto-Match",
        desc: "Meet your people.",
        id: "automatch",
        href: "#",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white">
            <circle cx="12" cy="5" r="2.5" />
            <circle cx="5" cy="19" r="2.5" />
            <circle cx="19" cy="19" r="2.5" />
            <path d="M12 7.5v4.5m0 0l-4 4m4-4l4 4m-9-7.5l4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        detail: {
          title: "Auto-Match",
          tagline: "Meet your people.",
          text: "Find people who match your goals, interests, and ambition Ã¢â‚¬â€ then start building together.",
        },
      },
      {
        title: "Rooms",
        desc: "Lock in together.",
        id: "rooms",
        href: "#",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white">
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="M3 10h18" strokeLinecap="round" />
            <path d="M8 15h.01M12 15h.01M16 15h.01" strokeLinecap="round" />
          </svg>
        ),
        detail: {
          title: "Rooms",
          tagline: "Lock in together.",
          text: "Join small accountability networks where everyone is working toward something.",
        },
      },
      {
        title: "Boards",
        desc: "Track the grind.",
        id: "boards",
        href: "#",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white">
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
          </svg>
        ),
        detail: {
          title: "Boards",
          tagline: "Track the grind.",
          text: "Turn goals into missions, submit proof, earn XP, and see your progress.",
        },
      },
      {
        title: "Leaderboards",
        desc: "Climb the ranks.",
        id: "leaderboards",
        href: "#",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white">
            <path d="M6 8h12M6 12h12M6 16h8" strokeLinecap="round" />
            <path d="M3 4l3 8 3-6 3 4 3-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        detail: {
          title: "Leaderboards",
          tagline: "Climb the ranks.",
          text: "Compete with your network, stay consistent, and see how you stack up.",
        },
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        title: "News",
        desc: "What's happening.",
        id: "news",
        href: "/news",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white">
            <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" />
            <circle cx="8" cy="6" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="16" cy="10" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="10" cy="18" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        ),
        detail: {
          title: "News",
          tagline: "What's happening.",
          text: "Coming soon.",
        },
      },
      {
        title: "Guides",
        desc: "Get better. Faster.",
        id: "guides",
        href: "#",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white">
            <path d="M4 4.5A2.5 2.5 0 016.5 2H18l.5.5v19l-.5.5h-11A2.5 2.5 0 014 19.5v-15z" />
            <path d="M8 7h8M8 11h8M8 15h5" strokeLinecap="round" />
          </svg>
        ),
        detail: {
          title: "Guides",
          tagline: "Get better. Faster.",
          text: "Practical resources for building better habits and networks.",
          cta: "Read Guides Ã¢â€ â€™",
        },
      },
      {
        title: "Community",
        desc: "Built by the people.",
        id: "community",
        href: "#",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white">
            <circle cx="9" cy="7" r="3" />
            <circle cx="17" cy="9" r="2.5" />
            <path d="M3 21v-2a4 4 0 014-4h5a4 4 0 014 4v2" strokeLinecap="round" />
            <path d="M17 17v-2a3 3 0 00-2-2.83" strokeLinecap="round" />
          </svg>
        ),
        detail: {
          title: "Community",
          tagline: "Built by the people.",
          text: "Explore what people are building and working toward.",
          cta: "Join our Discord",
          ctaHref: "https://discord.gg/capitol",
        },
      },
    ],
  },
  {
    label: "Company",
    items: [
      {
        title: "About us",
        desc: "Why we started.",
        id: "about",
        href: "/about",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        detail: {
          title: "About us",
          tagline: "Why we started.",
          text: "The internet gave us connections. We're building the network.",
          cta: "About Capitol Ã¢â€ â€™",
        },
      },
      {
        title: "Team",
        desc: "Meet the builders.",
        id: "team",
        href: "#",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white">
            <circle cx="9" cy="7" r="3" />
            <circle cx="17" cy="9" r="2.5" />
            <path d="M3 21v-2a4 4 0 014-4h5a4 4 0 014 4v2" strokeLinecap="round" />
          </svg>
        ),
        detail: {
          title: "Team",
          tagline: "Meet the builders.",
          text: "Meet the people building Capitol.",
          cta: "Meet the Team Ã¢â€ â€™",
        },
      },
      {
        title: "Jobs",
        desc: "Join the team.",
        id: "jobs",
        href: "/jobs",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white">
            <rect x="2" y="7" width="20" height="14" rx="3" />
            <path d="M8 7V5a4 4 0 018 0v2" strokeLinecap="round" />
          </svg>
        ),
        detail: {
          title: "Jobs",
          tagline: "Join the team.",
          text: "Join the team and help shape the future of networking.",
          cta: "View Openings Ã¢â€ â€™",
        },
      },
      {
        title: "Contact",
        desc: "Get in touch.",
        id: "contact",
        href: "/contact",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white">
            <rect x="2" y="4" width="20" height="16" rx="3" />
            <path d="M2 7l10 7 10-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        detail: {
          title: "Contact",
          tagline: "Get in touch.",
          text: "Email us at capitolhelp@gmail.com.",
          cta: "Contact Us Ã¢â€ â€™",
        },
      },
    ],
  },
];

const DEFAULT_SELECTION: Record<string, string> = {
  Product: "automatch",
  Resources: "news",
  Company: "about",
};

export default function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>({
    Product: DEFAULT_SELECTION.Product,
    Resources: DEFAULT_SELECTION.Resources,
    Company: DEFAULT_SELECTION.Company,
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const openDropdown = (label: string) => {
    setActiveDropdown(label);
    setSelectedItems((prev) => ({
      ...prev,
      [label]: DEFAULT_SELECTION[label],
    }));
  };

  const selectItem = (label: string, id: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [label]: id,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentNav = NAV_ITEMS.find((n) => n.label === activeDropdown);
  const selectedId = activeDropdown ? selectedItems[activeDropdown] : null;
  const selectedItem = currentNav?.items.find((i) => i.id === selectedId);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        ref={navRef}
        className="mx-auto max-w-7xl px-6 pt-5"
      >
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/capitol-logo.png" alt="Capitol" width={28} height={28} className="h-7 w-auto" priority />
              <span className="text-base font-semibold tracking-tight text-white">Capitol</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() =>
                    activeDropdown === item.label
                      ? setActiveDropdown(null)
                      : openDropdown(item.label)
                  }
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    activeDropdown === item.label ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                  <svg viewBox="0 0 16 16" fill="none" className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`}>
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden md:block">
            <a
              href="#"
              className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Get started
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-white/80 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M3 8h18M3 14h18" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {activeDropdown && (
          <div className="fixed inset-x-0 top-[76px] z-40 px-6">
            <div className="mx-auto max-w-7xl">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-2xl shadow-black/60 backdrop-blur-2xl animate-in">
                <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
                  <div className="border-b md:border-b-0 md:border-r border-white/5 p-2">
                    <div className="grid grid-cols-1">
                      {currentNav?.items.map((item) => {
                        const isActive = selectedId === item.id;
                        return (
                          <button
                            key={item.title}
                            type="button"
                            onClick={() => selectItem(activeDropdown, item.id)}
                            className={`group flex items-start gap-3.5 rounded-xl px-4 py-3.5 text-left transition ${
                              isActive ? "bg-white/5" : "hover:bg-white/5"
                            }`}
                          >
                            <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 transition ${
                              isActive ? "bg-white/10 text-white ring-white/10" : "bg-white/5 text-white/90 ring-white/10"
                            }`}>
                              {item.icon}
                            </span>
                            <span>
                              <span className={`block text-sm font-medium ${
                                isActive ? "text-white" : "text-white/95"
                              }`}>{item.title}</span>
                              <span className="mt-0.5 block text-xs leading-relaxed text-white/50">{item.desc}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-6">
                    {selectedItem?.detail && (
                      <div className="flex h-full flex-col justify-between rounded-xl bg-white/[0.03] p-5 ring-1 ring-white/[0.08]">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-widest text-white/40 mb-2">{activeDropdown}</p>
                          <h3 className="text-lg font-semibold text-white mb-2">{selectedItem.detail.title}</h3>
                          <p className="text-sm leading-relaxed text-white/60">{selectedItem.detail.text}</p>
                        </div>
                        {selectedItem.detail.cta && (
                          <Link
                            href={selectedItem.detail.ctaHref || selectedItem.href || "#"}
                            target={selectedItem.detail.ctaHref?.startsWith("http") ? "_blank" : undefined}
                            rel={selectedItem.detail.ctaHref?.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {selectedItem.detail.cta}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[64px] z-40 bg-black/95 backdrop-blur-2xl">
          <div className="flex flex-col px-6 py-8">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="border-b border-white/5 last:border-0">
                <button
                  onClick={() =>
                    activeDropdown === item.label
                      ? setActiveDropdown(null)
                      : openDropdown(item.label)
                  }
                  className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-white/90"
                >
                  {item.label}
                  <svg viewBox="0 0 16 16" fill="none" className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`}>
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {activeDropdown === item.label && (
                  <div className="pb-4 space-y-3">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.title}
                        href={sub.href || "#"}
                        className="block rounded-xl px-4 py-3 hover:bg-white/5"
                        onClick={() => {
                          setActiveDropdown(null);
                          setMobileOpen(false);
                        }}
                      >
                        <span className="block text-sm font-medium text-white/90">{sub.title}</span>
                        <span className="mt-0.5 block text-xs text-white/50">{sub.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-6">
              <a
                href="#"
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
