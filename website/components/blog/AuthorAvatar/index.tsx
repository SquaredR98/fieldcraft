interface AuthorAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function AuthorAvatar({ name, size = 30, className }: AuthorAvatarProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={`Avatar for ${name}`}
    >
      <rect width={size} height={size} fill="var(--teal)" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="var(--teal-on)"
        fontSize={size * 0.38}
        fontFamily="var(--font-mono)"
        fontWeight="600"
      >
        {initials}
      </text>
    </svg>
  );
}
