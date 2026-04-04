import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Users, Coffee, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Catering | Sula Café Vancouver",
  description: "Sula Café offers corporate catering, private party catering, and event catering with freshly brewed chai, Indian-origin coffee, and artisanal baked goods.",
};

const packages = [
  {
    icon: Coffee,
    title: "Chai & Coffee Station",
    desc: "Signature Sula Chai served in beautiful decanters alongside Alai Coffee selections. Perfect for morning meetings and corporate events.",
    includes: ["Sula Chai decanters (serves 10–100)", "Alai coffee selection", "Oat/whole milk options", "Branded cups & napkins", "Setup & breakdown included"],
  },
  {
    icon: Package,
    title: "Catering Box",
    desc: "Handcrafted baked goods, Indian street food bites, and paninis — beautifully boxed and ready to share.",
    includes: ["Assorted bakery items", "Masala focaccia paninis", "Samosas & street food bites", "Sweet bites & ladoos", "Custom dietary labelling"],
  },
  {
    icon: Users,
    title: "Full Event Package",
    desc: "Our complete offering for weddings, corporate retreats, and large celebrations. Everything from chai to catering boxes.",
    includes: ["Chai & coffee station", "Full catering box spread", "Savoury & sweet menu", "Up to 300 portions", "Dedicated event coordinator"],
  },
];

const occasions = [
  "Corporate breakfast meetings",
  "Office lunch service",
  "Weddings & celebrations",
  "Private dinner parties",
  "Product launches & brand events",
  "Film & production sets",
  "Workshops & conferences",
  "Baby & bridal showers",
];

export default function CateringPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="pt-32 pb-20 px-6"
        style={{ background: "linear-gradient(135deg, var(--cardamom) 0%, var(--chai-dark) 100%)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="hero-eyebrow mb-4 text-white opacity-70">Catering Services</p>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-6">
            Bring Sula to your table.
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "var(--chai-light)", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}
          >
            From corporate breakfasts to intimate celebrations — we bring freshly brewed chai, bold Indian coffee, and artisanal baked goods to your event.
          </p>
          <Link href="/contact" className="btn-saffron">
            Request a Quote
          </Link>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 px-6" style={{ background: "var(--warm-white)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="hero-eyebrow mb-3">Our Packages</p>
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: "var(--chai-dark)" }}>
              Tailored to your event
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.title}
                className="card-lift p-8 rounded-sm flex flex-col"
                style={{ background: "var(--cream)", border: "1px solid var(--fog)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                  style={{ background: "var(--saffron-pale)" }}
                >
                  <pkg.icon size={20} style={{ color: "var(--saffron)" }} />
                </div>
                <h3 className="font-display text-xl mb-3" style={{ color: "var(--chai-dark)" }}>{pkg.title}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>{pkg.desc}</p>
                <ul className="space-y-2 mt-auto">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: "var(--saffron)" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-24 px-6" style={{ background: "var(--cream)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="hero-eyebrow mb-3">Perfect For</p>
              <h2 className="font-display text-4xl md:text-5xl mb-6" style={{ color: "var(--chai-dark)" }}>
                Any occasion worth celebrating
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Our HACCP-certified kitchen is equipped to handle any scale — from intimate office spreads to large-scale events. We accommodate special dietary needs including vegan, gluten-free, and keto options.
              </p>
              <Link href="/contact" className="btn-saffron mt-8 inline-block">
                Get Started
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {occasions.map((occ) => (
                <div
                  key={occ}
                  className="flex items-center gap-3 px-4 py-3 rounded-sm"
                  style={{ background: "var(--warm-white)", border: "1px solid var(--fog)" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--saffron)" }} />
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{occ}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capacity note */}
      <section className="py-16 px-6" style={{ background: "var(--saffron)" }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-display text-3xl mb-3">Up to 300 portions per service</h2>
          <p className="text-sm opacity-85 max-w-xl mx-auto mb-6">
            Our kitchen capacity supports large-scale breakfast and lunch service, including sandwiches, soups, baked goods, and beverage stations.
          </p>
          <Link href="/contact" className="btn-outline" style={{ borderColor: "white", color: "white" }}>
            Enquire Now
          </Link>
        </div>
      </section>
    </>
  );
}
