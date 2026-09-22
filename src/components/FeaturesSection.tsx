"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    title: "Accountability Rooms",
    desc: "Small groups of people working toward their own goals, together. Stay accountable without the noise of massive communities.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <path d="M6 8.5v3.5a4 4 0 004 4 4 4 0 004-4V8.5M8 11h8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Proof over promises",
    desc: "Show what you actually accomplished. Submit proof, track your work, and make progress visible.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "XP & streaks",
    desc: "Turn consistency into progression. Earn XP, protect your streak, and keep your momentum alive.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M12 3l1.5 4.5h4.5l-3.5 3 1.5 4.5L12 11.5l-4 4 1.5-4.5-3.5-3h4.5z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Compete with your network",
    desc: "See how you're progressing alongside others and turn consistency into friendly competition.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M6 8h12M6 12h12M6 16h8" strokeLinecap="round" />
        <path d="M3 4l3 8 3-6 3 4 3-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Goals that become action",
    desc: "Break ambitions into concrete missions and give yourself something measurable to complete.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Build your network",
    desc: "Find people who are building, learning, creating, and improving — and grow alongside them.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <path d="M6 8.5v3.5a4 4 0 004 4 4 4 0 004-4V8.5M8 11h8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".features-eyebrow",
        { opacity: 0, y: 20, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-eyebrow",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".features-heading",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.35,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-heading",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".features-sub",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-sub",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black"
      aria-labelledby="features-heading"
    >
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E')" }} />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center mb-16 md:mb-24">
          <p className="features-eyebrow font-mono text-xs md:text-sm tracking-[0.35em] text-white/50 uppercase mb-6">
            The Accountability Network
          </p>
          <h2
            id="features-heading"
            className="features-heading font-pixel text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-white mb-6"
          >
            Everything you need to keep moving.
          </h2>
          <p className="features-sub text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Goals, accountability, proof, and progression — brought together in one network built around actually getting things done.
          </p>
        </div>

        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="feature-card group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:-translate-y-1"
            >
              <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/80 transition group-hover:border-white/20 group-hover:text-white">
                {feature.icon}
              </span>
              <h3 className="font-pixel text-base md:text-lg text-white mb-2.5">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
