import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { blogCategoriesTable } from "./blog-categories";

export const BLOG_STATUSES = ["draft", "published", "scheduled"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  featuredImage: text("featured_image"),
  metaTitle: text("meta_title").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  categoryId: integer("category_id").references(() => blogCategoriesTable.id, {
    onDelete: "set null",
  }),
  tags: text("tags")
    .array()
    .notNull()
    .default([] as string[]),
  author: text("author").notNull().default("Akpomovine Jerrison"),
  status: text("status", { enum: BLOG_STATUSES }).notNull().default("draft"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  readingTime: integer("reading_time").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type BlogPost = typeof blogPostsTable.$inferSelect;
