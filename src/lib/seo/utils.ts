/**
 * SEO Utilities
 * 
 * Functions for managing meta tags, structured data, and SEO optimization
 */

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "music.song" | "music.playlist";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Update page meta tags
 */
export function updateMetaTags(data: SEOData) {
  // Update title
  document.title = `${data.title} | Syntax Audio Intelligence`;

  // Update or create meta tags
  const updateMetaTag = (name: string, content: string, attribute: string = "name") => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.content = content;
  };

  // Basic meta tags
  updateMetaTag("description", data.description);
  if (data.keywords) {
    updateMetaTag("keywords", data.keywords.join(", "));
  }
  updateMetaTag("author", data.author || "Syntax Audio Intelligence");

  // Open Graph tags
  updateMetaTag("og:title", data.title, "property");
  updateMetaTag("og:description", data.description, "property");
  updateMetaTag("og:type", data.type || "website", "property");
  if (data.url) {
    updateMetaTag("og:url", data.url, "property");
  }
  if (data.image) {
    updateMetaTag("og:image", data.image, "property");
  }

  // Twitter Card tags
  updateMetaTag("twitter:card", "summary_large_image");
  updateMetaTag("twitter:title", data.title);
  updateMetaTag("twitter:description", data.description);
  if (data.image) {
    updateMetaTag("twitter:image", data.image);
  }

  // Article-specific tags
  if (data.type === "article" || data.type === "music.song") {
    if (data.publishedTime) {
      updateMetaTag("article:published_time", data.publishedTime, "property");
    }
    if (data.modifiedTime) {
      updateMetaTag("article:modified_time", data.modifiedTime, "property");
    }
    if (data.author) {
      updateMetaTag("article:author", data.author, "property");
    }
  }
}

/**
 * Generate structured data (JSON-LD)
 */
export function generateStructuredData(data: SEOData & { 
  trackData?: {
    duration?: string;
    bpm?: number;
    key?: string;
  };
  mixData?: {
    trackCount?: number;
    totalDuration?: number;
  };
}) {
  const baseUrl = window.location.origin;
  
  let structuredData: any = {
    "@context": "https://schema.org",
    "@type": data.type === "music.song" ? "MusicRecording" : 
             data.type === "music.playlist" ? "MusicPlaylist" : "WebSite",
    "name": data.title,
    "description": data.description,
    "url": data.url || window.location.href,
  };

  if (data.type === "music.song" && data.trackData) {
    structuredData = {
      ...structuredData,
      "@type": "MusicRecording",
      "duration": data.trackData.duration,
      "inAlbum": {
        "@type": "MusicAlbum",
        "name": "Syntax Audio Intelligence"
      },
    };
  }

  if (data.type === "music.playlist" && data.mixData) {
    structuredData = {
      ...structuredData,
      "@type": "MusicPlaylist",
      "numTracks": data.mixData.trackCount,
    };
  }

  if (data.image) {
    structuredData.image = data.image;
  }

  if (data.author) {
    structuredData.author = {
      "@type": "Person",
      "name": data.author
    };
  }

  return structuredData;
}

/**
 * Inject structured data into page
 */
export function injectStructuredData(data: SEOData & any) {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // Create new structured data
  const structuredData = generateStructuredData(data);
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

/**
 * Generate sitemap.xml content
 */
export function generateSitemap(urls: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }>) {
  const baseUrl = window.location.origin;
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, lastmod, changefreq = "weekly", priority = 0.8 }) => `  <url>
    <loc>${baseUrl}${url}</loc>
    ${lastmod ? `    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return sitemap;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(allowAll: boolean = true, sitemapUrl?: string) {
  if (allowAll) {
    return `User-agent: *
Allow: /
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ""}`;
  } else {
    return `User-agent: *
Disallow: /
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ""}`;
  }
}

