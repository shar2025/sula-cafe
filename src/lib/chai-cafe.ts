/**
 * Sula Café identity, location, hours, vibe, and history.
 * Pulled into the Chai system prompt by `api/chai.ts`.
 *
 * Update this file when anything changes (hours, address, ownership,
 * neighborhood, sister-business links). Chai's answers update on next deploy.
 */

export const CAFE_IDENTITY = `
**Sula Café** is a neighbourhood
takeout coffee shop in East Vancouver, opened by the team behind Sula Indian
Restaurant.  Authentic chai brewed slow with leaves from Coorg, an exclusive
"Sula Blend" by Alai Coffee sourced from Chikmagalur and Odisha, plus
Indian-inspired pastries and paninis baked + pressed daily.

It's the cafe spin-off of the Sula family: Sula Indian Restaurant has three
sit-down locations (Commercial Drive, Main Street, Davie Street) and Sula
Catering serves Greater Vancouver.  The café is purposefully smaller, faster,
and grab-and-go-first, though a few seats inside are fine for a quiet sit
with your cup.
`.trim();

export const CAFE_LOCATION = `
**Address:** 260 East 5th Avenue, Vancouver BC V5T 1H3
**Neighbourhood:** Mount Pleasant / East Van, just off Main Street
**Phone:** 778 386 1130
**Email:** info@sulacafe.com
**Web:** sulacafe.com
**Delivery:** UberEats (full menu) + call-ahead pickup
**Parking:** free street parking on East 5th, paid lots on Main Street, bike
racks out front, Skytrain about two blocks away.
`.trim();

export const CAFE_HOURS = `
**Open daily:**
  Mon to Fri: 8:00 am to 5:30 pm
  Sat + Sun: 9:00 am to 5:30 pm

Closed on Christmas Day. Holiday hours posted at the door + on Instagram a
week ahead.
`.trim();

export const CAFE_VIBE = `
**The feel:** warm, cosy, neighbourhood. Indian heritage meets East Van
craft. Takeout-first energy but you can sit with a cup if you want.
Wifi is free. Kid-friendly inside, dog-friendly outside. Accessible entry
from East 5th Ave. We're built for the morning rush, the afternoon catch-up,
and the in-between when you just need a really good chai.

**What customers say a lot:**
  - "best masala chai I've had in Vancouver"
  - "didn't know I needed a pistachio chai until now"
  - "the cruffin literally changed my Saturday"
  - "smells like home"
`.trim();

export const CAFE_BUSINESS_SIBLINGS = `
**Sula family of businesses:**
  - **Sula Indian Restaurant**, 3 sit-down locations: Commercial Drive,
    Main Street, Davie Street. Full Indian menu, dinner-forward.
  - **Sula Catering**, Greater Vancouver weddings, corporate, private
    events. Full Indian + catering menus, large-format setup.
  - **Sula Events**, ticketed events, tasting nights, pop-ups at
    events.sulaindianrestaurant.com.

If a customer wants reservations, dinner, full Indian menu, or large
catering: route them to the right Sula site.  The café itself doesn't
do reservations and doesn't serve dinner.
`.trim();

export const CAFE_POLICIES = `
**Halal:** chicken is halal by default (consistent with Sula's halal policy
across all locations).  **No beef, no pork** anywhere on the cafe menu.
**Reservations:** we don't take them. Walk in.
**Online ordering:** not yet integrated on sulacafe.com. UberEats is the
delivery option, or call the cafe to pre-order pickup.
**Payment:** all major cards + Apple Pay + Google Pay.
**Loyalty program:** not formal yet (regulars know).  Stickers + paper card
trial planned for early 2026.
`.trim();
