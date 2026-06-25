/**
 * POS navigation registry, gated to the cafe tenant.
 *
 * posTabs() returns the register/catalog/inventory/reports tabs ONLY when
 * IS_CAFE is true, so the restaurant and studio tenants never see a POS nav.
 * Manager-only tabs are filtered by role. The PosLayout renders whatever this
 * returns; nothing else hard-codes the POS nav.
 */

import { IS_CAFE } from './access.ts';

export interface PosTab {
  href: string;
  label: string;
  icon: string;          // inline SVG path data (stroke)
  managerOnly?: boolean;
}

const TABS: PosTab[] = [
  { href: '/pos/', label: 'Register', icon: 'M3 3h18v4H3zM3 7v14h18V7M8 11h8' },
  { href: '/pos/catalog/', label: 'Catalog', icon: 'M4 6h16M4 12h16M4 18h10', managerOnly: true },
  { href: '/pos/inventory/', label: 'Inventory', icon: 'M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7', managerOnly: true },
  { href: '/pos/sales/', label: 'Reports', icon: 'M4 20V10M10 20V4M16 20v-7M20 20H2', managerOnly: true },
];

export function posTabs(role?: 'staff' | 'manager'): PosTab[] {
  if (!IS_CAFE) return [];
  return TABS.filter((t) => !t.managerOnly || role === 'manager');
}
