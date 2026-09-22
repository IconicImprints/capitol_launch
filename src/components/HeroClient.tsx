"use client";


import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-eyebrow",
        { opacity: 0, y: 20, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 0.3, ease: "power3.out" }
      );
      gsap.fromTo(
        ".hero-heading",
        { opacity: 0, y: 40, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, delay: 0.6, ease: "power3.out" }
      );
      gsap.fromTo(
        ".hero-subtext",
        { opacity: 0, y: 24, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 1, ease: "power3.out" }
      );
      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.3, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black pt-20"
      aria-label="Hero"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 max-w-6xl mx-auto">
        <p className="hero-eyebrow text-xs md:text-sm font-mono tracking-[0.35em] text-white/50 uppercase mb-8 md:mb-12">
          Capitol
        </p>

        <h1 className="hero-heading font-pixel text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[7rem] leading-[1.1] tracking-tight text-white mb-6 md:mb-8">
          <span className="block">find people who</span>
          <span className="block text-capitol-gold">won&apos;t let you quit.</span>
        </h1>

        <p className="hero-subtext font-pixel text-sm sm:text-base md:text-lg text-white/80 mb-3 tracking-wide">
          accountability rooms for ambitious people
        </p>

        <p className="text-base md:text-lg text-white/50 max-w-xl leading-relaxed mb-10 md:mb-12">
          a gamified productivity and accountability platform Ã¢â‚¬â€ build habits, complete goals, and grow through structured accountability rooms, xp systems, and leaderboards.
        </p>

        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <a
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
          >
            Join Capitol
          </a>
          <a
            href="#"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/>
            </svg>
            Join our Discord
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent" />
    </section>
  );
}
