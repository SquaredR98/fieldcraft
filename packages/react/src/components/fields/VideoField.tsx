import type { VideoConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/
  );
  return match?.[1] ?? url;
}

/**
 * Extract Vimeo video ID from URL
 */
function extractVimeoId(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match?.[1] ?? url;
}

export function VideoField({ field }: FieldProps) {
  const config = field.config as VideoConfig | undefined;

  if (!config?.src || !config?.provider) return null;

  const widthStyle = config.width ? { maxWidth: config.width } : {};

  // Render YouTube embed
  if (config.provider === "youtube") {
    const videoId = extractYouTubeId(config.src);
    const embedUrl = `https://www.youtube.com/embed/${videoId}${
      config.autoplay ? "?autoplay=1" : ""
    }${config.muted ? "&mute=1" : ""}`;

    return (
      <div className="fc-video" style={widthStyle}>
        <div className="fc-video__aspect">
          <iframe
            src={embedUrl}
            title={field.label || "YouTube video"}
            className="fc-video__iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // Render Vimeo embed
  if (config.provider === "vimeo") {
    const videoId = extractVimeoId(config.src);
    const embedUrl = `https://player.vimeo.com/video/${videoId}${
      config.autoplay ? "?autoplay=1" : ""
    }${config.muted ? "&muted=1" : ""}`;

    return (
      <div className="fc-video" style={widthStyle}>
        <div className="fc-video__aspect">
          <iframe
            src={embedUrl}
            title={field.label || "Vimeo video"}
            className="fc-video__iframe"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // Render native HTML5 video for direct URLs
  if (config.provider === "url") {
    return (
      <div className="fc-video" style={widthStyle}>
        <video
          src={config.src}
          poster={config.poster}
          controls
          autoPlay={config.autoplay}
          muted={config.muted}
          className="fc-video__native"
          style={config.height ? { height: config.height } : undefined}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return null;
}
