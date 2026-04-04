import Link from "next/link";
import { MapPin, Clock, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "var(--dark)", borderTop: "1px solid rgba(184,146,74,0.2)" }}>
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
          <div className="md:col-span-1">
            <div className="mb-6">
              <div className="font-title text-2xl tracking-widest mb-1" style={{ color: "var(--gold)", letterSpacing: "0.3em" }}>SULA</div>
              <div className="font-display text-sm italic" style={{ color: "var(--text-light)" }}>Indian Chai Café</div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              A takeout café rooted in Indian flavour. Chai, specialty coffee, and artisanal baked goods — crafted daily in East Vancouver.
            </p>
          </div>

          <div>
            <h4 className="eyebrow mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              {[["Menu", "/menu"], ["Catering", "/catering"], ["Wholesale", "/wholesale"], ["About", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="nav-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-6">Hours</h4>
            <div className="flex items-start gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
              <Clock size={14} className="mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />
              <div className="space-y-1.5">
                <p>Mon – Fri: 8:00 am – 4:00 pm</p>
                <p>Sat – Sun: 9:00 am – 4:00 pm</p>
                <p className="text-xs italic mt-3">Takeout only</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="eyebrow mb-6">Find Us</h4>
            <div className="flex items-start gap-3 text-sm mb-5" style={{ color: "var(--text-muted)" }}>
              <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />
              <div>
                <p>260 East 5th Avenue</p>
                <p>Vancouver, BC</p>
                <a href="https://maps.google.com/?q=260+East+5th+Avenue+Vancouver+BC" target="_blank" rel="noopener noreferrer"
                  className="text-xs mt-2 block underline underline-offset-2" style={{ color: "var(--gold)" }}>
                  Get directions →
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
              <Mail size={14} className="mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />
              <a href="mailto:hello@sulacafe.com" style={{ color: "var(--text-muted)" }}>hello@sulacafe.com</a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid rgba(184,146,74,0.1)", color: "var(--text-muted)" }}>
          <p>© {new Date().getFullYear()} Sula Café · Part of the Sula Indian Restaurant family</p>
          <p>260 East 5th Ave, Vancouver BC</p>
        </div>
      </div>
    </footer>
  );
}
