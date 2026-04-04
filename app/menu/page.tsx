import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | Sula Café Vancouver",
  description: "Explore Sula Café's full menu of Indian-inspired drinks, chai, specialty coffee by Alai, and artisanal baked goods.",
};

const categories = [
  {
    id: "coffee",
    title: "Coffee",
    eyebrow: "By Alai Coffee",
    items: [
      { name: "Malai Pista Mocha", desc: "Espresso, white chocolate, pistachio paste, frothed milk, crumbled pistachios", badge: "Bestseller" },
      { name: "Coastal Coconut Cappuccino", desc: "Espresso, toasted coconut syrup, steamed whole milk, coconut dust" },
      { name: "Masala Monsoon Misto", desc: "House masala blend, espresso, half brewed coffee, warm steamed milk" },
      { name: "Jaggery Latte", desc: "Unrefined cane jaggery syrup, double espresso, steamed oat milk" },
      { name: "Alai Filter Coffee", desc: "South Indian drip-style, Chikmagalur & Odisha single origin", badge: "House Brew" },
      { name: "Cardamom Cortado", desc: "Green cardamom syrup, ristretto, equal parts warm milk" },
      { name: "Espresso / Americano / Cappuccino", desc: "Classic preparations using the exclusive Sula Blend by Alai" },
    ],
  },
  {
    id: "chai",
    title: "Chai",
    eyebrow: "Traditional Sula Chai",
    items: [
      { name: "Classic Sula Chai", desc: "Premium loose-leaf from Coorg & Chikmagalur highlands, brewed with whole milk and spices", badge: "Signature" },
      { name: "Masala Chai", desc: "House masala blend: cardamom, cinnamon, ginger, clove, black pepper" },
      { name: "Ginger Lemon Chai", desc: "Bright, warming — fresh ginger steeped with lemon and black tea" },
      { name: "Kashmiri Noon Chai", desc: "Pink salted tea with almonds and cardamom cream" },
      { name: "Chai Latte (hot or iced)", desc: "Sula Chai concentrate and steamed/cold milk — a gateway cup" },
    ],
  },
  {
    id: "bakery",
    title: "Bakery",
    eyebrow: "Baked Fresh Daily",
    items: [
      { name: "Pear & Chai Croissant", desc: "Laminated pastry, spiced pear preserve, chai cream filling", badge: "Fan Favourite" },
      { name: "Masala Focaccia Panini", desc: "House-made masala focaccia, rotating Indian-inspired fillings — with Union Market" },
      { name: "Cardamom Almond Muffin", desc: "Moist crumb, fragrant green cardamom, sliced almonds on top" },
      { name: "Chaat Masala Shortbread", desc: "Buttery biscuit with tamarind, cumin, and chaat spice" },
      { name: "Chai Spice Cake Slice", desc: "Dense, warmly spiced loaf with ginger cream frosting" },
      { name: "Vegan Coconut Ladoo", desc: "Desiccated coconut, jaggery, cardamom — no dairy, all flavour", badge: "Vegan" },
      { name: "Saffron Semolina Cookie", desc: "Fragrant, crumbly, delicate — inspired by traditional halwa" },
    ],
  },
  {
    id: "street-food",
    title: "Street Food",
    eyebrow: "Light Bites",
    items: [
      { name: "Samosa (2 pcs)", desc: "Flaky pastry, spiced potato and pea filling, green chutney" },
      { name: "Dahi Puri Cups", desc: "Crisp puri, yogurt, tamarind chutney, chaat masala — four per order" },
      { name: "Vada Pav Slider", desc: "Mumbai's iconic potato fritter in a soft bun with three chutneys" },
      { name: "Soup of the Day", desc: "Ask at the counter — changes daily, always warming" },
    ],
  },
];

const tagColors: Record<string, { bg: string; text: string }> = {
  Bestseller: { bg: "var(--saffron-pale)", text: "var(--saffron)" },
  Signature: { bg: "#EEF5E6", text: "var(--sage)" },
  "House Brew": { bg: "var(--fog)", text: "var(--chai)" },
  "Fan Favourite": { bg: "var(--saffron-pale)", text: "var(--saffron)" },
  Vegan: { bg: "#EEF5E6", text: "var(--sage)" },
};

export default function MenuPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="pt-32 pb-16 px-6 text-center"
        style={{ background: "linear-gradient(180deg, var(--chai-dark) 0%, var(--chai) 100%)" }}
      >
        <p className="hero-eyebrow mb-3 text-white opacity-70">Takeout Only</p>
        <h1 className="font-display text-5xl md:text-6xl text-white mb-4">Our Menu</h1>
        <p
          className="text-lg max-w-lg mx-auto"
          style={{ color: "var(--chai-light)", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}
        >
          Everything is made in-house or in partnership with trusted local makers — fresh, daily, with intention.
        </p>

        {/* Section nav */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="text-xs uppercase tracking-widest px-4 py-2 rounded-sm transition-colors"
              style={{ background: "rgba(255,255,255,0.1)", color: "var(--chai-light)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              {c.title}
            </a>
          ))}
        </div>
      </section>

      {/* Menu sections */}
      <div style={{ background: "var(--warm-white)" }}>
        {categories.map((cat, idx) => (
          <section
            key={cat.id}
            id={cat.id}
            className="py-20 px-6"
            style={{ background: idx % 2 === 0 ? "var(--warm-white)" : "var(--cream)" }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="mb-12">
                <p className="hero-eyebrow mb-2">{cat.eyebrow}</p>
                <h2 className="font-display text-4xl" style={{ color: "var(--chai-dark)" }}>{cat.title}</h2>
              </div>

              <div className="divide-y" style={{ borderColor: "var(--fog)" }}>
                {cat.items.map((item) => (
                  <div key={item.name} className="py-5 flex items-start justify-between gap-6">
                    <div>
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <h3 className="font-display text-base" style={{ color: "var(--chai-dark)" }}>
                          {item.name}
                        </h3>
                        {item.badge && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-sm"
                            style={{
                              background: tagColors[item.badge]?.bg || "var(--fog)",
                              color: tagColors[item.badge]?.text || "var(--chai)",
                              fontFamily: "DM Sans",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Dietary note */}
      <section className="py-12 px-6" style={{ background: "var(--saffron-pale)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm" style={{ color: "var(--chai-dark)" }}>
            🌱 Vegan and gluten-free items available upon request. Please inform our team of any dietary needs or allergies when ordering.
          </p>
        </div>
      </section>
    </>
  );
}
