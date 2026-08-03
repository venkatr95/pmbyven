"use client";

export function YouTube({ id, title = "YouTube video" }: { id: string; title?: string }) {
  return (
    <div className="my-8 aspect-video rounded-2xl overflow-hidden glass shadow-lg">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        loading="lazy"
      />
    </div>
  );
}

export function Tweet({ id }: { id: string }) {
  return (
    <div className="my-6 glass rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Post on X</p>
      <a
        href={`https://twitter.com/i/status/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary font-medium hover:underline"
      >
        View tweet {id} →
      </a>
      <blockquote className="twitter-tweet mt-3">
        <a href={`https://twitter.com/x/status/${id}`}>Loading…</a>
      </blockquote>
    </div>
  );
}

export function Spotify({ uri }: { uri: string }) {
  const embed = uri.includes("open.spotify.com")
    ? uri.replace("open.spotify.com", "open.spotify.com/embed")
    : `https://open.spotify.com/embed/${uri}`;
  return (
    <div className="my-8 rounded-2xl overflow-hidden">
      <iframe
        src={embed}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-2xl"
        title="Spotify embed"
      />
    </div>
  );
}

export function GitHubGist({ id }: { id: string }) {
  return (
    <div className="my-6 glass rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">GitHub Gist</p>
      <a
        href={`https://gist.github.com/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary font-medium hover:underline break-all"
      >
        gist.github.com/{id} →
      </a>
      <iframe
        src={`https://gist.github.com/${id}.pibb`}
        className="w-full min-h-[200px] mt-3 rounded-xl border-0 bg-transparent"
        title={`Gist ${id}`}
      />
    </div>
  );
}

export function FigmaEmbed({ url }: { url: string }) {
  const src = `https://www.figma.com/embed?embed_host=editorial&url=${encodeURIComponent(url)}`;
  return (
    <div className="my-8 aspect-[16/10] rounded-2xl overflow-hidden glass">
      <iframe src={src} className="w-full h-full" allowFullScreen title="Figma embed" loading="lazy" />
    </div>
  );
}

export function Loom({ id }: { id: string }) {
  return (
    <div className="my-8 aspect-video rounded-2xl overflow-hidden glass">
      <iframe
        src={`https://www.loom.com/embed/${id}`}
        className="w-full h-full"
        allowFullScreen
        title="Loom video"
        loading="lazy"
      />
    </div>
  );
}

export function PdfEmbed({ url, title = "PDF document" }: { url: string; title?: string }) {
  return (
    <div className="my-8 rounded-2xl overflow-hidden glass border border-border/50">
      <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border/50 flex justify-between">
        <span>{title}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          Open ↗
        </a>
      </div>
      <iframe src={url} className="w-full h-[480px]" title={title} />
    </div>
  );
}

export function VideoEmbed({ src, poster }: { src: string; poster?: string }) {
  return (
    <div className="my-8 rounded-2xl overflow-hidden">
      <video controls poster={poster} className="w-full rounded-2xl" preload="metadata">
        <source src={src} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
