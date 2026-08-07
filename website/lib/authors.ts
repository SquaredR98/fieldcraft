export type Author = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
};

export const authors: Record<string, Author> = {
  ravi: {
    id: 'ravi',
    name: 'Ravi Ranjan',
    role: 'Maintainer',
    avatar: '/blog/authors/ravi.webp',
  },
};

export function getAuthor(id?: string): Author {
  return (id && authors[id]) || authors.ravi;
}
