import { useEffect } from "react";

export interface SeoOptions {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string | null;
  type?: "website" | "article";
  siteName?: string;
  twitterHandle?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string | null;
  tags?: string[];
  /** JSON-LD payload(s) to inject into the page head. */
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  /** Default-fallback values applied on cleanup so other pages keep working. */
  defaults?: {
    title?: string;
    description?: string;
  };
}

const MANAGED_ATTR = "data-managed-by-seo";

function ensureMeta(
  selector: string,
  attrs: Record<string, string>,
): HTMLMetaElement {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    el.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(el);
  } else {
    el.setAttribute(MANAGED_ATTR, "true");
  }
  return el;
}

function setMetaName(name: string, content: string | null | undefined) {
  if (!content) return;
  const el = ensureMeta(`meta[name="${name}"]`, { name });
  el.setAttribute("content", content);
}

function setMetaProperty(property: string, content: string | null | undefined) {
  if (!content) return;
  const el = ensureMeta(`meta[property="${property}"]`, { property });
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string | null | undefined) {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(el);
  } else {
    el.setAttribute(MANAGED_ATTR, "true");
  }
  el.setAttribute("href", href);
}

function setJsonLd(data: SeoOptions["jsonLd"]) {
  // Wipe any previously-managed JSON-LD blocks first.
  document.head
    .querySelectorAll(`script[type="application/ld+json"][${MANAGED_ATTR}]`)
    .forEach((node) => node.remove());
  if (!data) return;
  const items = Array.isArray(data) ? data : [data];
  for (const item of items) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(MANAGED_ATTR, "true");
    script.text = JSON.stringify(item);
    document.head.appendChild(script);
  }
}

export function useSeo(options: SeoOptions): void {
  useEffect(() => {
    const previousTitle = document.title;
    const siteName = options.siteName ?? "Blaze Studio";

    if (options.title) {
      document.title = options.title.includes(siteName)
        ? options.title
        : `${options.title} — ${siteName}`;
    }

    setMetaName("description", options.description);
    setLink("canonical", options.canonical);

    setMetaProperty("og:type", options.type ?? "website");
    setMetaProperty("og:site_name", siteName);
    setMetaProperty("og:title", options.title);
    setMetaProperty("og:description", options.description);
    setMetaProperty("og:url", options.canonical);
    setMetaProperty("og:image", options.image ?? undefined);

    if (options.type === "article") {
      setMetaProperty("article:published_time", options.publishedTime);
      setMetaProperty("article:modified_time", options.modifiedTime);
      setMetaProperty("article:author", options.author);
      setMetaProperty("article:section", options.section ?? undefined);
      // Reset existing article:tag entries first.
      document.head
        .querySelectorAll(
          `meta[property="article:tag"][${MANAGED_ATTR}]`,
        )
        .forEach((n) => n.remove());
      for (const tag of options.tags ?? []) {
        const m = document.createElement("meta");
        m.setAttribute("property", "article:tag");
        m.setAttribute("content", tag);
        m.setAttribute(MANAGED_ATTR, "true");
        document.head.appendChild(m);
      }
    }

    setMetaName("twitter:card", options.image ? "summary_large_image" : "summary");
    setMetaName("twitter:title", options.title);
    setMetaName("twitter:description", options.description);
    setMetaName("twitter:image", options.image ?? undefined);
    if (options.twitterHandle) {
      setMetaName("twitter:site", options.twitterHandle);
      setMetaName("twitter:creator", options.twitterHandle);
    }

    setJsonLd(options.jsonLd);

    return () => {
      if (options.defaults?.title) document.title = options.defaults.title;
      else document.title = previousTitle;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    options.title,
    options.description,
    options.canonical,
    options.image,
    options.type,
    options.publishedTime,
    options.modifiedTime,
    options.author,
    options.section,
    JSON.stringify(options.tags ?? []),
    JSON.stringify(options.jsonLd ?? null),
  ]);
}
