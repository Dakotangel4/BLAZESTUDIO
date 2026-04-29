import { Router, type IRouter } from "express";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const STATIC_PAGES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/work", changefreq: "monthly", priority: "0.9" },
  { path: "/process", changefreq: "monthly", priority: "0.7" },
  { path: "/pricing", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "daily", priority: "0.9" },
];

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

function originFromRequest(host: string | undefined, protoHeader: string | undefined): string {
  const proto = (protoHeader ?? "https").split(",")[0]?.trim() || "https";
  return `${proto}://${host ?? "localhost"}`;
}

router.get("/sitemap.xml", async (req, res) => {
  try {
    const origin = originFromRequest(
      req.headers["x-forwarded-host"] as string | undefined ??
        req.headers.host,
      req.headers["x-forwarded-proto"] as string | undefined,
    );

    const posts = await db
      .select({
        slug: blogPostsTable.slug,
        updatedAt: blogPostsTable.updatedAt,
      })
      .from(blogPostsTable)
      .where(
        or(
          and(
            eq(blogPostsTable.status, "published"),
            sql`${blogPostsTable.publishedAt} IS NOT NULL`,
            sql`${blogPostsTable.publishedAt} <= NOW()`,
          ),
          and(
            eq(blogPostsTable.status, "scheduled"),
            sql`${blogPostsTable.scheduledAt} IS NOT NULL`,
            sql`${blogPostsTable.scheduledAt} <= NOW()`,
          ),
        ),
      )
      .orderBy(desc(blogPostsTable.updatedAt));

    const now = new Date().toISOString();
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    for (const page of STATIC_PAGES) {
      lines.push("  <url>");
      lines.push(`    <loc>${escapeXml(`${origin}${page.path}`)}</loc>`);
      lines.push(`    <lastmod>${now}</lastmod>`);
      lines.push(`    <changefreq>${page.changefreq}</changefreq>`);
      lines.push(`    <priority>${page.priority}</priority>`);
      lines.push("  </url>");
    }

    for (const post of posts) {
      const lastmod = post.updatedAt instanceof Date
        ? post.updatedAt.toISOString()
        : new Date(post.updatedAt).toISOString();
      lines.push("  <url>");
      lines.push(`    <loc>${escapeXml(`${origin}/blog/${post.slug}`)}</loc>`);
      lines.push(`    <lastmod>${lastmod}</lastmod>`);
      lines.push("    <changefreq>weekly</changefreq>");
      lines.push("    <priority>0.7</priority>");
      lines.push("  </url>");
    }

    lines.push("</urlset>");

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.status(200).send(lines.join("\n"));
  } catch (err) {
    logger.error({ err }, "Failed to build sitemap.xml");
    res.status(500).send("Failed to build sitemap");
  }
});

export default router;
