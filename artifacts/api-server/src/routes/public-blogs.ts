import { Router, type IRouter } from "express";
import { and, asc, desc, eq, gt, lt, ne, or, sql } from "drizzle-orm";
import {
  db,
  blogCategoriesTable,
  blogPostsTable,
} from "@workspace/db";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 24;

type PostRow = typeof blogPostsTable.$inferSelect;

interface PostWithCategory {
  post: PostRow;
  categoryName: string | null;
  categorySlug: string | null;
}

function effectivePublishDate(row: PostRow): Date {
  if (row.status === "published" && row.publishedAt) return row.publishedAt;
  if (row.status === "scheduled" && row.scheduledAt) return row.scheduledAt;
  // Fallback - should never happen for public posts
  return row.updatedAt;
}

function toSummary(row: PostWithCategory) {
  const publishedAt = effectivePublishDate(row.post);
  return {
    id: row.post.id,
    title: row.post.title,
    slug: row.post.slug,
    excerpt: row.post.excerpt,
    featuredImage: row.post.featuredImage ?? null,
    categorySlug: row.categorySlug ?? null,
    categoryName: row.categoryName ?? null,
    tags: row.post.tags ?? [],
    author: row.post.author,
    publishedAt,
    updatedAt: row.post.updatedAt,
    readingTime: row.post.readingTime,
  };
}

function toPublic(row: PostWithCategory) {
  const publishedAt = effectivePublishDate(row.post);
  return {
    id: row.post.id,
    title: row.post.title,
    slug: row.post.slug,
    excerpt: row.post.excerpt,
    content: row.post.content,
    featuredImage: row.post.featuredImage ?? null,
    metaTitle: row.post.metaTitle,
    metaDescription: row.post.metaDescription,
    categorySlug: row.categorySlug ?? null,
    categoryName: row.categoryName ?? null,
    tags: row.post.tags ?? [],
    author: row.post.author,
    publishedAt,
    updatedAt: row.post.updatedAt,
    readingTime: row.post.readingTime,
  };
}

/**
 * SQL fragment that selects only posts that are public *right now* —
 * either explicitly published with a publish date in the past, or scheduled
 * with a scheduled time that has been reached.
 */
function publicVisibilityClause() {
  // Use NOW() at the database level so the cutoff is always fresh and we
  // never accidentally serve a scheduled post before its time.
  return or(
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
  );
}

/**
 * SQL expression returning the effective publish timestamp (publishedAt for
 * published posts, scheduledAt for scheduled posts that have reached their
 * time). Used for ordering / prev-next navigation.
 */
const effectivePublishedSql = sql<Date>`COALESCE(${blogPostsTable.publishedAt}, ${blogPostsTable.scheduledAt})`;

router.get("/blog/posts", async (req, res) => {
  const categorySlug = typeof req.query.category === "string" ? req.query.category.trim() : "";
  const search = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const limitRaw = Number(req.query.limit);
  const offsetRaw = Number(req.query.offset);
  const limit = Number.isFinite(limitRaw) && limitRaw > 0
    ? Math.min(limitRaw, MAX_LIMIT)
    : DEFAULT_LIMIT;
  const offset = Number.isFinite(offsetRaw) && offsetRaw > 0 ? offsetRaw : 0;

  try {
    const conditions = [publicVisibilityClause()];
    if (categorySlug) {
      conditions.push(eq(blogCategoriesTable.slug, categorySlug));
    }
    if (search) {
      const term = `%${search.toLowerCase()}%`;
      conditions.push(
        or(
          sql`LOWER(${blogPostsTable.title}) LIKE ${term}`,
          sql`LOWER(${blogPostsTable.excerpt}) LIKE ${term}`,
        )!,
      );
    }
    const whereClause = and(...conditions);

    const [{ total }] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(blogPostsTable)
      .leftJoin(
        blogCategoriesTable,
        eq(blogCategoriesTable.id, blogPostsTable.categoryId),
      )
      .where(whereClause);

    const rows = await db
      .select({
        post: blogPostsTable,
        categoryName: blogCategoriesTable.name,
        categorySlug: blogCategoriesTable.slug,
      })
      .from(blogPostsTable)
      .leftJoin(
        blogCategoriesTable,
        eq(blogCategoriesTable.id, blogPostsTable.categoryId),
      )
      .where(whereClause)
      .orderBy(desc(effectivePublishedSql), desc(blogPostsTable.id))
      .limit(limit)
      .offset(offset);

    res.status(200).json({
      posts: rows.map(toSummary),
      total: total ?? 0,
      limit,
      offset,
    });
  } catch (err) {
    logger.error({ err }, "Failed to list public blog posts");
    res.status(500).json({ error: "Failed to load posts" });
  }
});

router.get("/blog/categories", async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: blogCategoriesTable.id,
        name: blogCategoriesTable.name,
        slug: blogCategoriesTable.slug,
        description: blogCategoriesTable.description,
        postCount: sql<number>`COUNT(${blogPostsTable.id})::int`,
      })
      .from(blogCategoriesTable)
      .innerJoin(
        blogPostsTable,
        and(
          eq(blogPostsTable.categoryId, blogCategoriesTable.id),
          publicVisibilityClause(),
        ),
      )
      .groupBy(blogCategoriesTable.id)
      .orderBy(blogCategoriesTable.name);

    res.status(200).json({
      categories: rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description ?? null,
        postCount: r.postCount ?? 0,
      })),
    });
  } catch (err) {
    logger.error({ err }, "Failed to list public blog categories");
    res.status(500).json({ error: "Failed to load categories" });
  }
});

router.get("/blog/sitemap", async (_req, res) => {
  try {
    const rows = await db
      .select({
        slug: blogPostsTable.slug,
        publishedAt: effectivePublishedSql,
        updatedAt: blogPostsTable.updatedAt,
      })
      .from(blogPostsTable)
      .where(publicVisibilityClause())
      .orderBy(desc(effectivePublishedSql));

    res.status(200).json({
      entries: rows.map((r) => ({
        slug: r.slug,
        publishedAt: r.publishedAt,
        updatedAt: r.updatedAt,
      })),
    });
  } catch (err) {
    logger.error({ err }, "Failed to build sitemap");
    res.status(500).json({ error: "Failed to build sitemap" });
  }
});

router.get("/blog/posts/:slug", async (req, res) => {
  const slug = req.params.slug?.trim();
  if (!slug) {
    res.status(400).json({ error: "Missing slug" });
    return;
  }

  try {
    const rows = await db
      .select({
        post: blogPostsTable,
        categoryName: blogCategoriesTable.name,
        categorySlug: blogCategoriesTable.slug,
      })
      .from(blogPostsTable)
      .leftJoin(
        blogCategoriesTable,
        eq(blogCategoriesTable.id, blogPostsTable.categoryId),
      )
      .where(and(eq(blogPostsTable.slug, slug), publicVisibilityClause()))
      .limit(1);

    if (rows.length === 0) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const current = rows[0];
    const currentPublishedAt = effectivePublishDate(current.post);

    // Previous = older publish date than current; Next = newer publish date.
    const [previousRow, nextRow] = await Promise.all([
      db
        .select({
          post: blogPostsTable,
          categoryName: blogCategoriesTable.name,
          categorySlug: blogCategoriesTable.slug,
        })
        .from(blogPostsTable)
        .leftJoin(
          blogCategoriesTable,
          eq(blogCategoriesTable.id, blogPostsTable.categoryId),
        )
        .where(
          and(
            publicVisibilityClause(),
            ne(blogPostsTable.id, current.post.id),
            lt(effectivePublishedSql, currentPublishedAt),
          ),
        )
        .orderBy(desc(effectivePublishedSql))
        .limit(1),
      db
        .select({
          post: blogPostsTable,
          categoryName: blogCategoriesTable.name,
          categorySlug: blogCategoriesTable.slug,
        })
        .from(blogPostsTable)
        .leftJoin(
          blogCategoriesTable,
          eq(blogCategoriesTable.id, blogPostsTable.categoryId),
        )
        .where(
          and(
            publicVisibilityClause(),
            ne(blogPostsTable.id, current.post.id),
            gt(effectivePublishedSql, currentPublishedAt),
          ),
        )
        .orderBy(asc(effectivePublishedSql))
        .limit(1),
    ]);

    // Related = up to 3 other public posts in the same category, newest first.
    const relatedRows = current.post.categoryId
      ? await db
          .select({
            post: blogPostsTable,
            categoryName: blogCategoriesTable.name,
            categorySlug: blogCategoriesTable.slug,
          })
          .from(blogPostsTable)
          .leftJoin(
            blogCategoriesTable,
            eq(blogCategoriesTable.id, blogPostsTable.categoryId),
          )
          .where(
            and(
              publicVisibilityClause(),
              ne(blogPostsTable.id, current.post.id),
              eq(blogPostsTable.categoryId, current.post.categoryId),
            ),
          )
          .orderBy(desc(effectivePublishedSql))
          .limit(3)
      : [];

    // Top up related with newest other posts if fewer than 3 same-category exist.
    let related = relatedRows;
    if (related.length < 3) {
      const fillerRows = await db
        .select({
          post: blogPostsTable,
          categoryName: blogCategoriesTable.name,
          categorySlug: blogCategoriesTable.slug,
        })
        .from(blogPostsTable)
        .leftJoin(
          blogCategoriesTable,
          eq(blogCategoriesTable.id, blogPostsTable.categoryId),
        )
        .where(
          and(publicVisibilityClause(), ne(blogPostsTable.id, current.post.id)),
        )
        .orderBy(desc(effectivePublishedSql))
        .limit(8);

      const seen = new Set(related.map((r) => r.post.id));
      for (const row of fillerRows) {
        if (related.length >= 3) break;
        if (seen.has(row.post.id)) continue;
        related.push(row);
        seen.add(row.post.id);
      }
    }

    res.status(200).json({
      post: toPublic(current),
      previous: previousRow[0] ? toSummary(previousRow[0]) : null,
      next: nextRow[0] ? toSummary(nextRow[0]) : null,
      related: related.map(toSummary),
    });
  } catch (err) {
    logger.error({ err, slug }, "Failed to load public blog post");
    res.status(500).json({ error: "Failed to load post" });
  }
});

export default router;
