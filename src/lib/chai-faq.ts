/**
 * The questions customers actually ask, with the cafe's real answers.
 * Sourced from the FAQ blocks on /menu and /contact. Keep in sync with those
 * pages. Chai uses these as the trusted answer for common questions.
 */

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  // Visiting and service
  {
    q: 'When are you open?',
    a: 'Monday to Friday 8am to 5:30pm, Saturday and Sunday 9am to 5:30pm. Open daily, closed Christmas Day.',
  },
  {
    q: 'Where are you and how do I get there?',
    a: 'We are at 260 East 5th Avenue in East Vancouver, in Mount Pleasant just off Main Street. A 5 minute walk from Main Street-Science World SkyTrain station, and the 3 Main Street bus stops a block away.',
  },
  {
    q: 'Is there parking?',
    a: 'Free street parking on East 5th Avenue, paid lots on Main Street, and bike racks out front.',
  },
  {
    q: 'Do you take phone orders?',
    a: 'Yes. Call 778 386 1130 and we will have your order ready for pickup.',
  },
  {
    q: 'Can I order delivery?',
    a: 'Yes. We are on UberEats with the full menu, same-day delivery across East Vancouver. There is no online ordering on the website itself yet.',
  },
  {
    q: 'Do you take reservations?',
    a: 'No reservations, the cafe is takeout-first. Walk in and order at the counter. There are a few seats inside for a quiet sit.',
  },
  {
    q: 'Is there a way to give feedback?',
    a: 'Yes, we read every message. Email info@sulacafe.com or use the contact form on the website, and we respond within 24 hours.',
  },
  // Menu
  {
    q: 'What chai blends do you have?',
    a: 'Five, all brewed slow with whole spices: classic masala, lavender, pistachio, spicy ginger, and gulabi rose.',
  },
  {
    q: 'Is your coffee from India?',
    a: 'Yes. Our exclusive Sula Blend is roasted by Alai Coffee, a Vancouver micro-roaster sourcing from Chikmagalur and Odisha.',
  },
  {
    q: 'What is the most popular drink?',
    a: 'Classic masala chai is the everyday favourite. The jaggery velvet latte and coastal coconut cappuccino are close seconds.',
  },
  {
    q: 'Are the paninis vegetarian?',
    a: 'The chimichurri paneer panini is fully vegetarian. The pesto chicken tikka panini has chicken, which is halal. Both are pressed in our masala focaccia from Union Market.',
  },
  {
    q: 'Do you have anything sugar-free?',
    a: 'Yes, the spiced morning glory muffin is sugar-free, and chai can be made less sweet or unsweetened on request.',
  },
  {
    q: 'What is a cruffin?',
    a: 'Half croissant, half muffin. A flaky pastry filled with sweet curd or cream. Lime coconut, tiramisu, and orange chocolate are the regulars.',
  },
  {
    q: 'Do you have vegan options?',
    a: 'Some. Chai and coffee can be made with oat or coconut milk. For food, it is best to ask at the counter, the team can point you to what works that day.',
  },
  {
    q: 'Do you serve beef or pork?',
    a: 'No. The menu is built around halal chicken, vegetarian dishes and seafood. No beef and no pork, anywhere.',
  },
];

export function renderFaqsForPrompt(): string {
  return FAQS.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n');
}
