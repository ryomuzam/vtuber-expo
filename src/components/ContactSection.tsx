"use client";

import { useState } from "react";

type Labels = {
  sectionTitle: string;
  sectionSubtitle: string;
  description: string;
  email: string;
  emailRequired: string;
  emailNote: string;
  inquiryType: string;
  selectPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  privacyAgree: string;
  privacyPolicy: string;
  privacyError: string;
  submitError: string;
  submitting: string;
  submit: string;
  doneTitle: string;
  doneMessage: string;
  note: string;
};

export default function ContactSection({ inquiryTypes, labels }: { inquiryTypes: string[]; labels: Labels }) {
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError(labels.privacyError);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, inquiryType, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? labels.submitError);
        return;
      }
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="w-full bg-[#080818] py-20">
      <div className="mx-auto max-w-2xl px-4">
        {/* Section header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold tracking-[0.3em] text-[#3D7FE0] uppercase">{labels.sectionSubtitle}</p>
          <h2 className="text-2xl font-black text-white md:text-3xl">{labels.sectionTitle}</h2>
          <p className="mt-3 text-sm text-white/40">
            {labels.description}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          {done ? (
            <div className="py-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3D7FE0]/20">
                  <svg className="h-7 w-7 text-[#3D7FE0]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white">{labels.doneTitle}</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-white/50">
                {labels.doneMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white/80">
                  {labels.email}
                  <span className="rounded bg-[#3D7FE0]/20 px-1.5 py-0.5 text-xs font-semibold text-[#3D7FE0]">{labels.emailRequired}</span>
                </label>
                <p className="mb-2 text-xs text-white/30">
                  {labels.emailNote}
                </p>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#3D7FE0] focus:ring-1 focus:ring-[#3D7FE0]"
                />
              </div>

              {/* Inquiry Type */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white/80">
                  {labels.inquiryType}
                  <span className="rounded bg-[#3D7FE0]/20 px-1.5 py-0.5 text-xs font-semibold text-[#3D7FE0]">{labels.emailRequired}</span>
                </label>
                <select
                  required
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0f1124] px-4 py-3 text-sm text-white outline-none transition focus:border-[#3D7FE0] focus:ring-1 focus:ring-[#3D7FE0]"
                >
                  <option value="" disabled>{labels.selectPlaceholder}</option>
                  {inquiryTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white/80">
                  {labels.message}
                  <span className="rounded bg-[#3D7FE0]/20 px-1.5 py-0.5 text-xs font-semibold text-[#3D7FE0]">{labels.emailRequired}</span>
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder={labels.messagePlaceholder}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#3D7FE0] focus:ring-1 focus:ring-[#3D7FE0]"
                />
              </div>

              {/* Privacy Policy */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0"
                />
                <span className="text-sm text-white/50">
                  <a href="/privacy" target="_blank" className="text-[#3D7FE0] underline hover:text-[#C94BEA]">
                    {labels.privacyPolicy}
                  </a>
                  {labels.privacyAgree}
                </span>
              </label>

              {error && (
                <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-gradient-to-r from-[#3D7FE0] to-[#C94BEA] py-3.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? labels.submitting : labels.submit}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-white/20">
          {labels.note}
        </p>
      </div>
    </section>
  );
}
