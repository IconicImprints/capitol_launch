"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-hero-eyebrow",
        { opacity: 0, y: 20, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 0.2, ease: "power3.out" }
      );
      gsap.fromTo(
        ".about-hero-heading",
        { opacity: 0, y: 40, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, delay: 0.4, ease: "power3.out" }
      );
      gsap.fromTo(
        ".about-hero-sub",
        { opacity: 0, y: 24, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 0.7, ease: "power3.out" }
      );
      gsap.fromTo(
        ".about-body",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.9, ease: "power3.out" }
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
          <p className="about-hero-eyebrow font-mono text-xs md:text-sm tracking-[0.35em] text-white/50 uppercase mb-6">
            About Capitol
          </p>
          <h1 className="about-hero-heading font-pixel text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white mb-6">
            The internet gave us connections. We&apos;re building the network.
          </h1>
          <p className="about-hero-sub text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            capitol is built for people who want to <span className="text-capitol-gold">actually do things</span>.
          </p>
        </div>
      </section>

      <section ref={bodyRef} className="relative pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="about-body rounded-3xl border border-white/10 bg-black/70 p-8 md:p-12 backdrop-blur-2xl space-y-6 text-white/80 leading-relaxed">
            <p>
              Start a project. Learn a skill. Build a business. Get fit. Create something you&apos;re proud of.
            </p>
            <p>
              The problem? Doing it alone gets old fast.
            </p>
            <p>
              Capitol helps you find the right people, build accountability, and turn goals into something you actually show up for.
            </p>
            <p className="text-white/50">
              No endless scrolling. No fake networking. No collecting followers just to watch your number go up.
            </p>
            <p className="text-white text-lg font-medium">
              Find your people. Pick a goal. Lock in.
            </p>
            <p className="text-capitol-gold font-pixel text-xl">
              That&apos;s Capitol.
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Join the team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
