"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function NewsPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".news-hero-eyebrow",
        { opacity: 0, y: 20, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 0.2, ease: "power3.out" }
      );
      gsap.fromTo(
        ".news-hero-heading",
        { opacity: 0, y: 40, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, delay: 0.4, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative min-h-screen">
      <section ref={heroRef} className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0002] via-black to-black" />
        <div className="absolute top-0 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#7A0B14] opacity-[0.07] blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="news-hero-eyebrow font-mono text-xs md:text-sm tracking-[0.35em] text-white/50 uppercase mb-6">
            Capitol News
          </p>
          <h1 className="news-hero-heading font-pixel text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white mb-6">
            Coming soon.
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            We&apos;re cooking up stories, updates, and behind-the-scenes looks at what we&apos;re building.
          </p>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-3xl border border-white/10 bg-black/70 p-10 md:p-14 backdrop-blur-2xl">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 text-capitol-gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <h2 className="font-pixel text-2xl md:text-3xl text-white mb-4">Stay tuned.</h2>
            <p className="text-white/70 leading-relaxed mb-8">
              News, drops, and announcements are on the way. For now, join our Discord to stay in the loop.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://discord.gg/capitol"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Join our Discord
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Back to Capitol
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
