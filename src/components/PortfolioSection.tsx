"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".portfolio-eyebrow",
        { opacity: 0, y: 20, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".portfolio-eyebrow",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".portfolio-heading",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.35,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".portfolio-heading",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".portfolio-sub",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".portfolio-sub",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".portfolio-message",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".portfolio-message",
            start: "top 86%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-black py-24 md:py-32">
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E')" }} />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-16 md:mb-24">
          <p className="portfolio-eyebrow font-mono text-xs md:text-sm tracking-[0.35em] text-white/50 uppercase mb-6">
            Built-In Portfolio
          </p>
          <h2 className="portfolio-heading font-pixel text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-white mb-6">
            Don&apos;t just say you did it. Show it.
          </h2>
          <p className="portfolio-sub text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Your Capitol journey becomes a living record of what you actually built, learned, and stuck with.
          </p>
        </div>

        <div className="portfolio-message max-w-3xl mx-auto text-center">
          <p className="font-pixel text-xl md:text-2xl lg:text-3xl text-white mb-4">
            A resume tells people what you claim.
            <br />
            <span className="text-capitol-gold">Your Capitol portfolio shows what you actually did.</span>
          </p>
          <p className="text-sm text-white/50 mb-8">Share it with employers, universities, clients, or collaborators.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Build your portfolio Ã¢â€ â€™
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Explore a profile
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
