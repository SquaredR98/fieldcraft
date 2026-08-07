export type DocNavItem = {
  title: string;
  href: string;
  badge?: string;
};

export type DocNavSection = {
  label: string;
  items: DocNavItem[];
};
