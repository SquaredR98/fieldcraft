import './styles.css';

interface BlogMastheadProps {
  postCount: number;
}

export function BlogMasthead({ postCount }: BlogMastheadProps) {
  return (
    <div className="fc-blog-masthead">
      <div className="fc-blog-masthead__inner">
        <div className="fc-blog-masthead__left">
          <span className="fc-blog-masthead__eyebrow">
            Field notes &middot; {postCount}{' '}
            {postCount === 1 ? 'post' : 'posts'}
          </span>
          <h1 className="fc-blog-masthead__heading">
            Notes from the workshop
          </h1>
          <p className="fc-blog-masthead__subtitle">
            Release notes, schema patterns and the reasoning behind the
            engine&rsquo;s design decisions. Written while building it, so the
            posting is irregular.
          </p>
        </div>
        <div className="fc-blog-masthead__links">
          <a
            href="https://github.com/SquaredR98/fieldcraft/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            Releases &rarr;
          </a>
          <a href="/changelog">Changelog &rarr;</a>
          <a
            href="https://github.com/SquaredR98/fieldcraft"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
