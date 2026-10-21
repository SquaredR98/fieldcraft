/*
 * One source for the header links, shared by the desktop bar and the
 * mobile drawer. They had drifted apart as two literal arrays, and the
 * drawer still carried "Explore Pro" after the desktop CTA had already
 * been changed.
 *
 * `Docs` is deliberately NOT here: it is the CTA in both places, so
 * listing it would render it twice.
 */
export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: 'Demos', href: '/#demos' },
  { label: 'Templates', href: '/templates' },
  { label: 'Blog', href: '/blog' },
];
