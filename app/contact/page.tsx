"use client";
import { useState } from "react";
import { MapPin, Clock, Mail } from "lucide-react";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", type: "general", date: "", guests: "", message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    background: "var(--cream)",
    border: "1px solid var(--fog)",
    color: "var(--text-primary)",
  };

  return (
    <>
      {/* Hero */}
      <section
        className="pt-32 pb-16 px-6 text-center"
        style={{ background: "linear-gradient(180deg, var(--chai-dark) 0%, var(--chai) 100%)" }}
      >
        <p className="hero-eyebrow mb-3 text-white opacity-70">Get in Touch</p>
        <h1 className="font-display text-5xl md:text-6xl text-white mb-4">Contact Us</h1>
        <p className="text-base" style={{ color: "var(--chai-light)", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>
          Orders, catering enquiries, wholesale partnerships — we'd love to hear from you.
        </p>
      </section>

      <section className="py-24 px-6" style={{ background: "var(--warm-white)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Info */}
          <div>
            <h2 className="font-display text-3xl mb-8" style={{ color: "var(--chai-dark)" }}>Visit us</h2>
            <div className="space-y-8">

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--saffron-pale)" }}>
                  <MapPin size={16} style={{ color: "var(--saffron)" }} />
                </div>
                <div>
                  <p className="font-medium text-sm mb-1" style={{ color: "var(--chai-dark)" }}>Location</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>260 East 5th Avenue<br />Vancouver, BC · Mount Pleasant</p>
                  <a href="https://maps.google.com/?q=260+East+5th+Avenue+Vancouver+BC" target="_blank" rel="noopener noreferrer"
                    className="text-xs mt-2 block underline underline-offset-2" style={{ color: "var(--saffron)" }}>
                    Open in Google Maps →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--saffron-pale)" }}>
                  <Clock size={16} style={{ color: "var(--saffron)" }} />
                </div>
                <div>
                  <p className="font-medium text-sm mb-2" style={{ color: "var(--chai-dark)" }}>Hours</p>
                  <div className="space-y-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <div className="flex justify-between gap-8"><span>Monday – Friday</span><span>8:00 am – 4:00 pm</span></div>
                    <div className="flex justify-between gap-8"><span>Saturday – Sunday</span><span>9:00 am – 4:00 pm</span></div>
                  </div>
                  <p className="text-xs mt-2 italic" style={{ color: "var(--text-muted)" }}>Takeout only — no dine-in seating</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--saffron-pale)" }}>
                  <Mail size={16} style={{ color: "var(--saffron)" }} />
                </div>
                <div>
                  <p className="font-medium text-sm mb-1" style={{ color: "var(--chai-dark)" }}>Email</p>
                  <a href="mailto:hello@sulacafe.com" className="text-sm underline underline-offset-2" style={{ color: "var(--saffron)" }}>
                    hello@sulacafe.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--saffron-pale)" }}>
                  <span style={{ color: "var(--saffron)" }}><InstagramIcon /></span>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1" style={{ color: "var(--chai-dark)" }}>Social</p>
                  <div className="flex gap-4">
                    <a href="https://instagram.com/sulacafe" target="_blank" rel="noopener noreferrer"
                      className="text-sm underline underline-offset-2" style={{ color: "var(--saffron)" }}>Instagram</a>
                    <a href="https://facebook.com/sulacafe" target="_blank" rel="noopener noreferrer"
                      className="text-sm underline underline-offset-2" style={{ color: "var(--saffron)" }}>Facebook</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-5 rounded-sm" style={{ background: "var(--cream)", border: "1px solid var(--fog)" }}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--saffron)" }}>Part of the Sula family</p>
              <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                Looking for Sula Indian Restaurant? We have three full-service restaurant locations across Vancouver.
              </p>
              <a href="https://sulaindianrestaurant.com" target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium underline underline-offset-2" style={{ color: "var(--chai-dark)" }}>
                Visit Sula Indian Restaurant →
              </a>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-display text-3xl mb-8" style={{ color: "var(--chai-dark)" }}>Send us a message</h2>

            {submitted ? (
              <div className="p-10 rounded-sm text-center" style={{ background: "var(--cream)", border: "1px solid var(--fog)" }}>
                <div className="text-4xl mb-4">🍵</div>
                <h3 className="font-display text-2xl mb-3" style={{ color: "var(--chai-dark)" }}>Thank you!</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  We've received your message and will respond within one business day.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                      className="w-full px-4 py-3 text-sm rounded-sm outline-none" style={inputStyle} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-3 text-sm rounded-sm outline-none" style={inputStyle} placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Enquiry Type</label>
                  <select name="type" value={formData.type} onChange={handleChange}
                    className="w-full px-4 py-3 text-sm rounded-sm outline-none" style={inputStyle}>
                    <option value="general">General Question</option>
                    <option value="catering">Catering Enquiry</option>
                    <option value="wholesale">Wholesale Partnership</option>
                    <option value="media">Media / Press</option>
                  </select>
                </div>

                {(formData.type === "catering" || formData.type === "wholesale") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Event Date</label>
                      <input type="date" name="date" value={formData.date} onChange={handleChange}
                        className="w-full px-4 py-3 text-sm rounded-sm outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Guests / Portions</label>
                      <input type="text" name="guests" value={formData.guests} onChange={handleChange}
                        className="w-full px-4 py-3 text-sm rounded-sm outline-none" style={inputStyle} placeholder="e.g. 50 guests" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={5}
                    className="w-full px-4 py-3 text-sm rounded-sm outline-none resize-none" style={inputStyle}
                    placeholder="Tell us what you need..." />
                </div>

                <button onClick={handleSubmit} className="btn-saffron w-full text-center">
                  Send Message
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
