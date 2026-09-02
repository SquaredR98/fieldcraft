export type Author = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
};

export const authors: Record<string, Author> = {
  squaredr: {
    id: 'squaredr',
    name: 'SquaredR',
    role: 'Maintainer',
  },
};

export function getAuthor(id?: string): Author {
  return (id && authors[id]) || authors.squaredr;
}
