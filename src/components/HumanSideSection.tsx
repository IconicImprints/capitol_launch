"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HumanSideSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".human-eyebrow",
        { opacity: 0, y: 20, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".human-eyebrow",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".human-heading",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.35,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".human-heading",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".human-sub",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".human-sub",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".human-video-wrapper",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".human-video-wrapper",
            start: "top 84%",
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
          <p className="human-eyebrow font-mono text-xs md:text-sm tracking-[0.35em] text-white/50 uppercase mb-6">
            The Human Side
          </p>
          <h2 className="human-heading font-pixel text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-white mb-6">
            Nobody&apos;s consistent. Until they are.
          </h2>
          <p className="human-sub text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            You will miss days. Change goals. Quit things. Start again. Capitol keeps the whole journey.
          </p>
        </div>

        <div className="human-video-wrapper mx-auto w-full max-w-5xl">
          <div className="relative w-full aspect-video rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/capitol-launch.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="font-mono text-xs tracking-[0.3em] text-white/60 uppercase mb-3">Launch Video</p>
                <p className="text-sm text-white/40">Add your video to <span className="text-capitol-gold/80">public/capitol-launch.mp4</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
