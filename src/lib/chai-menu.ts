/**
 * Full Sula Cafe menu, organized by the five sections used on /menu.
 *
 * The Chai assistant uses this to answer "what's on the menu", "do you have X",
 * "any vegan options", "what's in the [item]" etc. This file mirrors the live
 * /menu page, keep them in sync. Add items here and Chai picks them up on the
 * next deploy, no hand-edit to the system prompt needed.
 *
 * Pricing is intentionally omitted. Chai should never quote a price, the menu
 * in store and UberEats are the sources of truth for cost.
 */

export interface MenuItem {
  name: string;
  description: string;
  tags?: string[];            // vegetarian | vegan | halal | contains-nuts | signature | sugar-free | bestseller
  pairsWith?: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  blurb: string;
  items: MenuItem[];
}

export const MENU: MenuCategory[] = [
  {
    id: 'chai',
    label: 'Sula Chai',
    blurb: 'Five chai blends. Premium tea leaves from Coorg and Chikmagalur, slow-brewed with whole traditional spices. Order any blend as a latte (with milk) or straight. Oat or coconut milk available, and any blend can be made less sweet or unsweetened on request.',
    items: [
      {
        name: 'Sula Classic Masala Chai',
        description: 'Cardamom, ginger, clove and pepper, slow-brewed with Assam tea and whole milk. Our signature and the everyday favourite.',
        tags: ['vegetarian', 'signature'],
        pairsWith: 'Butter croissant',
      },
      {
        name: 'Lavender Chai',
        description: 'Soft lavender notes layered into our masala base. Aromatic and soothing, an afternoon slow-down.',
        tags: ['vegetarian'],
        pairsWith: 'Lime coconut cruffin',
      },
      {
        name: 'Pistachio Chai',
        description: 'Roasted pistachios infused into rich masala chai. Nutty, creamy, decadent.',
        tags: ['vegetarian', 'contains-nuts'],
        pairsWith: 'Pistachio malai macaroon',
      },
      {
        name: 'Spicy Ginger Chai',
        description: 'Generous fresh ginger for a sharp, warming brew. The morning wake-up call.',
        tags: ['vegetarian'],
        pairsWith: 'Samosa croissant',
      },
      {
        name: 'Gulabi Chai',
        description: 'Rose petal chai with a delicate floral finish. Pink, fragrant, romantic.',
        tags: ['vegetarian'],
        pairsWith: 'Tiramisu cruffin',
      },
    ],
  },
  {
    id: 'coffee',
    label: 'Alai Coffee',
    blurb: 'Our exclusive Sula Blend, roasted by Alai Coffee, a Vancouver micro-roaster sourcing from Chikmagalur and Odisha. Specialty drinks inspired by India\'s dessert traditions. Standard espresso, latte, cappuccino, cold brew and drip are also available, with oat, coconut or whole milk.',
    items: [
      {
        name: 'Jaggery Velvet Latte',
        description: 'Smooth espresso with traditional Indian jaggery (palm sugar). Earthy sweetness, velvety finish. A signature only-at-Sula drink.',
        tags: ['vegetarian', 'signature'],
        pairsWith: 'Brown butter espresso cookie',
      },
      {
        name: 'Masala Monsoon Misto',
        description: 'Espresso meets warming masala spice. Half coffee, half steamed milk, all character.',
        tags: ['vegetarian'],
      },
      {
        name: 'Coastal Coconut Cappuccino',
        description: 'Espresso with coconut milk foam. Toasted, tropical, distinctly Indian.',
        tags: ['vegetarian'],
      },
      {
        name: 'Malai Pista Mocha',
        description: 'Rich pistachio cream and chocolate over espresso. Indian dessert in a cup.',
        tags: ['vegetarian', 'contains-nuts'],
      },
      {
        name: 'Indian Filter Coffee',
        description: 'Traditional South Indian filter coffee, brewed slow through a metal filter and served the proper way. Robust, frothy, strong.',
        tags: ['vegetarian'],
      },
    ],
  },
  {
    id: 'savoury',
    label: 'Savoury',
    blurb: 'Paninis pressed in house-made masala focaccia from Union Market, samosas with chutneys, and a warming masala soup. Comfort food with depth.',
    items: [
      {
        name: 'Chimichurri Paneer Panini',
        description: 'Fresh chimichurri spread, masala paneer, spinach, mozzarella, sundried tomatoes and arugula, pressed in masala focaccia.',
        tags: ['vegetarian'],
        pairsWith: 'Cold brew',
      },
      {
        name: 'Pesto Chicken Tikka Panini',
        description: 'Juicy chicken tikka, fresh pesto, tandoori spicy mayo, mozzarella, sundried tomatoes and arugula, pressed in masala focaccia. Halal chicken. A bestseller.',
        tags: ['halal', 'bestseller'],
        pairsWith: 'Spicy ginger chai',
      },
      {
        name: 'Paneer or Chicken Panini XL',
        description: 'The full-size version. Pesto or chimichurri, tandoori mayo, mozzarella, sundried tomatoes and arugula, in masala focaccia. Paneer is vegetarian, chicken is halal.',
        tags: ['halal'],
      },
      {
        name: 'Masala Tomato and Red Pepper Soup',
        description: 'Slow-roasted tomatoes and red peppers simmered with warming Indian spices. Velvety and rich.',
        tags: ['vegetarian'],
      },
      {
        name: 'Herb Chutney Cheese Croissant',
        description: 'Spiced green chutney layered with melted cheese inside a buttery croissant.',
        tags: ['vegetarian'],
        pairsWith: 'Classic masala chai',
      },
      {
        name: 'Vegetable Samosa',
        description: 'Homemade classic vegetable samosas served with tamarind and mint chutneys.',
        tags: ['vegetarian'],
      },
      {
        name: 'Samosa Croissant',
        description: 'A Sula original. Peas, potatoes and warming spices folded into a flaky croissant.',
        tags: ['vegetarian'],
        pairsWith: 'Spicy ginger chai',
      },
    ],
  },
  {
    id: 'sweets',
    label: 'Sweets',
    blurb: 'Cruffins, croissants and pastries baked fresh every morning. Indian bakery favourites with a Vancouver twist.',
    items: [
      {
        name: 'Butter Croissant',
        description: 'Crisp, buttery layers and a tender, airy crumb. The classic, done right.',
        tags: ['vegetarian'],
      },
      {
        name: 'Spiced Morning Glory Muffin',
        description: 'Carrots, apples, coconut and warm spices. Sugar-free and deeply satisfying.',
        tags: ['vegetarian', 'sugar-free'],
      },
      {
        name: 'Lime Coconut Cruffin',
        description: 'Flaky cruffin filled with tangy lime curd and sprinkled with toasted coconut. A customer favourite.',
        tags: ['vegetarian', 'signature'],
      },
      {
        name: 'Tiramisu Cruffin',
        description: 'Espresso-mascarpone cream, dusted with cocoa and a hint of cardamom.',
        tags: ['vegetarian'],
      },
      {
        name: 'Orange Chocolate Pain Suisse',
        description: 'Fragrant orange zest meets silky dark chocolate. A citrus-kissed take on a French classic.',
        tags: ['vegetarian'],
      },
      {
        name: 'Pistachio Loaf',
        description: 'Sweet pistachio loaf finished with pistachio crumb icing. Nutty, soft, generous.',
        tags: ['vegetarian', 'contains-nuts'],
      },
    ],
  },
  {
    id: 'cookies',
    label: 'Cookies and Macaroons',
    blurb: 'Small bites for alongside your chai or coffee. Spiced, malai-soaked, espresso-deep, or simply chocolate chip.',
    items: [
      {
        name: 'Chocolate Chip Cookies',
        description: 'The classic. Soft, chewy, generous chocolate chunks.',
        tags: ['vegetarian'],
      },
      {
        name: 'Brown Butter Espresso Cookies',
        description: 'Brown butter and espresso baked into nutty buckwheat flour. Deep, rich, sophisticated.',
        tags: ['vegetarian'],
      },
      {
        name: 'Pistachio Malai Macaroons',
        description: 'Soft macaroons soaked in pistachio malai cream. An Indian dessert reimagined as a French confection.',
        tags: ['vegetarian', 'contains-nuts'],
      },
    ],
  },
];

/**
 * Compact text rendering of the full menu for the system prompt.
 */
export function renderMenuForPrompt(): string {
  return MENU.map((cat) => {
    const items = cat.items.map((it) => {
      const tagPart = it.tags && it.tags.length ? ` [${it.tags.join(', ')}]` : '';
      return `  - ${it.name}${tagPart}: ${it.description}`;
    }).join('\n');
    return `### ${cat.label}\n${cat.blurb}\n${items}`;
  }).join('\n\n');
}
