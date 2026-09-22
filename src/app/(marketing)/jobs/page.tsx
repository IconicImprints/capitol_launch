"use client";

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";

const ROLES = [
  {
    title: "Developers",
    desc: "Full-stack, frontend, backend, mobile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M8 3l-6 9 6 9M16 3l6 9-6 9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "UI/UX Designers",
    desc: "Product design, landing pages, visual systems",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none" />
        <path d="M7 14l4-4 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Video Editors",
    desc: "Shorts, Reels, product videos, campaigns",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="2" y="6" width="14" height="12" rx="2" />
        <path d="M16 10l4-2v8l-4-2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Marketers",
    desc: "Growth, social media, campaigns, content strategy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M3 12h4l3-9 4 18 3-9h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "UGC Creators",
    desc: "TikTok, Reels, product demonstrations, creator content",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Community Managers",
    desc: "Discord, community engagement, events",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="9" cy="7" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 21v-2a4 4 0 014-4h5a4 4 0 014 4v2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Partnerships",
    desc: "Creator, brand, and community partnerships",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="16" r="3" />
        <path d="M10.5 10.5l6 6" strokeLinecap="round" />
      </svg>
    ),
  },
];

const STEPS = ["About", "Role", "Experience", "Availability", "Discord", "Submit"];

const DISCORD_INVITE = "https://discord.gg/capitol";

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Denmark",
  "Egypt",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "India",
  "Indonesia",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
];

const INITIAL_FORM = {
  fullName: "",
  age: "",
  country: "",
  email: "",
  discord: "",
  role: "",
  otherSkills: "",
  built: "",
  bestAt: "",
  portfolio: "",
  hours: "",
  commitment: "",
  joinedDiscord: false,
  understandsEarlyStage: false,
};

export default function JobsPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const update = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const validateStep = () => {
    const next: Record<string, string> = {};
    if (step === 0) {
      if (!form.fullName.trim()) next.fullName = "Full name is required.";
      if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 13 || Number(form.age) > 24)
        next.age = "Enter a valid age (13ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“24).";
      if (!form.country) next.country = "Select your country.";
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        next.email = "Enter a valid email.";
      if (!form.discord.trim()) next.discord = "Enter your Discord username.";
    }
    if (step === 1) {
      if (!form.role) next.role = "Select a role.";
    }
    if (step === 3) {
      if (!form.hours) next.hours = "Select your availability.";
      if (!form.commitment) next.commitment = "Please answer this question.";
    }
    if (step === 4) {
      if (!form.joinedDiscord) next.joinedDiscord = "Please confirm you have joined the Discord.";
    }
    if (step === 5) {
      if (!form.understandsEarlyStage)
        next.understandsEarlyStage = "Please confirm to continue.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    if (!validateStep()) return;
    const submission = {
      ...form,
      submittedAt: new Date().toISOString(),
    };
    console.log("[Capitol Jobs] Application payload:", submission);
    setSubmitted(true);
  };

  useEffect(() => {
    gsap.fromTo(
      ".jobs-hero-eyebrow",
      { opacity: 0, y: 20, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 0.2, ease: "power3.out" }
    );
    gsap.fromTo(
      ".jobs-hero-heading",
      { opacity: 0, y: 40, filter: "blur(12px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, delay: 0.4, ease: "power3.out" }
    );
    gsap.fromTo(
      ".jobs-hero-sub",
      { opacity: 0, y: 24, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 0.7, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".jobs-step-content",
      { opacity: 0, x: 30, filter: "blur(6px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out" }
    );
  }, [step]);

  if (submitted) {
    return (
      <main className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-xl w-full text-center">
          <div className="jobs-step-content rounded-3xl border border-white/10 bg-black/70 p-10 backdrop-blur-2xl">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 text-capitol-gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-pixel text-3xl md:text-4xl text-white mb-4">Application received.</h2>
            <p className="text-white/70 leading-relaxed mb-8">
              Thanks for wanting to build Capitol. We&apos;ll review your application and contact you through Discord or email if you&apos;re selected for the next step.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Back to Capitol
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0002] via-black to-black" />
        <div className="absolute top-0 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#7A0B14] opacity-[0.07] blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <p className="jobs-hero-eyebrow font-mono text-xs md:text-sm tracking-[0.35em] text-white/50 uppercase mb-6">
            Capitol Careers
          </p>
          <h1 className="jobs-hero-heading font-pixel text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white mb-6">
            Build Capitol with us.
          </h1>
          <p className="jobs-hero-sub text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-4 leading-relaxed">
            We&apos;re looking for young builders, creators, and growth-minded people who want real startup experience.
          </p>
          <p className="text-sm text-white/50 max-w-xl mx-auto">
            Open to applicants aged 13ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“24. Experience is not required ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â skills, consistency, and initiative matter more.
          </p>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ROLES.map((role) => (
              <button
                key={role.title}
                onClick={() => {
                  update("role", role.title);
                  document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="jobs-role-card group flex flex-col items-start rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-left transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 text-white/90 transition group-hover:bg-white/10">
                  {role.icon}
                </span>
                <h3 className="font-pixel text-lg text-white mb-1.5">{role.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-4">{role.desc}</p>
                <span className="text-xs font-medium text-capitol-gold/90 group-hover:text-capitol-gold transition">
                  Apply ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="application-form" className="relative pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-3xl border border-white/10 bg-black/70 p-8 md:p-10 backdrop-blur-2xl">
            <div className="mb-8">
              <h2 className="font-pixel text-2xl md:text-3xl text-white mb-2">Join the team.</h2>
              <p className="text-sm text-white/60">Step {step + 1} of {STEPS.length}</p>
              <div className="mt-4 flex items-center gap-2">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= step ? "bg-capitol-gold" : "bg-white/10"
                      }`}
                      style={{ minWidth: 24 }}
                    />
                    {i < STEPS.length - 1 && <div className="w-1" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="jobs-step-content">
              {step === 0 && (
                <div className="space-y-5">
                  <h3 className="text-lg font-medium text-white mb-4">About you</h3>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-capitol-gold/50 focus:outline-none focus:ring-1 focus:ring-capitol-gold/40"
                      placeholder="Your full name"
                    />
                    {errors.fullName && <p className="mt-1.5 text-xs text-red-400">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Age *</label>
                    <input
                      type="number"
                      min={13}
                      max={24}
                      value={form.age}
                      onChange={(e) => update("age", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-capitol-gold/50 focus:outline-none focus:ring-1 focus:ring-capitol-gold/40"
                      placeholder="13ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“24"
                    />
                    {errors.age && <p className="mt-1.5 text-xs text-red-400">{errors.age}</p>}
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Country *</label>
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                        setShowCountryDropdown(true);
                        update("country", e.target.value);
                      }}
                      onFocus={() => setShowCountryDropdown(true)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-capitol-gold/50 focus:outline-none focus:ring-1 focus:ring-capitol-gold/40"
                      placeholder="Search your country"
                    />
                    {showCountryDropdown && filteredCountries.length > 0 && (
                      <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl">
                        {filteredCountries.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              update("country", c);
                              setCountrySearch(c);
                              setShowCountryDropdown(false);
                            }}
                            className="block w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/5 hover:text-white"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                    {errors.country && <p className="mt-1.5 text-xs text-red-400">{errors.country}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-capitol-gold/50 focus:outline-none focus:ring-1 focus:ring-capitol-gold/40"
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Discord Username *</label>
                    <input
                      type="text"
                      value={form.discord}
                      onChange={(e) => update("discord", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-capitol-gold/50 focus:outline-none focus:ring-1 focus:ring-capitol-gold/40"
                      placeholder="username#0000"
                    />
                    {errors.discord && <p className="mt-1.5 text-xs text-red-400">{errors.discord}</p>}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="text-lg font-medium text-white mb-4">Which role are you applying for? *</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ROLES.map((role) => (
                      <button
                        key={role.title}
                        type="button"
                        onClick={() => update("role", role.title)}
                        className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                          form.role === role.title
                            ? "border-capitol-gold/50 bg-capitol-gold/10 text-white"
                            : "border-white/10 bg-white/[0.02] text-white/80 hover:border-white/20"
                        }`}
                      >
                        {role.title}
                      </button>
                    ))}
                  </div>
                  {errors.role && <p className="mt-1.5 text-xs text-red-400">{errors.role}</p>}
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Any other skills?</label>
                    <textarea
                      value={form.otherSkills}
                      onChange={(e) => update("otherSkills", e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-capitol-gold/50 focus:outline-none focus:ring-1 focus:ring-capitol-gold/40"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="text-lg font-medium text-white mb-4">What have you built or worked on?</h3>
                  <textarea
                    value={form.built}
                    onChange={(e) => update("built", e.target.value)}
                    rows={5}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-capitol-gold/50 focus:outline-none focus:ring-1 focus:ring-capitol-gold/40"
                    placeholder="Share projects, work, or anything relevant."
                  />
                  <h3 className="text-lg font-medium text-white mt-6 mb-4">What are you best at?</h3>
                  <textarea
                    value={form.bestAt}
                    onChange={(e) => update("bestAt", e.target.value)}
                    rows={5}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-capitol-gold/50 focus:outline-none focus:ring-1 focus:ring-capitol-gold/40"
                    placeholder="Your superpowers."
                  />
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Portfolio / GitHub / Website</label>
                    <input
                      type="url"
                      value={form.portfolio}
                      onChange={(e) => update("portfolio", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-capitol-gold/50 focus:outline-none focus:ring-1 focus:ring-capitol-gold/40"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-white mb-4">Availability</h3>
                  <p className="text-sm text-white/70 mb-3">How much time can you realistically contribute each week? *</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["1ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“3 hours", "3ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“5 hours", "5ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“10 hours", "10+ hours"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => update("hours", opt)}
                        className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                          form.hours === opt
                            ? "border-capitol-gold/50 bg-capitol-gold/10 text-white"
                            : "border-white/10 bg-white/[0.02] text-white/80 hover:border-white/20"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errors.hours && <p className="mt-1.5 text-xs text-red-400">{errors.hours}</p>}

                  <div>
                    <p className="text-sm text-white/70 mb-3">Can you commit consistently for the next 1ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“2 months? *</p>
                    <div className="flex gap-3">
                      {["Yes", "No"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => update("commitment", opt.toLowerCase())}
                          className={`flex-1 rounded-xl border px-4 py-3 text-sm transition ${
                            form.commitment === opt.toLowerCase()
                              ? "border-capitol-gold/50 bg-capitol-gold/10 text-white"
                              : "border-white/10 bg-white/[0.02] text-white/80 hover:border-white/20"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {errors.commitment && <p className="mt-1.5 text-xs text-red-400">{errors.commitment}</p>}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-white mb-2">Join the Capitol community.</h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Applicants must join our Discord so the team can communicate with you and continue the application process.
                  </p>
                  <a
                    href={DISCORD_INVITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                  >
                    Join Capitol Discord ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢
                  </a>
                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <input
                      id="joinedDiscord"
                      type="checkbox"
                      checked={form.joinedDiscord}
                      onChange={(e) => update("joinedDiscord", e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-capitol-gold focus:ring-capitol-gold/40"
                    />
                    <label htmlFor="joinedDiscord" className="text-sm text-white/80">
                      I have joined the Capitol Discord.
                    </label>
                  </div>
                  {errors.joinedDiscord && <p className="mt-1.5 text-xs text-red-400">{errors.joinedDiscord}</p>}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-white mb-2">Ready to build?</h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Please confirm that you understand this is an early-stage opportunity and that initial roles may be unpaid for approximately 1ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“2 months.
                  </p>
                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <input
                      id="earlyStage"
                      type="checkbox"
                      checked={form.understandsEarlyStage}
                      onChange={(e) => update("understandsEarlyStage", e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-capitol-gold focus:ring-capitol-gold/40"
                    />
                    <label htmlFor="earlyStage" className="text-sm text-white/80">
                      I understand this is an early-stage opportunity and initial roles may be unpaid for approximately 1ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“2 months.
                    </label>
                  </div>
                  {errors.understandsEarlyStage && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.understandsEarlyStage}</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 0}
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white disabled:opacity-30 disabled:hover:border-white/10"
              >
                Back
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Submit Application
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
