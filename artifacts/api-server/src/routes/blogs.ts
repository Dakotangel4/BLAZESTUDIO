import { Router, type IRouter } from "express";
import { eq, desc, sql, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  AdminCreateBlogCategoryBody,
  AdminUpdateBlogCategoryBody,
  AdminCreateBlogPostBody,
  AdminUpdateBlogPostBody,
  AdminBulkBlogPostsBody,
  type AdminBlogCategory,
  type AdminBlogCategoryList,
  type AdminBlogPost,
  type AdminBlogPostList,
  type AdminBlogBulkResult,
  type AdminDeleteResult,
} from "@workspace/api-zod";
import {
  db,
  blogCategoriesTable,
  blogPostsTable,
} from "@workspace/db";
import { logger } from "../lib/logger";
import { requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

router.use("/admin/blog-categories", requireAdmin);
router.use("/admin/blog-posts", requireAdmin);

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 200);
}

function computeReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text === "" ? 0 : text.split(" ").length;
  return Math.max(1, Math.round(words / 200));
}

function describeIssues(error: z.ZodError): string[] {
  return error.issues.map(
    (i: z.ZodIssue) => `${i.path.join(".") || "(root)"}: ${i.message}`,
  );
}

function toCategory(
  row: typeof blogCategoriesTable.$inferSelect,
  postCount: number,
): AdminBlogCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? null,
    postCount,
    createdAt: row.createdAt,
  };
}

function toPost(
  row: typeof blogPostsTable.$inferSelect,
  categoryName: string | null,
): AdminBlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    featuredImage: row.featuredImage ?? null,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    categoryId: row.categoryId ?? null,
    categoryName,
    tags: row.tags ?? [],
    author: row.author,
    status: row.status,
    scheduledAt: row.scheduledAt ?? null,
    publishedAt: row.publishedAt ?? null,
    readingTime: row.readingTime,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function ensureUniqueSlug(
  desired: string,
  excludeId?: number,
): Promise<string> {
  const base = slugify(desired) || `post-${Date.now()}`;
  let candidate = base;
  let n = 2;
  // Loop until we find a free slug
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await db
      .select({ id: blogPostsTable.id })
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, candidate))
      .limit(1);
    if (existing.length === 0 || existing[0].id === excludeId) return candidate;
    candidate = `${base}-${n++}`;
  }
}

async function ensureUniqueCategorySlug(
  desired: string,
  excludeId?: number,
): Promise<string> {
  const base = slugify(desired) || `category-${Date.now()}`;
  let candidate = base;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await db
      .select({ id: blogCategoriesTable.id })
      .from(blogCategoriesTable)
      .where(eq(blogCategoriesTable.slug, candidate))
      .limit(1);
    if (existing.length === 0 || existing[0].id === excludeId) return candidate;
    candidate = `${base}-${n++}`;
  }
}

// --- Categories ---

router.get("/admin/blog-categories", async (_req, res) => {
  try {
    const rows = await db
      .select({
        cat: blogCategoriesTable,
        count: sql<number>`COUNT(${blogPostsTable.id})::int`,
      })
      .from(blogCategoriesTable)
      .leftJoin(
        blogPostsTable,
        eq(blogPostsTable.categoryId, blogCategoriesTable.id),
      )
      .groupBy(blogCategoriesTable.id)
      .orderBy(blogCategoriesTable.name);
    const payload: AdminBlogCategoryList = {
      categories: rows.map((r) => toCategory(r.cat, r.count ?? 0)),
    };
    res.status(200).json(payload);
  } catch (err) {
    logger.error({ err }, "Failed to list blog categories");
    res.status(500).json({ error: "Failed to load categories" });
  }
});

router.post("/admin/blog-categories", async (req, res) => {
  const parsed = AdminCreateBlogCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid category", details: describeIssues(parsed.error) });
    return;
  }
  const data = parsed.data;
  const name = data.name.trim();
  const slug = await ensureUniqueCategorySlug(data.slug?.trim() || name);

  try {
    const [row] = await db
      .insert(blogCategoriesTable)
      .values({
        name,
        slug,
        description: data.description?.trim() || null,
      })
      .returning();
    res.status(201).json(toCategory(row, 0));
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "23505"
    ) {
      res.status(409).json({ error: "A category with that name already exists" });
      return;
    }
    logger.error({ err }, "Failed to create blog category");
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.patch("/admin/blog-categories/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = AdminUpdateBlogCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid update", details: describeIssues(parsed.error) });
    return;
  }

  const updates: Record<string, string | null> = {};
  if (parsed.data.name) updates.name = parsed.data.name.trim();
  if (parsed.data.slug) {
    updates.slug = await ensureUniqueCategorySlug(parsed.data.slug.trim(), id);
  } else if (parsed.data.name) {
    updates.slug = await ensureUniqueCategorySlug(parsed.data.name.trim(), id);
  }
  if (parsed.data.description !== undefined) {
    updates.description = parsed.data.description?.trim() || null;
  }

  try {
    const [row] = await db
      .update(blogCategoriesTable)
      .set(updates)
      .where(eq(blogCategoriesTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(blogPostsTable)
      .where(eq(blogPostsTable.categoryId, id));
    res.status(200).json(toCategory(row, count ?? 0));
  } catch (err) {
    logger.error({ err, id }, "Failed to update category");
    res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/admin/blog-categories/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [row] = await db
      .delete(blogCategoriesTable)
      .where(eq(blogCategoriesTable.id, id))
      .returning({ id: blogCategoriesTable.id });
    if (!row) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    const payload: AdminDeleteResult = { id: row.id, deleted: true };
    res.status(200).json(payload);
  } catch (err) {
    logger.error({ err, id }, "Failed to delete category");
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// --- Blog Posts ---

async function loadPostWithCategoryName(id: number): Promise<AdminBlogPost | null> {
  const rows = await db
    .select({
      post: blogPostsTable,
      categoryName: blogCategoriesTable.name,
    })
    .from(blogPostsTable)
    .leftJoin(
      blogCategoriesTable,
      eq(blogCategoriesTable.id, blogPostsTable.categoryId),
    )
    .where(eq(blogPostsTable.id, id))
    .limit(1);
  if (rows.length === 0) return null;
  return toPost(rows[0].post, rows[0].categoryName ?? null);
}

router.get("/admin/blog-posts", async (_req, res) => {
  try {
    const rows = await db
      .select({
        post: blogPostsTable,
        categoryName: blogCategoriesTable.name,
      })
      .from(blogPostsTable)
      .leftJoin(
        blogCategoriesTable,
        eq(blogCategoriesTable.id, blogPostsTable.categoryId),
      )
      .orderBy(desc(blogPostsTable.updatedAt));
    const payload: AdminBlogPostList = {
      posts: rows.map((r) => toPost(r.post, r.categoryName ?? null)),
    };
    res.status(200).json(payload);
  } catch (err) {
    logger.error({ err }, "Failed to list blog posts");
    res.status(500).json({ error: "Failed to load posts" });
  }
});

router.get("/admin/blog-posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const post = await loadPostWithCategoryName(id);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.status(200).json(post);
});

router.post("/admin/blog-posts", async (req, res) => {
  const parsed = AdminCreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid post", details: describeIssues(parsed.error) });
    return;
  }
  const data = parsed.data;
  const title = (data.title ?? "Untitled draft").trim() || "Untitled draft";
  const slug = await ensureUniqueSlug(data.slug?.trim() || title);
  const status = data.status ?? "draft";
  const content = data.content ?? "";
  const now = new Date();

  try {
    const [row] = await db
      .insert(blogPostsTable)
      .values({
        title,
        slug,
        excerpt: data.excerpt ?? "",
        content,
        featuredImage: data.featuredImage ?? null,
        metaTitle: data.metaTitle ?? "",
        metaDescription: data.metaDescription ?? "",
        categoryId: data.categoryId ?? null,
        tags: data.tags ?? [],
        author: data.author?.trim() || "Akpomovine Jerrison",
        status,
        scheduledAt:
          status === "scheduled" && data.scheduledAt
            ? new Date(data.scheduledAt)
            : null,
        publishedAt: status === "published" ? now : null,
        readingTime: computeReadingTime(content),
      })
      .returning();
    const post = await loadPostWithCategoryName(row.id);
    res.status(201).json(post);
  } catch (err) {
    logger.error({ err }, "Failed to create post");
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.patch("/admin/blog-posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = AdminUpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid update", details: describeIssues(parsed.error) });
    return;
  }

  const existing = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.id, id))
    .limit(1);
  if (existing.length === 0) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  const before = existing[0];

  const data = parsed.data;
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (data.title !== undefined) updates.title = data.title.trim();
  if (data.slug !== undefined) {
    updates.slug = await ensureUniqueSlug(data.slug.trim() || before.title, id);
  }
  if (data.excerpt !== undefined) updates.excerpt = data.excerpt;
  if (data.content !== undefined) {
    updates.content = data.content;
    updates.readingTime = computeReadingTime(data.content);
  }
  if (data.featuredImage !== undefined) updates.featuredImage = data.featuredImage;
  if (data.metaTitle !== undefined) updates.metaTitle = data.metaTitle;
  if (data.metaDescription !== undefined)
    updates.metaDescription = data.metaDescription;
  if (data.categoryId !== undefined) updates.categoryId = data.categoryId;
  if (data.tags !== undefined) updates.tags = data.tags;
  if (data.author !== undefined) updates.author = data.author.trim();

  if (data.status !== undefined) {
    updates.status = data.status;
    if (data.status === "published") {
      updates.publishedAt = before.publishedAt ?? new Date();
      updates.scheduledAt = null;
    } else if (data.status === "scheduled") {
      updates.scheduledAt = data.scheduledAt
        ? new Date(data.scheduledAt)
        : (before.scheduledAt ?? null);
      updates.publishedAt = null;
    } else if (data.status === "draft") {
      updates.publishedAt = null;
      updates.scheduledAt = null;
    }
  } else if (data.scheduledAt !== undefined && before.status === "scheduled") {
    updates.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
  }

  try {
    await db
      .update(blogPostsTable)
      .set(updates)
      .where(eq(blogPostsTable.id, id));
    const post = await loadPostWithCategoryName(id);
    res.status(200).json(post);
  } catch (err) {
    logger.error({ err, id }, "Failed to update post");
    res.status(500).json({ error: "Failed to update post" });
  }
});

router.delete("/admin/blog-posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [row] = await db
      .delete(blogPostsTable)
      .where(eq(blogPostsTable.id, id))
      .returning({ id: blogPostsTable.id });
    if (!row) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    const payload: AdminDeleteResult = { id: row.id, deleted: true };
    res.status(200).json(payload);
  } catch (err) {
    logger.error({ err, id }, "Failed to delete post");
    res.status(500).json({ error: "Failed to delete post" });
  }
});

router.post("/admin/blog-posts/bulk", async (req, res) => {
  const parsed = AdminBulkBlogPostsBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid bulk request", details: describeIssues(parsed.error) });
    return;
  }
  const { ids, action } = parsed.data;
  try {
    let affected = 0;
    if (action === "delete") {
      const rows = await db
        .delete(blogPostsTable)
        .where(inArray(blogPostsTable.id, ids))
        .returning({ id: blogPostsTable.id });
      affected = rows.length;
    } else if (action === "publish") {
      const rows = await db
        .update(blogPostsTable)
        .set({
          status: "published",
          publishedAt: new Date(),
          scheduledAt: null,
          updatedAt: new Date(),
        })
        .where(inArray(blogPostsTable.id, ids))
        .returning({ id: blogPostsTable.id });
      affected = rows.length;
    } else if (action === "unpublish") {
      const rows = await db
        .update(blogPostsTable)
        .set({
          status: "draft",
          publishedAt: null,
          scheduledAt: null,
          updatedAt: new Date(),
        })
        .where(inArray(blogPostsTable.id, ids))
        .returning({ id: blogPostsTable.id });
      affected = rows.length;
    }
    const payload: AdminBlogBulkResult = { affected, action };
    res.status(200).json(payload);
  } catch (err) {
    logger.error({ err, action }, "Failed bulk action");
    res.status(500).json({ error: "Bulk action failed" });
  }
});

export default router;
