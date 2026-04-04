import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Sula Café Vancouver",
  description: "Sula Café is born from the Sula Indian Restaurant family — a takeout-only café at 260 East 5th Ave, East Vancouver.",
};

const values = [
  { title: "Origin-first sourcing", desc: "Our chai leaves come from the mist-covered highlands of Coorg and Chikmagalur. Our coffee is roasted by Alai, a South Asian women-owned micro-roaster in Vancouver sourcing from India's lush coffee belt." },
  { title: "Craft over convenience", desc: "Every baked good is made fresh daily in our East Vancouver kitchen — not batch-produced offsite or frozen. We bake small, we bake often." },
  { title: "Community roots", desc: "We're an extension of Sula Indian Restaurant's 15-year relationship with Vancouver. The café is our way of showing up every morning for the neighbourhood." },
  { title: "Inclusivity on the menu", desc: "Vegan, gluten-free, and keto options are part of our DNA — not afterthoughts. Every guest deserves a great cup and a great bite." },
];

const team = [
  { name: "Kareena Fagwani", role: "Coffee Program Director", bio: "Formerly of Alai Coffee, Kareena designed the entire Sula Café coffee menu — each drink an original creation inspired by India's dessert traditions and nostalgic flavours." },
  { name: "Sula Culinary Team", role: "Bakery & Kitchen", bio: "Drawing on the 15-year culinary heritage of Sula Indian Restaurant, our kitchen team brings the same rigour and soul to every croissant, panini, and ladoo." },
  { name: "To Live For Bakery", role: "Vegan Pastry Partner", bio: "Our collaboration with To Live For Bakery ensures our vegan pastry selection is as thoughtful and delicious as the rest of our menu." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero with real photo */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/20230825-Sula-2164-E-LeilaKwok.jpg" alt="Sula ambiance" fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: "rgba(26,14,6,0.72)" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="hero-eyebrow mb-4 text-white opacity-70">Our Story</p>
          <h1 className="font-display text-5xl md:text-7xl text-white mb-8 leading-tight">
            Rooted in flavour.<br />
            <em className="italic" style={{ color: "var(--saffron-light)" }}>Open every morning.</em>
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--chai-light)", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 300 }}>
            Sula Café was born from a simple belief: that the flavours of India deserve a permanent home in Vancouver's morning ritual.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6" style={{ background: "var(--warm-white)" }}>
        <div className="max-w-3xl mx-auto space-y-6" style={{ color: "var(--text-secondary)" }}>
          <p className="font-display text-2xl leading-relaxed" style={{ color: "var(--chai-dark)" }}>
            We're tucked underneath a hand-painted monkey sign at 260 East 5th Avenue in Mount Pleasant — a takeout-only space with a serious artisanal bakery in the back.
          </p>
          <p className="text-base leading-relaxed">
            Sula Café is an extension of Sula Indian Restaurant — Vancouver's award-winning Indian dining institution since 2010. After 15 years of serving the city through three restaurant locations, the Sula team wanted to bring something different: a morning ritual rooted in Indian flavour, without compromise.
          </p>
          <p className="text-base leading-relaxed">
            The coffee program is entirely designed by Kareena Fagwani from Alai Coffee — a South Asian, women-owned micro-roaster sourcing beans from Chikmagalur and Odisha. Every drink on our menu is an original creation inspired by India's dessert traditions, coastal ingredients, and monsoon spices.
          </p>
          <p className="text-base leading-relaxed">
            Our chai comes from the rolling highland estates of Coorg and Chikmagalur — regions sometimes called the "Scotland of India" for their misty hills and aromatic, full-bodied teas. We brew to order, never in bulk.
          </p>
        </div>
      </section>

      {/* Photo break */}
      <section className="relative h-80 overflow-hidden">
        <Image src="/mango-afternoon-tea-vancouver.jpg" alt="Sula afternoon tea" fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(26,14,6,0.35)" }} />
      </section>

      {/* Values */}
      <section className="py-24 px-6" style={{ background: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="hero-eyebrow mb-3">What We Stand For</p>
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: "var(--chai-dark)" }}>Our values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <div key={v.title} className="flex gap-6">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-display text-sm font-semibold"
                  style={{ background: "var(--saffron-pale)", color: "var(--saffron)" }}>
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-display text-lg mb-2" style={{ color: "var(--chai-dark)" }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6" style={{ background: "var(--warm-white)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="hero-eyebrow mb-3">The People</p>
            <h2 className="font-display text-4xl" style={{ color: "var(--chai-dark)" }}>Crafted by hands you can trust</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((t) => (
              <div key={t.name} className="card-lift p-8 rounded-sm" style={{ background: "var(--cream)", border: "1px solid var(--fog)" }}>
                <div className="w-12 h-12 rounded-full mb-5"
                  style={{ background: "linear-gradient(135deg, var(--saffron-light), var(--chai-light))" }} />
                <h3 className="font-display text-lg mb-1" style={{ color: "var(--chai-dark)" }}>{t.name}</h3>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--saffron)" }}>{t.role}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/cafe.jpg" alt="Sula Café" fill className="object-cover" />
          <div className="absolute inset-0" style={{ background: "rgba(232,117,10,0.88)" }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl text-white mb-4">Come say hello.</h2>
          <p className="text-white opacity-85 mb-8">
            We're at 260 East 5th Ave, open every morning. No reservations, no fuss — just great chai and a warm kitchen.
          </p>
          <Link href="/contact" className="btn-outline" style={{ borderColor: "white", color: "white" }}>Find Us</Link>
        </div>
      </section>
    </>
  );
}
