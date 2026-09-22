"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-hero-eyebrow",
        { opacity: 0, y: 20, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 0.2, ease: "power3.out" }
      );
      gsap.fromTo(
        ".contact-hero-heading",
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
          <p className="contact-hero-eyebrow font-mono text-xs md:text-sm tracking-[0.35em] text-white/50 uppercase mb-6">
            Contact Capitol
          </p>
          <h1 className="contact-hero-heading font-pixel text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white mb-6">
            Get in touch.
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Have a question, idea, or just want to say what&apos;s up? Shoot us an email.
          </p>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-3xl border border-white/10 bg-black/70 p-8 md:p-12 backdrop-blur-2xl">
            <div className="mx-auto max-w-md text-center">
              <p className="text-sm text-white/60 mb-2">Email us directly at</p>
              <a
                href="mailto:capitolhelp@gmail.com"
                className="block font-pixel text-xl md:text-2xl text-capitol-gold hover:text-capitol-gold/80 transition mb-8"
              >
                capitolhelp@gmail.com
              </a>
              <p className="text-sm text-white/50 leading-relaxed mb-8">
                We read every message. Expect a reply within 24ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ48 hours.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
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
