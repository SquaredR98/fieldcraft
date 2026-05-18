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

  const width = config.width ?? "100%";
  const height = config.height ?? "auto";

  const containerStyle: React.CSSProperties = {
    padding: "1rem 0",
    width: "100%",
    maxWidth: width,
    margin: "0 auto",
  };

  // Render YouTube embed
  if (config.provider === "youtube") {
    const videoId = extractYouTubeId(config.src);
    const embedUrl = `https://www.youtube.com/embed/${videoId}${
      config.autoplay ? "?autoplay=1" : ""
    }${config.muted ? "&mute=1" : ""}`;

    return (
      <div style={containerStyle}>
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%", // 16:9 aspect ratio
            height: 0,
            overflow: "hidden",
          }}
        >
          <iframe
            src={embedUrl}
            title={field.label || "YouTube video"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "4px",
            }}
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
      <div style={containerStyle}>
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%", // 16:9 aspect ratio
            height: 0,
            overflow: "hidden",
          }}
        >
          <iframe
            src={embedUrl}
            title={field.label || "Vimeo video"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "4px",
            }}
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
      <div style={containerStyle}>
        <video
          src={config.src}
          poster={config.poster}
          controls
          autoPlay={config.autoplay}
          muted={config.muted}
          style={{
            width: "100%",
            height: height === "auto" ? "auto" : height,
            borderRadius: "4px",
          }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return null;
}
