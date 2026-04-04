import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Layers, Leaf, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Wholesale | Sula Café Vancouver",
  description: "Wholesale artisanal bakery orders from Sula Café's HACCP-certified kitchen. Keto, gluten-free, and vegan options available for businesses and retail partners.",
};

const features = [
  {
    icon: ShieldCheck,
    title: "HACCP-Certified Kitchen",
    desc: "Our production facility meets the highest food safety standards, ensuring consistency and reliability at every order size.",
  },
  {
    icon: Layers,
    title: "Small-Batch Quality",
    desc: "Even at scale, we produce in controlled batches using premium ingredients — freshness and flavour are never compromised.",
  },
  {
    icon: Leaf,
    title: "Dietary Flexibility",
    desc: "We create keto, gluten-free, and vegan items on request, tailored to your customer base or business requirements.",
  },
];

const products = [
  { name: "Croissants", desc: "Plain, chai-spiced, or seasonal filled varieties", minOrder: "12 units" },
  { name: "Muffins", desc: "Cardamom almond, banana chai, coconut jaggery", minOrder: "12 units" },
  { name: "Shortbread Cookies", desc: "Chaat masala, saffron, or classic butter", minOrder: "24 units" },
  { name: "Cake Slices", desc: "Chai spice loaf, cardamom orange, or seasonal", minOrder: "10 units" },
  { name: "Ladoos", desc: "Vegan coconut, besan, or sesame jaggery", minOrder: "20 units" },
  { name: "Masala Focaccia", desc: "Full loaves or pre-sliced for panini service", minOrder: "4 loaves" },
  { name: "Savoury Bites", desc: "Samosas, vada pav, and snack platters", minOrder: "24 units" },
  { name: "Sandwich Portions", desc: "Masala paninis and Indian-inspired fillings", minOrder: "10 units" },
];

export default function WholesalePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="pt-32 pb-20 px-6"
        style={{ background: "linear-gradient(135deg, var(--sage) 0%, var(--cardamom) 100%)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="hero-eyebrow mb-4 text-white opacity-70">Wholesale & Bulk Orders</p>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-6">
            Quality at any scale.
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.75)", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}
          >
            Partner with Sula Café for wholesale bakery orders — handcrafted in our HACCP-certified kitchen for businesses, offices, and retail partners across Vancouver.
          </p>
          <Link href="/contact" className="btn-saffron">
            Become a Partner
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6" style={{ background: "var(--warm-white)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-lift p-8 rounded-sm text-center"
                style={{ background: "var(--cream)", border: "1px solid var(--fog)" }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "var(--saffron-pale)" }}
                >
                  <f.icon size={22} style={{ color: "var(--saffron)" }} />
                </div>
                <h3 className="font-display text-xl mb-3" style={{ color: "var(--chai-dark)" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="py-24 px-6" style={{ background: "var(--cream)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="hero-eyebrow mb-3">Available for Wholesale</p>
            <h2 className="font-display text-4xl" style={{ color: "var(--chai-dark)" }}>Our wholesale range</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: "var(--fog)" }}>
            {products.map((p) => (
              <div
                key={p.name}
                className="p-6 flex items-start justify-between gap-4"
                style={{ background: "var(--cream)" }}
              >
                <div>
                  <h4 className="font-display text-base mb-1" style={{ color: "var(--chai-dark)" }}>{p.name}</h4>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
                </div>
                <span
                  className="text-xs whitespace-nowrap px-2 py-1 rounded-sm shrink-0"
                  style={{ background: "var(--warm-white)", color: "var(--chai)", border: "1px solid var(--fog)", fontFamily: "DM Sans" }}
                >
                  Min: {p.minOrder}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs mt-6 text-center" style={{ color: "var(--text-muted)" }}>
            Minimum order quantities are guidelines. Contact us to discuss your specific volume needs.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: "var(--chai-dark)" }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl text-white mb-2">Ready to partner with us?</h2>
            <p className="text-sm" style={{ color: "var(--chai-light)" }}>
              Fill out our enquiry form and we'll follow up within one business day.
            </p>
          </div>
          <Link href="/contact" className="btn-saffron whitespace-nowrap flex items-center gap-2">
            Contact Us <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
