import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

const drinks = [
  { name: "Malai Pista Mocha", desc: "Espresso · white chocolate · pistachio · frothed milk", tag: "Bestseller" },
  { name: "Coastal Coconut Cappuccino", desc: "Espresso · toasted coconut · steamed milk", tag: "Signature" },
  { name: "Masala Monsoon Misto", desc: "House masala blend · espresso · steamed milk", tag: "Signature" },
  { name: "Sula Chai", desc: "Premium loose-leaf from Coorg & Chikmagalur, brewed to order", tag: "Classic" },
  { name: "Lavender Chai Latte", desc: "Sula chai · dried lavender · oat milk", tag: "Seasonal" },
  { name: "Alai Filter Coffee", desc: "South Indian drip · Chikmagalur single origin", tag: "House Brew" },
];

const reviews = [
  { text: "The Malai Pista Mocha is unlike anything else in Vancouver. It just works.", author: "Nadia R.", source: "Google" },
  { text: "Finally a café that feels like it was made for people who grew up with chai. The croissants are extraordinary.", author: "Preethi M.", source: "Google" },
  { text: "A hidden gem. The masala paninis are addictive and the coffee program is world-class.", author: "James T.", source: "Yelp" },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Image src="/spread.jpg" alt="Sula Café spread" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,8,4,0.6) 0%, rgba(10,8,4,0.4) 40%, rgba(10,8,4,0.85) 100%)" }} />

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: "900px", margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: "24px", color: "var(--gold)" }}>✦ East Vancouver · Takeout Café ✦</p>
          <h1 className="font-display" style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", fontWeight: 300, fontStyle: "italic", color: "white", lineHeight: 1.05, marginBottom: "24px" }}>
            Where India meets<br />your morning.
          </h1>
          <p style={{ fontSize: "1.1rem", marginBottom: "40px", maxWidth: "520px", margin: "0 auto 40px", lineHeight: 1.7, color: "var(--cream-dark)", fontWeight: 300 }}>
            Traditional chai, specialty Indian-origin coffee by Alai, and artisanal baked goods — crafted daily at 260 East 5th Ave.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
            <Link href="/menu" className="btn-gold">View Menu</Link>
            <Link href="/catering" className="btn-ghost">Catering Enquiry</Link>
          </div>
        </div>

        {/* Hours bar - at very bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 32px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "20px", background: "rgba(10,8,4,0.75)", backdropFilter: "blur(8px)", borderTop: "1px solid rgba(184,146,74,0.25)", color: "var(--text-light)", fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.15em" }}>
          <span>260 East 5th Ave, Vancouver</span>
          <span style={{ color: "var(--gold)" }}>✦</span>
          <span>Mon–Fri 8am–4pm</span>
          <span style={{ color: "var(--gold)" }}>✦</span>
          <span>Sat–Sun 9am–4pm</span>
          <span style={{ color: "var(--gold)" }}>✦</span>
          <span>Takeout Only</span>
        </div>
      </section>

      {/* STORY */}
      <section style={{ padding: "96px 32px", background: "var(--dark)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "40px" }}>
            <div className="gold-line" />
            <p className="eyebrow">Our Story</p>
            <div className="gold-line" />
          </div>
          <p className="font-display" style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)", lineHeight: 1.5, marginBottom: "24px", color: "var(--cream)", fontStyle: "italic", fontWeight: 300 }}>
            "A tiny café with a giant bakery at its heart — tucked beneath a hand-painted monkey sign in East Vancouver."
          </p>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.8, maxWidth: "600px", margin: "0 auto 40px", color: "var(--text-muted)" }}>
            Born from the Sula Indian Restaurant family, Sula Café is a takeout-only space serving traditional chai brewed from highland estates, exclusive Alai coffee roasted in Vancouver, and artisanal baked goods that blur the line between India and your favourite local bakery.
          </p>
          <Link href="/about" className="btn-ghost">Read Our Story</Link>
        </div>
      </section>

      {/* FULL BLEED — cake & chai */}
      <section style={{ position: "relative", height: "55vh", minHeight: "380px", overflow: "hidden" }}>
        <Image src="/cake-chai.jpg" alt="Cardamom cake and chai" fill style={{ objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,8,4,0.35)" }} />
        <div style={{ position: "absolute", bottom: "40px", left: "40px" }}>
          <p className="eyebrow" style={{ marginBottom: "8px" }}>From the Oven</p>
          <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, fontStyle: "italic", color: "white", lineHeight: 1.1 }}>Baked fresh, daily.</h2>
        </div>
      </section>

      {/* DRINKS */}
      <section style={{ padding: "96px 32px", background: "var(--dark-mid)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                <div className="gold-line" />
                <p className="eyebrow">From the Cup</p>
              </div>
              <h2 className="font-display" style={{ fontSize: "clamp(3rem, 5vw, 5rem)", fontWeight: 300, fontStyle: "italic", color: "var(--cream)" }}>Drinks</h2>
            </div>
            <Link href="/menu" className="btn-ghost">Full Menu →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "1px", background: "rgba(184,146,74,0.15)" }}>
            {drinks.map((d) => (
              <div key={d.name} style={{ padding: "28px", background: "var(--dark-mid)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <h4 className="font-display" style={{ fontSize: "1.15rem", color: "var(--cream)", fontStyle: "italic" }}>{d.name}</h4>
                  <span style={{ fontSize: "0.6rem", padding: "3px 8px", background: "rgba(184,146,74,0.15)", color: "var(--gold)", fontFamily: "Cinzel, serif", letterSpacing: "0.1em" }}>{d.tag}</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", letterSpacing: "0.03em" }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BAKERY — split */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "580px" }}>
        <div style={{ position: "relative", minHeight: "400px" }}>
          <Image src="/pastries.jpg" alt="Sula pastries" fill style={{ objectFit: "cover" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 64px", background: "var(--warm-dark)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div className="gold-line" />
            <p className="eyebrow">The Bakery</p>
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)", marginBottom: "24px", color: "var(--cream)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.2 }}>
            Indian flavour.<br />Vancouver soul.
          </h2>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "32px", color: "var(--text-muted)" }}>
            Every item crafted daily — Pear & Chai Croissants, Masala Focaccia Paninis with Union Market, Chaat Masala Shortbread, and vegan treats with To Live For Bakery.
          </p>
          <Link href="/menu" className="btn-gold" style={{ alignSelf: "flex-start" }}>See Full Menu</Link>
        </div>
      </section>

      {/* CHAI HERO */}
      <section style={{ position: "relative", height: "65vh", minHeight: "480px", overflow: "hidden" }}>
        <Image src="/chai-teapot.jpg" alt="Sula chai with gold teapot" fill style={{ objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,8,4,0.88) 0%, rgba(10,8,4,0.15) 60%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 64px", width: "100%" }}>
            <div style={{ maxWidth: "500px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div className="gold-line" />
                <p className="eyebrow">Sula Chai</p>
              </div>
              <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)", color: "white", marginBottom: "24px", fontWeight: 300, fontStyle: "italic", lineHeight: 1.1 }}>
                From the highlands<br />of Coorg.
              </h2>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "32px", color: "var(--cream-dark)" }}>
                Our chai leaves are sourced from the mist-covered estates of Coorg and Chikmagalur. Brewed to order. Never in bulk.
              </p>
              <Link href="/menu" className="btn-ghost">Explore Drinks</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATERING — split */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "520px" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 64px", background: "var(--dark)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div className="gold-line" />
            <p className="eyebrow">Catering & Wholesale</p>
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)", marginBottom: "24px", color: "var(--cream)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.2 }}>
            Bring Sula<br />to your event.
          </h2>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "32px", color: "var(--text-muted)" }}>
            Corporate breakfasts, weddings, and private gatherings. Up to 300 portions per service from our HACCP-certified kitchen.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/catering" className="btn-gold">Get a Quote</Link>
            <Link href="/wholesale" className="btn-ghost">Wholesale</Link>
          </div>
        </div>
        <div style={{ position: "relative", minHeight: "400px" }}>
          <Image src="/sandwich.jpg" alt="Sula masala focaccia panini" fill style={{ objectFit: "cover" }} />
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "96px 32px", background: "var(--dark-mid)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "16px" }}>
              <div className="gold-line" />
              <p className="eyebrow">Guest Love</p>
              <div className="gold-line" />
            </div>
            <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 300, fontStyle: "italic", color: "var(--cream)" }}>What people are saying</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {reviews.map((r) => (
              <div key={r.author} className="card-hover" style={{ padding: "40px", background: "var(--dark)", border: "1px solid rgba(184,146,74,0.15)" }}>
                <p className="font-display" style={{ fontSize: "4rem", color: "var(--gold)", opacity: 0.4, lineHeight: 0.8, marginBottom: "16px" }}>"</p>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "24px", color: "var(--text-light)" }}>{r.text}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--cream)" }}>{r.author}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.source}</p>
                  </div>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="var(--gold)" color="var(--gold)" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING HERO */}
      <section style={{ position: "relative", height: "60vh", minHeight: "420px", overflow: "hidden" }}>
        <Image src="/bakery-full.jpg" alt="Full Sula bakery spread" fill style={{ objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,8,4,0.55)" }}>
          <div style={{ textAlign: "center", padding: "0 24px" }}>
            <p className="eyebrow" style={{ marginBottom: "16px" }}>260 East 5th Ave · Mount Pleasant</p>
            <h2 className="font-display" style={{ fontSize: "clamp(3rem, 7vw, 6rem)", color: "white", marginBottom: "32px", fontWeight: 300, fontStyle: "italic" }}>Come as you are.</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
              <Link href="/menu" className="btn-gold">View Menu</Link>
              <Link href="/contact" className="btn-ghost">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
