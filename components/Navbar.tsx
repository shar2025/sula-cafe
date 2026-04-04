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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "py-3" : "py-5"
    }`} style={{ background: scrolled ? "rgba(10,8,4,0.96)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid rgba(184,146,74,0.15)" : "none" }}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-start">
          <span className="font-title text-xl tracking-widest" style={{ color: "var(--gold)", letterSpacing: "0.3em" }}>SULA</span>
          <span className="font-display text-xs italic tracking-widest" style={{ color: "var(--text-light)", letterSpacing: "0.2em", fontSize: "0.6rem" }}>Indian Chai Café</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link href="/contact" className="btn-gold py-2.5 px-6 text-xs">Order Now</Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} style={{ color: "var(--gold)" }}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-8 pb-6 pt-4 flex flex-col gap-5" style={{ background: "rgba(10,8,4,0.98)", borderTop: "1px solid rgba(184,146,74,0.15)" }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="nav-link text-sm">{l.label}</Link>
          ))}
          <Link href="/contact" className="btn-gold text-center mt-2">Order Now</Link>
        </div>
      )}
    </nav>
  );
}
