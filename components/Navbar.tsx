"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Catering" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? "rgba(10,8,4,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(184,146,74,0.15)" : "none",
      transition: "all 0.4s ease",
      padding: scrolled ? "12px 0" : "20px 0",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "Cinzel, serif", fontSize: "1.4rem", letterSpacing: "0.3em", color: "var(--gold)", lineHeight: 1.1 }}>SULA</div>
          <div className="font-display" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--text-light)", fontStyle: "italic" }}>Indian Chai Café</div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }} className="hidden md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-light)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-light)")}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link href="/contact" className="btn-gold hidden md:block" style={{ padding: "10px 24px", fontSize: "0.65rem" }}>
          Order Now
        </Link>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)", display: "none" }} className="md:hidden">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "rgba(10,8,4,0.98)", borderTop: "1px solid rgba(184,146,74,0.15)", padding: "24px 40px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ fontFamily: "Cinzel, serif", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-light)", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-gold" style={{ textAlign: "center", marginTop: "8px" }}>Order Now</Link>
        </div>
      )}
    </nav>
  );
}
