import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

const drinks = [
  { name: "Malai Pista Mocha", desc: "Espresso · white chocolate · pistachio · frothed milk", tag: "Bestseller" },
  { name: "Coastal Coconut Cappuccino", desc: "Espresso · toasted coconut · steamed milk", tag: "Signature" },
  { name: "Masala Monsoon Misto", desc: "House masala blend · espresso · steamed milk", tag: "Signature" },
  { name: "Sula Chai", desc: "Premium loose-leaf from Coorg & Chikmagalur, brewed to order", tag: "Classic" },
  { name: "Lavender Chai Latte", desc: "Sula chai concentrate · dried lavender · oat milk", tag: "Seasonal" },
  { name: "Alai Filter Coffee", desc: "South Indian drip · Chikmagalur & Odisha single origin", tag: "House Brew" },
];

const reviews = [
  { text: "The Malai Pista Mocha is unlike anything else in Vancouver. It just works.", author: "Nadia R.", source: "Google" },
  { text: "Finally a café that feels like it was made for people who grew up with chai. The croissants are extraordinary.", author: "Preethi M.", source: "Google" },
  { text: "A hidden gem. The masala paninis are addictive and the coffee program is world-class.", author: "James T.", source: "Yelp" },
];

export default function Home() {
  return (
    <>
      {/* HERO — full bleed dramatic photo */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <Image src="/spread.jpg" alt="Sula Café spread" fill className="object-cover object-center" priority />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,8,4,0.55) 0%, rgba(10,8,4,0.35) 40%, rgba(10,8,4,0.8) 100%)" }} />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="eyebrow fade-up delay-1 mb-6">✦ East Vancouver · Takeout Café ✦</p>
          <h1 className="font-display fade-up delay-2 text-white leading-none mb-6" style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", fontWeight: 300, fontStyle: "italic" }}>
            Where India meets<br />your morning.
          </h1>
          <p className="fade-up delay-3 text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed" style={{ color: "var(--cream-dark)", fontFamily: "DM Sans", fontWeight: 300 }}>
            Traditional chai, specialty Indian-origin coffee by Alai, and artisanal baked goods — crafted daily at 260 East 5th Ave.
          </p>
          <div className="fade-up delay-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/menu" className="btn-gold">View Menu</Link>
            <Link href="/catering" className="btn-ghost">Catering Enquiry</Link>
          </div>
        </div>

        {/* Hours bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 py-4 px-8 flex flex-wrap items-center justify-center gap-8 text-xs"
          style={{ background: "rgba(10,8,4,0.7)", backdropFilter: "blur(8px)", borderTop: "1px solid rgba(184,146,74,0.2)", color: "var(--text-light)", fontFamily: "Cinzel", letterSpacing: "0.15em" }}>
          <span>260 East 5th Ave, Vancouver</span>
          <span style={{ color: "var(--gold)" }}>✦</span>
          <span>Mon–Fri 8am–4pm</span>
          <span style={{ color: "var(--gold)" }}>✦</span>
          <span>Sat–Sun 9am–4pm</span>
          <span style={{ color: "var(--gold)" }}>✦</span>
          <span>Takeout Only</span>
        </div>
      </section>

      {/* INTRO TEXT */}
      <section className="py-24 px-8" style={{ background: "var(--dark)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="gold-line" />
            <p className="eyebrow">Our Story</p>
            <div className="gold-line" />
          </div>
          <p className="font-display text-3xl md:text-4xl leading-relaxed mb-6" style={{ color: "var(--cream)", fontStyle: "italic", fontWeight: 300 }}>
            "A tiny café with a giant bakery at its heart — tucked beneath a hand-painted monkey sign in East Vancouver."
          </p>
          <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Born from the Sula Indian Restaurant family, Sula Café is a takeout-only space serving traditional chai brewed from highland estates, exclusive Alai coffee roasted in Vancouver, and artisanal baked goods that blur the line between India and your favourite local bakery.
          </p>
          <Link href="/about" className="btn-ghost inline-block mt-10">Read Our Story</Link>
        </div>
      </section>

      {/* FULL BLEED — cake & chai photo */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image src="/cake-chai.jpg" alt="Cardamom cake and chai at Sula" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: "rgba(10,8,4,0.3)" }} />
        <div className="absolute bottom-10 left-10 md:left-20">
          <p className="eyebrow mb-2">From the Oven</p>
          <h2 className="font-display text-4xl md:text-6xl text-white" style={{ fontWeight: 300, fontStyle: "italic" }}>
            Baked fresh, daily.
          </h2>
        </div>
      </section>

      {/* DRINKS MENU */}
      <section className="py-24 px-8" style={{ background: "var(--dark-mid)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="gold-line" />
                <p className="eyebrow">From the Cup</p>
              </div>
              <h2 className="font-display text-5xl md:text-6xl" style={{ color: "var(--cream)", fontWeight: 300, fontStyle: "italic" }}>Drinks</h2>
            </div>
            <Link href="/menu" className="btn-ghost text-sm">Full Menu →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "rgba(184,146,74,0.1)" }}>
            {drinks.map((d) => (
              <div key={d.name} className="p-7 flex items-start justify-between gap-4" style={{ background: "var(--dark-mid)" }}>
                <div>
                  <div className="flex items-center flex-wrap gap-3 mb-2">
                    <h4 className="font-display text-lg" style={{ color: "var(--cream)", fontStyle: "italic" }}>{d.name}</h4>
                    <span className="text-xs px-2 py-0.5" style={{ background: "rgba(184,146,74,0.15)", color: "var(--gold)", fontFamily: "Cinzel", letterSpacing: "0.1em", fontSize: "0.6rem" }}>{d.tag}</span>
                  </div>
                  <p className="text-xs tracking-wide" style={{ color: "var(--text-muted)" }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TWO COLUMN — pastries photo + text */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
        <div className="relative min-h-[400px]">
          <Image src="/pastries.jpg" alt="Sula pastries" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center px-12 py-20" style={{ background: "var(--warm-dark)" }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="gold-line" />
            <p className="eyebrow">The Bakery</p>
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-6" style={{ color: "var(--cream)", fontStyle: "italic", fontWeight: 300 }}>
            Indian flavour.<br />Vancouver soul.
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
            Every item is crafted daily in our East Vancouver kitchen — Pear & Chai Croissants, Masala Focaccia Paninis with Union Market, Chaat Masala Shortbread, and vegan treats in partnership with To Live For Bakery.
          </p>
          <Link href="/menu#bakery" className="btn-gold self-start">See Full Menu</Link>
        </div>
      </section>

      {/* CHAI PHOTO FULL BLEED */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image src="/chai-teapot.jpg" alt="Sula chai with gold teapot" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,8,4,0.8) 0%, rgba(10,8,4,0.2) 60%, rgba(10,8,4,0.4) 100%)" }} />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="gold-line" />
                <p className="eyebrow">Sula Chai</p>
              </div>
              <h2 className="font-display text-5xl md:text-6xl text-white mb-6" style={{ fontWeight: 300, fontStyle: "italic", lineHeight: 1.1 }}>
                From the highlands<br />of Coorg.
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--cream-dark)" }}>
                Our chai leaves are sourced from the mist-covered estates of Coorg and Chikmagalur — some of India's most aromatic, full-bodied teas. Brewed to order. Never in bulk.
              </p>
              <Link href="/menu" className="btn-ghost">Explore Drinks</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TWO COLUMN — text + sandwich photo */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[550px]">
        <div className="flex flex-col justify-center px-12 py-20 order-2 md:order-1" style={{ background: "var(--dark)" }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="gold-line" />
            <p className="eyebrow">Catering & Wholesale</p>
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-6" style={{ color: "var(--cream)", fontStyle: "italic", fontWeight: 300 }}>
            Bring Sula<br />to your event.
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
            Corporate breakfasts, weddings, and private gatherings. Up to 300 portions per service from our HACCP-certified kitchen. Chai decanters, catering boxes, wholesale bakery orders.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/catering" className="btn-gold">Get a Quote</Link>
            <Link href="/wholesale" className="btn-ghost">Wholesale</Link>
          </div>
        </div>
        <div className="relative min-h-[400px] order-1 md:order-2">
          <Image src="/sandwich.jpg" alt="Sula masala focaccia panini" fill className="object-cover" />
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 px-8" style={{ background: "var(--dark-mid)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="gold-line" />
              <p className="eyebrow">Guest Love</p>
              <div className="gold-line" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: "var(--cream)", fontStyle: "italic", fontWeight: 300 }}>
              What people are saying
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.author} className="card-hover p-8" style={{ background: "var(--dark)", border: "1px solid rgba(184,146,74,0.15)" }}>
                <p className="font-display text-4xl mb-4" style={{ color: "var(--gold)", opacity: 0.4, lineHeight: 0.8 }}>"</p>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-light)", fontFamily: "DM Sans" }}>{r.text}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--cream)" }}>{r.author}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{r.source}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="var(--gold)" color="var(--gold)" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FULL BLEED CLOSING — bakery spread */}
      <section className="relative h-[65vh] min-h-[450px] overflow-hidden">
        <Image src="/bakery-full.jpg" alt="Full Sula bakery spread" fill className="object-cover object-center" />
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(10,8,4,0.5)" }}>
          <div className="text-center px-6">
            <p className="eyebrow mb-4">260 East 5th Ave · Mount Pleasant</p>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-8" style={{ fontWeight: 300, fontStyle: "italic" }}>
              Come as you are.
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/menu" className="btn-gold">View Menu</Link>
              <Link href="/contact" className="btn-ghost">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
