import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Linkedin, Mail, Share2, Twitter } from "lucide-react";

interface Props {
  url: string;
  title: string;
  excerpt?: string;
}

export default function ShareButtons({ url, title, excerpt }: Props) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedExcerpt = encodeURIComponent(excerpt ?? "");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url, title, text: excerpt });
      } catch {
        // user cancelled
      }
    } else {
      copyLink();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="share-buttons">
      <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">
        Share
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        asChild
        data-testid="share-twitter"
      >
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter / X"
        >
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        asChild
        data-testid="share-linkedin"
      >
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        asChild
        data-testid="share-email"
      >
        <a
          href={`mailto:?subject=${encodedTitle}&body=${encodedExcerpt}%0A%0A${encodedUrl}`}
          aria-label="Share via email"
        >
          <Mail className="h-4 w-4" />
        </a>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={copyLink}
        data-testid="share-copy"
        aria-label={copied ? "Link copied" : "Copy link"}
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      {typeof navigator !== "undefined" && "share" in navigator ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={nativeShare}
          data-testid="share-native"
          aria-label="Open native share"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
