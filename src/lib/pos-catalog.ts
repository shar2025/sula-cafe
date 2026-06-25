/**
 * Sula Cafe POS seed catalog.
 *
 * Derived from the live /menu page + src/lib/chai-menu.ts (the marketing
 * source of truth, which intentionally omits prices). Prices here are
 * PLACEHOLDERS picked at sane cafe levels so the register is usable on day
 * one; Shar should confirm every price against the in-store / Toast export.
 * See POS_PRICE_PLACEHOLDERS below for the full list flagged for review.
 *
 * This seed is idempotent: /api/pos-import and ensureSchema() upsert by
 * (org, name) so re-running never duplicates rows. Edits to a product made
 * in /pos/catalog are preserved (import only inserts missing names unless
 * called with overwrite).
 *
 * Money is integer cents everywhere. No floats.
 */

export interface SeedModifier {
  name: string;
  priceDeltaCents: number;
  sort?: number;
}

export interface SeedModifierGroup {
  key: string;            // stable slug, used to attach to products
  name: string;
  required?: boolean;
  minSelect?: number;
  maxSelect?: number;     // 1 = single choice, >1 = multi
  modifiers: SeedModifier[];
}

export interface SeedProduct {
  name: string;
  category: string;
  priceCents: number;
  taxable?: boolean;        // GST applies, default true
  modifierGroupKeys?: string[];
  tags?: string[];
  pricePlaceholder?: boolean; // true until Shar confirms against real menu
  sort?: number;
}

export const POS_CATEGORIES = [
  'Sula Chai',
  'Alai Coffee',
  'Savoury',
  'Sweets',
  'Cookies',
] as const;

export const SEED_MODIFIER_GROUPS: SeedModifierGroup[] = [
  {
    key: 'milk',
    name: 'Milk',
    required: false,
    minSelect: 0,
    maxSelect: 1,
    modifiers: [
      { name: 'Whole milk', priceDeltaCents: 0, sort: 0 },
      { name: '2% milk', priceDeltaCents: 0, sort: 1 },
      { name: 'Oat milk', priceDeltaCents: 75, sort: 2 },
      { name: 'Coconut milk', priceDeltaCents: 75, sort: 3 },
    ],
  },
  {
    key: 'sweetness',
    name: 'Sweetness',
    required: false,
    minSelect: 0,
    maxSelect: 1,
    modifiers: [
      { name: 'Regular sweet', priceDeltaCents: 0, sort: 0 },
      { name: 'Less sweet', priceDeltaCents: 0, sort: 1 },
      { name: 'Unsweetened', priceDeltaCents: 0, sort: 2 },
    ],
  },
  {
    key: 'size',
    name: 'Size',
    required: false,
    minSelect: 0,
    maxSelect: 1,
    modifiers: [
      { name: 'Regular', priceDeltaCents: 0, sort: 0 },
      { name: 'Large', priceDeltaCents: 85, sort: 1 },
    ],
  },
  {
    key: 'temp',
    name: 'Temperature',
    required: false,
    minSelect: 0,
    maxSelect: 1,
    modifiers: [
      { name: 'Hot', priceDeltaCents: 0, sort: 0 },
      { name: 'Iced', priceDeltaCents: 0, sort: 1 },
    ],
  },
  {
    key: 'panini-protein',
    name: 'Protein',
    required: false,
    minSelect: 0,
    maxSelect: 1,
    modifiers: [
      { name: 'Paneer (vegetarian)', priceDeltaCents: 0, sort: 0 },
      { name: 'Chicken tikka (halal)', priceDeltaCents: 0, sort: 1 },
    ],
  },
];

const DRINK_MODS = ['milk', 'sweetness', 'temp'];
const COFFEE_MODS = ['milk', 'sweetness', 'size', 'temp'];

export const SEED_PRODUCTS: SeedProduct[] = [
  // Sula Chai
  { name: 'Sula Classic Masala Chai', category: 'Sula Chai', priceCents: 525, modifierGroupKeys: DRINK_MODS, tags: ['vegetarian', 'signature'], pricePlaceholder: true, sort: 0 },
  { name: 'Lavender Chai', category: 'Sula Chai', priceCents: 575, modifierGroupKeys: DRINK_MODS, tags: ['vegetarian'], pricePlaceholder: true, sort: 1 },
  { name: 'Pistachio Chai', category: 'Sula Chai', priceCents: 625, modifierGroupKeys: DRINK_MODS, tags: ['vegetarian', 'contains-nuts'], pricePlaceholder: true, sort: 2 },
  { name: 'Spicy Ginger Chai', category: 'Sula Chai', priceCents: 545, modifierGroupKeys: DRINK_MODS, tags: ['vegetarian'], pricePlaceholder: true, sort: 3 },
  { name: 'Gulabi Chai', category: 'Sula Chai', priceCents: 575, modifierGroupKeys: DRINK_MODS, tags: ['vegetarian'], pricePlaceholder: true, sort: 4 },

  // Alai Coffee
  { name: 'Jaggery Velvet Latte', category: 'Alai Coffee', priceCents: 595, modifierGroupKeys: COFFEE_MODS, tags: ['vegetarian', 'signature'], pricePlaceholder: true, sort: 0 },
  { name: 'Masala Monsoon Misto', category: 'Alai Coffee', priceCents: 575, modifierGroupKeys: COFFEE_MODS, tags: ['vegetarian'], pricePlaceholder: true, sort: 1 },
  { name: 'Coastal Coconut Cappuccino', category: 'Alai Coffee', priceCents: 575, modifierGroupKeys: COFFEE_MODS, tags: ['vegetarian'], pricePlaceholder: true, sort: 2 },
  { name: 'Malai Pista Mocha', category: 'Alai Coffee', priceCents: 625, modifierGroupKeys: COFFEE_MODS, tags: ['vegetarian', 'contains-nuts'], pricePlaceholder: true, sort: 3 },
  { name: 'Indian Filter Coffee', category: 'Alai Coffee', priceCents: 450, modifierGroupKeys: ['milk', 'sweetness', 'size'], tags: ['vegetarian'], pricePlaceholder: true, sort: 4 },

  // Savoury
  { name: 'Chimichurri Paneer Panini', category: 'Savoury', priceCents: 1095, tags: ['vegetarian'], pricePlaceholder: true, sort: 0 },
  { name: 'Pesto Chicken Tikka Panini', category: 'Savoury', priceCents: 1195, tags: ['halal', 'bestseller'], pricePlaceholder: true, sort: 1 },
  { name: 'Panini XL', category: 'Savoury', priceCents: 1495, modifierGroupKeys: ['panini-protein'], tags: ['halal'], pricePlaceholder: true, sort: 2 },
  { name: 'Masala Tomato and Red Pepper Soup', category: 'Savoury', priceCents: 795, tags: ['vegetarian'], pricePlaceholder: true, sort: 3 },
  { name: 'Herb Chutney Cheese Croissant', category: 'Savoury', priceCents: 650, tags: ['vegetarian'], pricePlaceholder: true, sort: 4 },
  { name: 'Vegetable Samosa', category: 'Savoury', priceCents: 550, tags: ['vegetarian'], pricePlaceholder: true, sort: 5 },
  { name: 'Samosa Croissant', category: 'Savoury', priceCents: 650, tags: ['vegetarian'], pricePlaceholder: true, sort: 6 },

  // Sweets
  { name: 'Butter Croissant', category: 'Sweets', priceCents: 450, tags: ['vegetarian'], pricePlaceholder: true, sort: 0 },
  { name: 'Spiced Morning Glory Muffin', category: 'Sweets', priceCents: 450, tags: ['vegetarian', 'sugar-free'], pricePlaceholder: true, sort: 1 },
  { name: 'Lime Coconut Cruffin', category: 'Sweets', priceCents: 595, tags: ['vegetarian', 'signature'], pricePlaceholder: true, sort: 2 },
  { name: 'Tiramisu Cruffin', category: 'Sweets', priceCents: 625, tags: ['vegetarian'], pricePlaceholder: true, sort: 3 },
  { name: 'Orange Chocolate Pain Suisse', category: 'Sweets', priceCents: 575, tags: ['vegetarian'], pricePlaceholder: true, sort: 4 },
  { name: 'Pistachio Loaf', category: 'Sweets', priceCents: 525, tags: ['vegetarian', 'contains-nuts'], pricePlaceholder: true, sort: 5 },

  // Cookies
  { name: 'Chocolate Chip Cookie', category: 'Cookies', priceCents: 375, tags: ['vegetarian'], pricePlaceholder: true, sort: 0 },
  { name: 'Brown Butter Espresso Cookie', category: 'Cookies', priceCents: 395, tags: ['vegetarian'], pricePlaceholder: true, sort: 1 },
  { name: 'Pistachio Malai Macaroon', category: 'Cookies', priceCents: 425, tags: ['vegetarian', 'contains-nuts'], pricePlaceholder: true, sort: 2 },
];

/**
 * Every seed price is a placeholder until Shar confirms against the real
 * in-store menu / Toast export. Surfaced in /pos/catalog as a banner.
 */
export const POS_PRICE_PLACEHOLDERS = SEED_PRODUCTS
  .filter((p) => p.pricePlaceholder)
  .map((p) => p.name);
